import fs from 'node:fs';
import path from 'node:path';
import { assert } from 'chai';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { Position } from 'vscode-languageserver-types';
import { fileURLToPath } from 'node:url';

import getLanguageService from '../../../src/apidom-language-service.ts';
import {
  CompletionContext,
  LanguageService,
  LanguageServiceContext,
} from '../../../src/apidom-language-types.ts';
import { metadata } from '../../metadata.ts';
import { logPerformance, logLevel } from '../../test-utils.ts';

const fixturesDir = fileURLToPath(new URL('../../fixtures/overlay', import.meta.url));

const readFixture = (name: string): string =>
  fs.readFileSync(path.join(fixturesDir, name)).toString();

describe('overlay-completion', function () {
  const context: LanguageServiceContext = {
    metadata: metadata(),
    performanceLogs: logPerformance,
    logLevel,
  };

  const languageService: LanguageService = getLanguageService(context);

  after(function () {
    languageService.terminate();
  });

  const completionContext: CompletionContext = {
    maxNumberOfItems: 100,
  };

  it('should provide completions for Overlay root object', async function () {
    const spec = readFixture('overlay-completion-root.yaml');
    const doc = TextDocument.create('foo://bar/overlay-completion-root.yaml', 'yaml', 0, spec);
    const pos = Position.create(4, 0);
    const result = await languageService.doCompletion(
      doc,
      { textDocument: doc, position: pos },
      completionContext,
    );
    const labels = result!.items.map((item) => item.label);
    assert.include(labels, 'actions');
    assert.include(labels, 'extends');
  });

  it('should provide completions for Info object', async function () {
    const spec = readFixture('overlay-completion-info.yaml');
    const doc = TextDocument.create('foo://bar/overlay-completion-info.yaml', 'yaml', 0, spec);
    const pos = Position.create(3, 2);
    const result = await languageService.doCompletion(
      doc,
      { textDocument: doc, position: pos },
      completionContext,
    );
    const labels = result!.items.map((item) => item.label);
    assert.include(labels, 'version');
    assert.include(labels, 'description');
  });

  it('should provide completions for Action object in actions array', async function () {
    const spec = readFixture('overlay-completion-action.yaml');
    const doc = TextDocument.create('foo://bar/overlay-completion-action.yaml', 'yaml', 0, spec);
    const pos = Position.create(5, 4);
    const result = await languageService.doCompletion(
      doc,
      { textDocument: doc, position: pos },
      completionContext,
    );
    const labels = result!.items.map((item) => item.label);
    assert.include(labels, 'target');
    assert.include(labels, 'description');
    assert.include(labels, 'update');
    assert.include(labels, 'copy');
    assert.include(labels, 'remove');
  });
});
