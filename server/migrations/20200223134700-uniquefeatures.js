'use strict';

var dbm;
var type;
var seed;

exports.setup = function (options, seedLink) {
	dbm = options.dbmigrate;
	type = dbm.dataType;
	seed = seedLink;
};

exports.up = function (db) {
	return db.runSql(`
		ALTER TABLE client_features
        ADD CONSTRAINT unique_client_id UNIQUE(client_id);
    `);
};

exports.down = function (db) {
	return db.runSql(`
        ALTER TABLE client_features
        DROP CONSTRAINT unique_client_id
    `);
};

exports._meta = {
	"version": 1
};
