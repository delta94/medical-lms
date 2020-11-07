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
        CREATE TABLE fido_auth
		(
			user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
			credential_id BYTEA NOT NULL UNIQUE,
			public_key BYTEA NOT NULL,
			signature_counter INT,
			aa_guid VARCHAR NOT NULL,
			created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
			identifier VARCHAR(255)
		);
		
        CREATE TABLE totp_auth
		(
			user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
			secret CHAR(10) UNIQUE,
			enabled BOOLEAN NOT NULL DEFAULT FALSE
		);
		
        CREATE TABLE mfa_recovery_codes
		(
			user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
			code CHAR(8) NOT NULL
		);
		
		ALTER TABLE users
		ADD COLUMN mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
		ADD COLUMN sso_enabled BOOLEAN NOT NULL DEFAULT FALSE;
    `);
};

exports.down = async function (db) {
	await db.runSql(`
		DROP TABLE fido_auth;
		DROP TABLE totp_auth;.
		DROP TABLE mfa_recovery_codes;
    `);
};

exports._meta = {
	"version": 1
};
