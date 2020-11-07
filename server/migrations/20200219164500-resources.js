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
        CREATE TABLE resources(
			id SERIAL PRIMARY KEY,
			client_id INT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
			name VARCHAR NOT NULL,
			type VARCHAR NOT NULL,
			html VARCHAR NOT NULL
        );
    `);
};

exports.down = async function (db) {
	await db.runSql(`
		DROP TABLE resources;
    `);
};

exports._meta = {
	"version": 1
};
