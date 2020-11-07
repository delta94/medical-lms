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
		ALTER TABLE patient_physical_exam_results
		ADD COLUMN id SERIAL PRIMARY KEY,
		ADD CONSTRAINT unique_region_id UNIQUE (client_id, patient_id, region_id);
		
		ALTER TABLE physical_exam_regions
		ADD COLUMN deleted BOOLEAN NOT NULL DEFAULT FALSE;
	`);
};

exports.down = function (db) {
	return db.runSql(`
        ALTER TABLE patient_physical_exam_results
        DROP COLUMN id;
        DROP CONSTRAINT unique_region_id;
        
        ALTER TABLE physical_exam_regions
        DROP COLUMN deleted;
		    `);
};

exports._meta = {
	"version": 1
};
