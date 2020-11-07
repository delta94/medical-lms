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
		ALTER TABLE physical_exam_regions
		ADD COLUMN default_value VARCHAR;
	`);
};

exports.down = function (db) {
    return db.runSql(`
        ALTER TABLE physical_exam_regions
        DROP COLUMN default_value;
    `);
};

exports._meta = {
    "version": 1
};
