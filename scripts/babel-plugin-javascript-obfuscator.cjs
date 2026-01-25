const { minify_sync } = require('terser');
const JavaScriptObfuscator = require('javascript-obfuscator');

const defaultObfuscatorOptions = {
  stringArray: true,
  stringArrayThreshold: 0.5,
  splitStrings: true,
  splitStringsChunkLength: 10,
};

module.exports = function (api, options = {}) {
  return {
    name: 'javascript-obfuscator',
    generatorOverride(ast, generatorOpts, code, generate) {
      const result = generate(ast, generatorOpts, code);

      // Minify first with terser (sync version)
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

      // Obfuscate with merged options
      const obfuscatorOptions = { ...defaultObfuscatorOptions, ...options };
      const obfuscationResult = JavaScriptObfuscator.obfuscate(minified.code, obfuscatorOptions);

      return {
        code: obfuscationResult.getObfuscatedCode(),
        map: null, // Source maps not meaningful for obfuscated code
      };
    },
  };
};
