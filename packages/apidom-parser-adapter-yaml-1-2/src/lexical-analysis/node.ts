import url from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
import Parser, { Tree } from 'web-tree-sitter';
import { ApiDOMError } from '@swagger-api/apidom-error';

let parser: Parser | null = null;
let parserInitLock: Promise<Parser> | null = null;

const dirname = typeof __dirname === 'undefined' ? url.fileURLToPath(import.meta.url) : __dirname;
const treeSitterYamlPath = path.resolve(dirname, '../../../wasm/tree-sitter-yaml.wasm');
const treeSitterYaml = fs.readFileSync(treeSitterYamlPath);

/**
 * Lexical Analysis of source string using WebTreeSitter.
 * This is WebAssembly version of TreeSitters Lexical Analysis.
 *
 * Given JavaScript doesn't support true parallelism, this
 * code should be as lazy as possible and temporal safety should be fine.
 * @public
 */

const analyze = async (source: string): Promise<Tree> => {
  if (parser === null && parserInitLock === null) {
    // acquire lock
    parserInitLock = Parser.init()
      .then(() => Parser.Language.load(treeSitterYaml))
      .then((yamlLanguage) => {
        const parserInstance = new Parser();
        parserInstance.setLanguage(yamlLanguage);
        return parserInstance;
      })
      .finally(() => {
        // release lock
        parserInitLock = null;
      });
    parser = await parserInitLock;
  } else if (parser === null && parserInitLock !== null) {
    // await for lock to be released if there is one
    parser = await parserInitLock;
  } else if (parser === null) {
    throw new ApiDOMError(
      'Error while initializing web-tree-sitter and loading tree-sitter-yaml grammar.',
    );
  }

  return parser.parse(source);
};

export default analyze;
