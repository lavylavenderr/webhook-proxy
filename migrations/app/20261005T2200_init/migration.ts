#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/a4773715dfd7645da4e8f474c8555dd0f507b3e790013f01095cd1dad8fdf447/contract';
import endContract from '../../snapshots/a4773715dfd7645da4e8f474c8555dd0f507b3e790013f01095cd1dad8fdf447/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, createCollection } from '@prisma/orm-mongo/target/migration';

class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      createCollection('bannedips', {
        validator: {
          $jsonSchema: {
            additionalProperties: false,
            bsonType: 'object',
            properties: {
              _id: { bsonType: 'objectId' },
              expires: { bsonType: 'date' },
              reason: { bsonType: 'string' },
            },
            required: ['_id', 'expires', 'reason'],
          },
        },
        validationLevel: 'strict',
        validationAction: 'error',
      }),
      createCollection('bannedwebhooks', {
        validator: {
          $jsonSchema: {
            additionalProperties: false,
            bsonType: 'object',
            properties: { _id: { bsonType: 'objectId' }, reason: { bsonType: 'string' } },
            required: ['_id', 'reason'],
          },
        },
        validationLevel: 'strict',
        validationAction: 'error',
      }),
      createCollection('seenwebhooks', {
        validator: {
          $jsonSchema: {
            additionalProperties: false,
            bsonType: 'object',
            properties: { _id: { bsonType: 'objectId' } },
            required: ['_id'],
          },
        },
        validationLevel: 'strict',
        validationAction: 'error',
      }),
    ];
  }
}

export default M;
MigrationCLI.run(import.meta.url, M);
