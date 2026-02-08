const { minify_sync } = require('terser');
const JavaScriptObfuscator = require('javascript-obfuscator');

const defaultObfuscatorOptions = {
  stringArray: true,
  stringArrayThreshold: 0.5,
  splitStrings: true,
  splitStringsChunkLength: 10,
};

module.exports = function (api, options = {}) {
  const { minify = false, ...obfuscatorOpts } = options;

  return {
    name: 'javascript-obfuscator',
    generatorOverride(ast, generatorOpts, code, generate) {
      const result = generate(ast, generatorOpts, code);
      let codeToObfuscate = result.code;

      // Optionally minify first with terser (sync version)
      if (minify) {
        const minified = minify_sync(result.code, {
          compress: true,
          mangle: true,
          format: {
            comments: false,
          },
        });

        // Check for minification errors
        if (minified.error) {
          throw new Error(`Terser minification failed: ${minified.error.message}`);
        }
        if (!minified.code) {
          throw new Error('Terser minification returned no code');
        }
        codeToObfuscate = minified.code;
      }

      // Obfuscate after minification
      const obfuscatorOptions = { ...defaultObfuscatorOptions, ...obfuscatorOpts };
      const obfuscationResult = JavaScriptObfuscator.obfuscate(codeToObfuscate, obfuscatorOptions);

      return {
        code: obfuscationResult.getObfuscatedCode(),
        map: null, // Source maps not meaningful for obfuscated code
      };
    },
  };
};
