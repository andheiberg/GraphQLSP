import fs from 'fs';
import path from 'path';
import { printSchema, parse, GraphQLSchema } from 'graphql';
import { codegen } from '@graphql-codegen/core';
import * as typescriptPlugin from '@graphql-codegen/typescript';
import * as typescriptOperationsPlugin from '@graphql-codegen/typescript-operations';
import * as typedDocumentNodePlugin from '@graphql-codegen/typed-document-node';

export const generateTypedDocumentNodes = async (
  schema: GraphQLSchema | null,
  outputFile: string,
  doc: string,
  scalars: Record<string, unknown>
) => {
  if (!schema) return;

  const config = {
    documents: [
      {
        location: 'operation.graphql',
        document: parse(doc),
      },
    ],
    config: {
      scalars,
      // nonOptionalTypename: true,
      // avoidOptionals, worth looking into
      enumsAsTypes: true,
      dedupeOperationSuffix: true,
      dedupeFragments: true,
    },
    // used by a plugin internally, although the 'typescript' plugin currently
    // returns the string output, rather than writing to a file
    filename: outputFile,
    schema: parse(printSchema(schema)),
    plugins: [
      // TODO: there's optimisations to be had here where we move the typescript and typescript-operations
      // to a global __generated__ folder and import from it.
      { typescript: {} },
      { 'typescript-operations': {} },
      { 'typed-document-node': {} },
    ],
    pluginMap: {
      typescript: typescriptPlugin,
      'typescript-operations': typescriptOperationsPlugin,
      'typed-document-node': typedDocumentNodePlugin,
    },
  };

  // @ts-ignore
  const output = await codegen(config);
  fs.writeFile(path.join(outputFile), output, 'utf8', err => {
    console.error(err);
  });
};
