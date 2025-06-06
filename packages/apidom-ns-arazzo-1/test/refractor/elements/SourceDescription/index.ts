import { expect } from 'chai';
import { sexprs } from '@char0n/apidom-core';

import { SourceDescriptionElement } from '../../../../src/index.ts';

describe('refractor', function () {
  context('elements', function () {
    context('SourceDescriptionElement', function () {
      specify('should refract to semantic ApiDOM tree', function () {
        const sourceDescriptionElement = SourceDescriptionElement.refract({
          name: 'petStoreDescription',
          url: 'https://github.com/char0n/swagger-petstore/blob/master/src/main/resources/openapi.yaml',
          type: 'openapi',
        });

        expect(sexprs(sourceDescriptionElement)).toMatchSnapshot();
      });
    });
  });
});
