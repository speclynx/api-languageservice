import Parser, { Tree } from 'web-tree-sitter';
// @ts-ignore
import treeSitter from 'web-tree-sitter/tree-sitter.wasm';
// @ts-ignore
import treeSitterYaml from '@tree-sitter-grammars/tree-sitter-yaml/tree-sitter-yaml.wasm';
import { ApiDOMError } from '@speclynx/apidom-error';

let parser: Parser | null = null;
let parserInitLock: Promise<Parser> | null = null;

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
    parserInitLock = Parser.init({ wasmBinary: treeSitter })
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
