import { TextDocument } from 'vscode-languageserver-textdocument';
import YAML from 'yaml';

import { isJsonDoc } from '../../utils/utils.ts';
import {
  ConversionOptions,
  ConversionResult,
  Format,
  LanguageSettings,
} from '../../apidom-language-types.ts';
import { FormattingService } from '../formatting/formatting-service.ts';

export interface ConversionService {
  doConversion(
    textDocument: TextDocument,
    sourceFormat: Format,
    targetFormat: Format,
    conversionOptions?: ConversionOptions,
  ): Promise<ConversionResult>;

  configure(settings?: LanguageSettings): void;
}

export class DefaultConversionService implements ConversionService {
  private settings: LanguageSettings | undefined;
  private formattingService: FormattingService;

  constructor(formattingService: FormattingService) {
    this.formattingService = formattingService;
  }

  public configure(settings?: LanguageSettings): void {
    this.settings = settings;
  }

  public async doConversion(
    textDocument: TextDocument,
    sourceFormat: Format,
    targetFormat: Format,
    conversionOptions?: ConversionOptions,
  ): Promise<ConversionResult> {
    const text: string = textDocument.getText();

    const textFormat = (await isJsonDoc(text)) ? Format.JSON : Format.YAML;
    if (textFormat !== sourceFormat) {
      return {
        success: false,
        error: `Selected document is not a ${sourceFormat} file.`,
      };
    }

    const indent = conversionOptions?.formattingOptions?.tabSize ?? 2;
    const useTabs = conversionOptions?.formattingOptions?.insertSpaces === false;
    const enhancedFormatting = conversionOptions?.enhancedFormatting;

    // convert
    try {
      let result: string | undefined;
      if (sourceFormat === Format.YAML && targetFormat === Format.JSON) {
        const parsedYaml: unknown = YAML.parse(text, { strict: false });
        result = JSON.stringify(parsedYaml, null, useTabs ? '\t' : indent);
      } else {
        const parsedJSON: unknown = JSON.parse(text);
        result = YAML.stringify(parsedJSON, {
          indent: indent,
          lineWidth: 0,
        });
      }
      if (enhancedFormatting) {
        const textEdits = await this.formattingService.doFormatting(
          TextDocument.create('conversion-temp-doc', 'apidom', 0, result),
          conversionOptions?.formattingOptions,
        );
        if (textEdits && textEdits.length > 0) {
          result = textEdits[0].newText;
        }
      }
      return {
        success: true,
        result,
      };
    } catch (e: unknown) {
      const error =
        e instanceof Error
          ? `Error converting ${sourceFormat === Format.YAML ? 'YAML' : 'JSON'}: Invalid ${sourceFormat === Format.YAML ? 'YAML' : 'JSON'} syntax. Please fix ${sourceFormat === Format.YAML ? 'YAML' : 'JSON'} errors first.\n Details: ${e.message}`
          : `Error converting ${sourceFormat === Format.YAML ? 'YAML' : 'JSON'}.`;
      return {
        success: false,
        error,
      };
    }
  }
}
