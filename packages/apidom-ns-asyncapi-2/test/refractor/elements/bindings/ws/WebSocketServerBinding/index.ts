import { expect } from 'chai';
import { sexprs } from '@char0n/apidom-core';

import { WebSocketServerBindingElement } from '../../../../../../src/index.ts';

describe('refractor', function () {
  context('elements', function () {
    context('WebSocketServerBindingElement', function () {
      specify('should refract to semantic ApiDOM tree', function () {
        const webSocketServerBindingElement = WebSocketServerBindingElement.refract({});

        expect(sexprs(webSocketServerBindingElement)).toMatchSnapshot();
      });
    });
  });
});
