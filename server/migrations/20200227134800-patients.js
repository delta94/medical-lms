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
        CREATE TABLE patients
		(
			id SERIAL PRIMARY KEY,
			client_id INT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
			name VARCHAR NOT NULL,
			age FLOAT NOT NULL,
			is_female BOOLEAN,
			description VARCHAR NOT NULL,
			height FLOAT NOT NULL,
			weight FLOAT NOT NULL,
			created_at TIMESTAMP DEFAULT NOW(),
			updated_at TIMESTAMP DEFAULT NOW()
		);
		
		CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
		
		CREATE TABLE physical_exam_regions
		(
			id SERIAL PRIMARY KEY,
			name VARCHAR NOT NULL,
			female_sensitive BOOLEAN NOT NULL,
			male_sensitive BOOLEAN NOT NULL
		);
		
		CREATE TABLE patient_physical_exam_results
		(
			client_id INT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
			patient_id INT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
			region_id INT NOT NULL REFERENCES physical_exam_regions(id) ON DELETE CASCADE,
			result VARCHAR NOT NULL,
			appropriate BOOLEAN NOT NULL
		);
    `);
};

exports.down = async function (db) {
    await db.runSql(`
		DROP TABLE patients;
		DROP TABLE physical_exam_region;
		DROP TABLE patient_physical_exam_results;
    `);
};

exports._meta = {
    "version": 1
};
