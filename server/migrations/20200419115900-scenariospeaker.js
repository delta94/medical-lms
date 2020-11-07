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
        CREATE TABLE scenario_speakers
        (
            id SERIAL PRIMARY KEY,
            client_id INT NOT NULL,
            scenario_id INT NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
            name VARCHAR NOT NULL,
            avatar VARCHAR
        );
    `);
};

exports.down = async function (db) {
	await db.runSql(`
		DROP TABLE scenario_speakers;
    `);
};

exports._meta = {
	"version": 1
};
