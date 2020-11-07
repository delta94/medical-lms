'use strict';

let dbm;
let type;
let seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
	dbm = options.dbmigrate;
	type = dbm.dataType;
	seed = seedLink;
};

exports.up = async function (db) {
	await db.runSql(`
        CREATE TABLE scenario_environments
        (
            id SERIAL PRIMARY KEY,
            scenario_id INT NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
            name VARCHAR NOT NULL,
            image VARCHAR NOT NULL
        );
    `);
};

exports.down = async function (db) {
	await db.runSql(`
        ALTER TABLE patients
        DROP COLUMN ethnicity;
    `);
};

exports._meta = {
	"version": 1
};
