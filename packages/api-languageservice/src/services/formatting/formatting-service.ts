import { TextDocument } from 'vscode-languageserver-textdocument';
import * as prettier from 'prettier/standalone';
import * as prettierBabelPlugin from 'prettier/plugins/babel';
import * as prettierEstreePlugin from 'prettier/plugins/estree';
import * as prettierYamlPlugin from 'prettier/plugins/yaml';
import { FormattingOptions, TextEdit } from 'vscode-languageserver-types';

import { isJsonDoc } from '../../utils/utils.ts';
import { Format, LanguageSettings } from '../../apidom-language-types.ts';

export interface FormattingService {
  doFormatting(document: TextDocument, options?: FormattingOptions): Promise<TextEdit[]>;

  configure(settings?: LanguageSettings): void;
}

export class DefaultFormattingService implements FormattingService {
  private settings: LanguageSettings | undefined;

  public configure(settings?: LanguageSettings): void {
    this.settings = settings;
  }

  async doFormatting(
    textDocument: TextDocument,
    formattingOptions?: FormattingOptions,
  ): Promise<TextEdit[]> {
    const text: string = textDocument.getText();

    const textFormat = (await isJsonDoc(text)) ? Format.JSON : Format.YAML;
    const indent = formattingOptions?.tabSize ?? 2;
    const useTabs = formattingOptions?.insertSpaces === false;

    // format
    try {
      let result = await prettier.format(textDocument.getText(), {
        parser: textFormat === Format.JSON ? 'json' : 'yaml',
        // @ts-ignore
        plugins:
          textFormat === Format.JSON
            ? [prettierBabelPlugin, prettierEstreePlugin]
            : [prettierYamlPlugin],
        tabWidth: indent,
        useTabs,
        endOfLine: formattingOptions?.insertFinalNewline ? 'lf' : 'auto',
      });

      // Handle trimTrailingWhitespace
      if (formattingOptions?.trimTrailingWhitespace) {
        result = result
          .split('\n')
          .map((line) => line.replace(/\s+$/, ''))
          .join('\n');
      }

      // Handle trimFinalNewlines
      if (formattingOptions?.trimFinalNewlines) {
        result = result.replace(/\n+$/, '\n');
      }

      // Handle insertFinalNewline
      if (formattingOptions?.insertFinalNewline && !result.endsWith('\n')) {
        result += '\n';
      }

      const startPos = textDocument.positionAt(0);
      const endPos = textDocument.positionAt(text.length);
      const textEdit: TextEdit = {
        range: { start: startPos, end: endPos },
        newText: result,
      };
      return [textEdit];
    } catch (e: unknown) {
      const error =
        e instanceof Error
          ? `Error formatting ${textFormat === Format.YAML ? 'YAML' : 'JSON'}\n Details: ${e.message}`
          : `Error formatting ${textFormat === Format.YAML ? 'YAML' : 'JSON'}.`;
      throw new Error(error, { cause: e });
    }
  }
}
