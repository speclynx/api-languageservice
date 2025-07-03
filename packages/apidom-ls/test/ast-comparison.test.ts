/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import { describe, it } from 'mocha';

// Import both implementations
import * as astOriginal from './ast-original-jaml-js.ts';
import * as astYaml from '../src/services/validation/utils/ast.ts';

describe('YAML AST Implementation Comparison', () => {
  const complexYaml = `openapi: 3.0.0
info:
  title: Sample API
  version: 1.0.0
paths:
  /users:
    get:
      summary: Returns a list of users
      responses:
        '200':
          description: A JSON array of user names
          content:
            application/json:
              schema:
                type: array
                items:
                  type: string
`;

  const nestedArraysYaml = `
items:
  - name: item1
    values:
      - 1
      - 2
      - 3
  - name: item2
    values:
      - 4
      - 5
      - 6
`;

  describe('positionRangeForPath', () => {
    it('should return the same position range for complex paths', () => {
      const paths = [
        ['openapi'],
        ['info'],
        ['info', 'title'],
        ['paths'],
        ['paths', '/users'],
        ['paths', '/users', 'get'],
        [
          'paths',
          '/users',
          'get',
          'responses',
          '200',
          'content',
          'application/json',
          'schema',
          'items',
        ],
      ];

      paths.forEach((path) => {
        const yamlResult = astYaml.positionRangeForPath(complexYaml, [...path]);
        const originalResult = astOriginal.positionRangeForPath(complexYaml, [...path]);

        // Compare start positions
        expect(yamlResult.start.line).to.equal(
          originalResult.start.line,
          `Start line for path: ${path.join('/')}`,
        );
        expect(yamlResult.start.column).to.equal(
          originalResult.start.column,
          `Start column for path: ${path.join('/')}`,
        );

        // Compare end positions
        expect(yamlResult.end.line).to.equal(
          originalResult.end.line,
          `End line for path: ${path.join('/')}`,
        );
        expect(yamlResult.end.column).to.equal(
          originalResult.end.column,
          `End column for path: ${path.join('/')}`,
        );
      });
    });

    it('should return the same position range for nested arrays', () => {
      const paths = [['items', '0', 'values', '1']];

      paths.forEach((path) => {
        const originalResult = astOriginal.positionRangeForPath(nestedArraysYaml, [...path]);
        const yamlResult = astYaml.positionRangeForPath(nestedArraysYaml, [...path]);

        // Compare start positions
        expect(yamlResult.start.line).to.equal(
          originalResult.start.line,
          `Start line for path: ${path.join('/')}`,
        );
        expect(yamlResult.start.column).to.equal(
          originalResult.start.column,
          `Start column for path: ${path.join('/')}`,
        );

        // Compare end positions
        expect(yamlResult.end.line).to.equal(
          originalResult.end.line,
          `End line for path: ${path.join('/')}`,
        );
      });
    });
  });
});
