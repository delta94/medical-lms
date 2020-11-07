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
        CREATE TABLE patient_bloods_fbc
		(
			client_id INT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
			patient_id INT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
			hb DECIMAL NOT NULL,
			mcv DECIMAL NOT NULL,
			mch DECIMAL NOT NULL,
			total_wcc DECIMAL NOT NULL,
			neutrophils DECIMAL NOT NULL,
			lymphocytes DECIMAL NOT NULL,
			monocytes DECIMAL NOT NULL,
			eosinophils DECIMAL NOT NULL,
			platelets DECIMAL NOT NULL
		);
		
		CREATE TABLE patient_bloods_ues
		(
			client_id INT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
			patient_id INT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
			sodium DECIMAL NOT NULL,
			potassium DECIMAL NOT NULL,
			urea DECIMAL NOT NULL,
			creatinine DECIMAL NOT NULL,
			eGFR DECIMAL NOT NULL
		);
		
		CREATE TABLE patient_bloods_lfts
		(
			client_id INT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
			patient_id INT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
			alp DECIMAL NOT NULL,
			alt DECIMAL NOT NULL,
			bilirubin DECIMAL NOT NULL,
			albumin DECIMAL NOT NULL
		);
		
		CREATE TABLE patient_bloods_bl12_folate
		(
			client_id INT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
			patient_id INT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
			vitamin_b12 DECIMAL NOT NULL,
			folate DECIMAL NOT NULL
		);
		
		CREATE TABLE patient_bloods_bone_profile
		(
			client_id INT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
			patient_id INT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
			corrected_calcium DECIMAL NOT NULL,
			alp DECIMAL NOT NULL,
			phosphate DECIMAL NOT NULL
		);
		
		CREATE TABLE patient_bloods_coagulation
		(
			client_id INT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
			patient_id INT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
			pt DECIMAL NOT NULL,
			aptt DECIMAL NOT NULL,
			fibrinogen DECIMAL NOT NULL
		);
		
		CREATE TABLE patient_bloods_tfts
		(
			client_id INT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
			patient_id INT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
			tsh DECIMAL NOT NULL,
			free_t4 DECIMAL NOT NULL,
			free_t3 DECIMAL NOT NULL
		);
		
		CREATE TABLE patient_bloods_other
		(
			client_id INT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
			patient_id INT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
			magnesium DECIMAL NOT NULL,
			amylase DECIMAL NOT NULL,
			crp DECIMAL NOT NULL,
			haematinics_ferritin DECIMAL NOT NULL,
			troponin_i DECIMAL NOT NULL,
			hba1c DECIMAL NOT NULL,
			lactate DECIMAL NOT NULL
		);
    `);
};

exports.down = async function (db) {
	await db.runSql(`
		DROP TABLE patients_bloods_fbc;
		DROP TABLE patients_bloods_ues;
		DROP TABLE patients_bloods_lfts;
		DROP TABLE patients_bloods_bl12_folate;
		DROP TABLE patients_bloods_bone_profile;
		DROP TABLE patients_bloods_coagulation;
		DROP TABLE patients_bloods_tfts;
		DROP TABLE patients_bloods_other;
    `);
};

exports._meta = {
	"version": 1
};
