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
		ALTER TABLE resources
		ADD COLUMN description VARCHAR NOT NULL;
	`);
};

exports.down = function (db) {
	return db.runSql(`
        ALTER TABLE resources
        DROP COLUMN description;
    `);
};

exports._meta = {
	"version": 1
};
