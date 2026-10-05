#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/a4773715dfd7645da4e8f474c8555dd0f507b3e790013f01095cd1dad8fdf447/contract';
import startContract from '../../snapshots/a4773715dfd7645da4e8f474c8555dd0f507b3e790013f01095cd1dad8fdf447/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/d732532784aeac5984a1193308adaf1464cad9c3ac1fd5a8555d0192dde129bb/contract';
import endContract from '../../snapshots/d732532784aeac5984a1193308adaf1464cad9c3ac1fd5a8555d0192dde129bb/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, collMod, createIndex } from '@prisma/orm-mongo/target/migration';

class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      createIndex('bannedips', [{ direction: 1, field: 'reference' }], { unique: true }),
      createIndex('bannedwebhooks', [{ direction: 1, field: 'reference' }], { unique: true }),
      createIndex('seenwebhooks', [{ direction: 1, field: 'reference' }], { unique: true }),
      collMod(
        'bannedips',
        {
          validator: {
            $jsonSchema: {
              additionalProperties: false,
              bsonType: 'object',
              properties: {
                _id: { bsonType: 'objectId' },
                expires: { bsonType: 'date' },
                reason: { bsonType: 'string' },
                reference: { bsonType: 'string' },
              },
              required: ['_id', 'expires', 'reason', 'reference'],
            },
          },
          validationLevel: 'strict',
          validationAction: 'error',
        },
        {
          id: 'validator.bannedips.update',
          label: 'Update validator on bannedips (added: reference)',
          operationClass: 'destructive',
        },
      ),
      collMod(
        'bannedwebhooks',
        {
          validator: {
            $jsonSchema: {
              additionalProperties: false,
              bsonType: 'object',
              properties: {
                _id: { bsonType: 'objectId' },
                reason: { bsonType: 'string' },
                reference: { bsonType: 'string' },
              },
              required: ['_id', 'reason', 'reference'],
            },
          },
          validationLevel: 'strict',
          validationAction: 'error',
        },
        {
          id: 'validator.bannedwebhooks.update',
          label: 'Update validator on bannedwebhooks (added: reference)',
          operationClass: 'destructive',
        },
      ),
      collMod(
        'seenwebhooks',
        {
          validator: {
            $jsonSchema: {
              additionalProperties: false,
              bsonType: 'object',
              properties: { _id: { bsonType: 'objectId' }, reference: { bsonType: 'string' } },
              required: ['_id', 'reference'],
            },
          },
          validationLevel: 'strict',
          validationAction: 'error',
        },
        {
          id: 'validator.seenwebhooks.update',
          label: 'Update validator on seenwebhooks (added: reference)',
          operationClass: 'destructive',
        },
      ),
    ];
  }
}

export default M;
MigrationCLI.run(import.meta.url, M);
