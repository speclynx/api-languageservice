import { expect } from 'chai';
import { sexprs } from '@char0n/apidom-core';

import { ParameterElement } from '../../../../src/index.ts';

describe('refractor', function () {
  context('elements', function () {
    context('ParameterElement', function () {
      specify('should refract to semantic ApiDOM tree', function () {
        const parameterElement = ParameterElement.refract({
          name: 'session',
          in: 'body',
          style: 'form',
          target: '#/name',
          value: 'foo',
        });

        expect(sexprs(parameterElement)).toMatchSnapshot();
      });
    });
  });
});
