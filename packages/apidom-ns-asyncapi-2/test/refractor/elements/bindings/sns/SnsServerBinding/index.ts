import { expect } from 'chai';
import { sexprs } from '@char0n/apidom-core';

import { SnsServerBindingElement } from '../../../../../../src/index.ts';

describe('refractor', function () {
  context('elements', function () {
    context('SnsServerBindingElement', function () {
      specify('should refract to semantic ApiDOM tree', function () {
        const snsServerBindingElement = SnsServerBindingElement.refract({});

        expect(sexprs(snsServerBindingElement)).toMatchSnapshot();
      });
    });
  });
});
