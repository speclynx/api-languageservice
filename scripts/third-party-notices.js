import fs from 'node:fs';
import path from 'node:path';
import licenseWebpackPlugin from 'license-webpack-plugin';

const { LicenseWebpackPlugin } = licenseWebpackPlugin;

/**
 * The UMD bundles this repository publishes declare no `externals`, so every
 * production dependency is embedded in them and each bundle becomes the
 * distributor of everything it absorbs. The licences and copyright notices that
 * npm would otherwise deliver alongside each dependency are collected here into
 * a THIRD-PARTY-NOTICES.txt beside the bundle.
 *
 * The gate is that the build fails closed: every module in the final
 * compilation carries a name, a version, an SPDX classification, complete
 * licence text and any separate NOTICE content, or the build stops. A licence
 * that says the copyright and permission notice must travel with the code is
 * not satisfied by naming the licence, so a package that publishes no notice of
 * its own needs a reviewed copy held beside the build and recorded with where it
 * came from.
 *
 * Both published packages need this treatment: the compatibility wrapper
 * re-exports the language service and therefore embeds it, and everything it
 * embeds, a second time.
 */

/**
 * The notice a package publishes somewhere other than a licence file, kept in
 * the build's own recovered-licence directory and used only when the package
 * itself carries nothing the plugin can find. Reading it back through this
 * function is what makes the table self-checking: it is consulted for the
 * versions it was reviewed against, and for nothing else.
 */
const recoverNotice = (packageName, licenseType, context) => {
  const notice = context.recoveredNotices[packageName];

  if (notice === undefined) {
    throw new Error(
      `${packageName} is bundled into ${context.packageName} and publishes no licence text, ` +
        'so the package cannot carry the notice it is redistributed under. Find the notice ' +
        `the project publishes, add it to ${context.recoveredDirectoryLabel}, and record where ` +
        `it came from in ${context.recoveredDirectoryLabel}/recovered.json.`,
    );
  }

  if (licenseType !== notice.license) {
    throw new Error(
      `${packageName} now declares ${String(licenseType)} where the notice held for it in ` +
        `${context.recoveredDirectoryLabel} was reviewed as ${notice.license}. Review the ` +
        'notice the project publishes now and update the recovered copy.',
    );
  }

  context.recovered.add(packageName);
  const text = fs.readFileSync(path.join(context.recoveredDirectory, notice.file), 'utf8');
  // Trimmed at the ends only: the first line of a licence is often centred, and
  // the indentation that centres it is part of the text.
  return `${notice.source}\n\n${text.replace(/^\n+/, '').replace(/\s+$/, '')}`;
};

/**
 * Fails the build when the recovered notices no longer describe what is being
 * bundled: a version other than the one each was reviewed against, or an entry
 * nothing needed, which means the package has started publishing its own.
 */
const checkRecoveredNotices = (modules, context) => {
  for (const [packageName, notice] of Object.entries(context.recoveredNotices)) {
    const module = modules.find((candidate) => candidate.name === packageName);

    if (!context.recovered.has(packageName)) {
      throw new Error(
        `The notice held for ${packageName} in ${context.recoveredDirectoryLabel} was not ` +
          `needed: it ${module === undefined ? 'is no longer bundled' : 'publishes its own now'}` +
          '. Remove it, and its entry in recovered.json.',
      );
    }

    if (module.packageJson.version !== notice.version) {
      throw new Error(
        `${packageName}@${module.packageJson.version} is bundled, but the notice held for it ` +
          `in ${context.recoveredDirectoryLabel} was reviewed against ${notice.version}. Check ` +
          'that the project still publishes the same notice, then record the version it was ' +
          'reviewed against.',
      );
    }
  }
};

/**
 * What a package says in its own NOTICE file. Apache-2.0 section 4(d) asks for
 * those to travel with the code that carries them, so they are reproduced under
 * the licence rather than left behind in a package nobody installs any more.
 */
