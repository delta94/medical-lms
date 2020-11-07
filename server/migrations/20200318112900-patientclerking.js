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
		CREATE TABLE patient_clerking_info
		(
			client_id INT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
			patient_id INT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
			current_complaint_history VARCHAR NOT NULL,
			medical_history VARCHAR NOT NULL,
			smoking_status BOOLEAN NOT NULL,
			alcohol_consumption DECIMAL NOT NULL,
			performance_status VARCHAR NOT NULL,
			adl VARCHAR NOT NULL,
			drug_history VARCHAR NOT NULL,
			allergies VARCHAR NOT NULL,
			family_history VARCHAR NOT NULL,
			systemic_review VARCHAR NOT NULL
		);
    `);
};

exports.down = async function (db) {
	await db.runSql(`
		DROP TABLE patient_clerking_info;
    `);
};

exports._meta = {
	"version": 1
};
