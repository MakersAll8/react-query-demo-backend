'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.runSql(`
    CREATE TABLE public.cities (
      id uuid NOT NULL,
      city varchar NULL,
      province varchar NULL,
      country varchar NULL,
      zip varchar NULL
    );
    CREATE UNIQUE INDEX cities_id_idx ON public.cities (id);
  `);
};

exports.down = function(db) {
  return db.runSql(`
    DROP TABLE public.cities
  `);
};

exports._meta = {
  "version": 1
};
