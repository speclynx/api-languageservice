import { expect } from 'chai';
import { sexprs } from '@char0n/apidom-core';
import { parse } from '@char0n/apidom-parser-adapter-yaml-1-2';
import dedent from 'dedent';

import {
  ServerBindingsElement,
  refractorPluginReplaceEmptyElement,
} from '../../../../../../src/index.ts';

it('should refract to semantic ApiDOM tree', async function () {
  const yamlDefinition = dedent`
          http:
          ws:
          kafka:
          anypointmq:
          amqp:
          amqp1:
          mqtt:
          mqtt5:
          nats:
          jms:
          sns:
          solace:
          sqs:
          stomp:
          redis:
          mercure:
          ibmmq:
       `;
  const apiDOM = await parse(yamlDefinition);
  const serverBindingsElement = ServerBindingsElement.refract(apiDOM.result, {
    plugins: [refractorPluginReplaceEmptyElement()],
  });

  expect(sexprs(serverBindingsElement)).toMatchSnapshot();
});
