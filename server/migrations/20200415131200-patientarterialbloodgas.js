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
        CREATE TABLE patients_arterial_blood_gas
		(
			client_id INT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
			patient_id INT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
			pH INT NOT NULL,
			PaO2 INT NOT NULL,
			PaCO2 INT NOT NULL,
			HCO3 INT NOT NULL,
			base_excess INT NOT NULL,
			lactate INT NOT NULL
		);
    `);
};

exports.down = async function (db) {
	await db.runSql(`
		DROP TABLE patients_arterial_blood_gas;
    `);
};

exports._meta = {
	"version": 1
};
