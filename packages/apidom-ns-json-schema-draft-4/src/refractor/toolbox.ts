import { createNamespace, isStringElement } from '@char0n/apidom-core';

import * as jsonSchemaDraft4Predicates from '../predicates.ts';
import jsonSchemaDraft4Namespace from '../namespace.ts';

const createToolbox = () => {
  const namespace = createNamespace(jsonSchemaDraft4Namespace);
  const predicates = { ...jsonSchemaDraft4Predicates, isStringElement };

  return { predicates, namespace };
};

export default createToolbox;
