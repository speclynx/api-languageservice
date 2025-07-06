import { assert } from 'chai';

import isValidLinterMeta from '../src/utils/guards.ts';

describe('test-guards', function () {
  it('test isValidLinterMeta', async function () {
    const linterMeta = {
      name: 'SB-API-050-query-parameter-names',
      description: 'query parameter names must be snake_case',
      recommended: true,
      code: 20002,
      source: 'acme-lint',
      severity: 1,
      message: 'parameter names MUST follow snake_case',
      given: ['parameter'],
      target: 'name',
      conditions: [
        { targets: [{ path: 'in' }], function: 'apilintValueOrArray', params: [['query']] },
      ],
      linterFunction: 'apilintValueCasing',
      linterParams: ['snake'],
      marker: 'key',
      markerTarget: 'name',
      data: {},
    };
    assert.isTrue(isValidLinterMeta(linterMeta), 'not valid linter meta');
  });
});