const noticeOf = (module) => {
  const notice = fs
    .readdirSync(module.directory)
    .find(
      (entry) =>
        /^notice(\.|$)/i.test(entry) && fs.statSync(path.join(module.directory, entry)).isFile(),
    );

  return notice === undefined
    ? []
    : [
        `The NOTICE distributed with ${module.name}:`,
        '',
        fs.readFileSync(path.join(module.directory, notice), 'utf8').replace(/\s+$/, ''),
        '',
      ];
};

/**
 * A package-by-package inventory of what the bundle redistributes, written
 * beside it. The copyright review acts on this rather than on summary counts,
 * and it is what the publication's legal gate hands over; the notices file is
 * the evidence behind it and is too long to read as a list.
 */
const writeInventory = (modules, packageName, inventoryPath) => {
  const rows = modules
    .slice()
    .sort((one, other) => one.name.localeCompare(other.name))
    .map((module) => `${module.name}\t${module.packageJson.version}\t${module.licenseId ?? ''}`);

  fs.mkdirSync(path.dirname(inventoryPath), { recursive: true });
  fs.writeFileSync(
    inventoryPath,
    [
      `# Third-party packages bundled into ${packageName}`,
      `# ${rows.length} packages; name, version, SPDX licence identifier`,
      ...rows,
      '',
    ].join('\n'),
  );
};

/**
 * The plugin and the warning filter that belongs with it, for one bundle.
 *
 * `packageName` names the distributable in the generated file's header,
 * `recoveredDirectory` holds the reviewed notices and their recovered.json,
 * `licenseTextOverrides` supplies the licence of a package that does not carry
 * one where the plugin looks, and `additionalModules` names packages whose code
 * another package inlines and webpack therefore never resolves.
 */
export const thirdPartyNotices = ({
  packageName,
  recoveredDirectory,
  inventoryPath,
  licenseTextOverrides = {},
  additionalModules = [],
}) => {
  const recoveredNotices = JSON.parse(
    fs.readFileSync(path.join(recoveredDirectory, 'recovered.json'), 'utf8'),
  );
  const context = {
    packageName,
    recoveredDirectory,
    recoveredDirectoryLabel: path.relative(process.cwd(), recoveredDirectory) || recoveredDirectory,
    recoveredNotices,
    recovered: new Set(),
  };

  const plugin = new LicenseWebpackPlugin({
    outputFilename: 'THIRD-PARTY-NOTICES.txt',
    perChunkOutput: false,
    unacceptableLicenseTest: (type) => /^(?:GPL|AGPL|LGPL|SSPL)/i.test(type),
    licenseTextOverrides,
    additionalModules,
    handleMissingLicenseText: (missingPackageName, licenseType) =>
      recoverNotice(missingPackageName, licenseType, context),
    renderLicenses: (modules) => {
      checkRecoveredNotices(modules, context);
      writeInventory(modules, packageName, inventoryPath);

      return [
        `This file lists the open source software bundled into ${packageName},`,
        'with the licence each is distributed under.',
        `${packageName} itself is licensed under Apache-2.0; see LICENSES/Apache-2.0.txt.`,
        '',
        ...modules
          .slice()
          .sort((one, other) => one.name.localeCompare(other.name))
          .flatMap((module) => [
            '-'.repeat(78),
            `${module.name}@${module.packageJson.version} — ${module.licenseId ?? 'see below'}`,
            '-'.repeat(78),
            '',
            module.licenseText ?? '',
            '',
            ...noticeOf(module),
          ]),
      ].join('\n');
    },
  });

  /**
   * The notice reader warns before asking what to do about a package that
   * publishes no licence text, suggesting the option this build answers with
   * instead. The warning is silenced for the packages a reviewed notice is held
   * for, and only those: anything else fails the build there and then.
   */
  const recoveredWarning = new RegExp(
    `could not find any license file for (?:${Object.keys(recoveredNotices)
      .map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|')})\\.`,
  );

  return {
    plugin,
    // The reader pushes its warnings as plain strings rather than as errors.
    ignoreWarning: (warning) =>
      Object.keys(recoveredNotices).length > 0 &&
      recoveredWarning.test(String(warning.message ?? warning)),
  };
};

