'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};

exports.up = function (db) {
    return db.runSql(`
        ALTER TABLE users
        ADD COLUMN disabled BOOLEAN NOT NULL DEFAULT FALSE,
        ADD CONSTRAINT unique_email UNIQUE (email);
    `);
};

exports.down = function (db) {
    return db.runSql(`
        ALTER TABLE users
        DROP COLUMN disabled
        DROP CONSTRAINT unique_email;
    `);
};

exports._meta = {
    "version": 1
};
