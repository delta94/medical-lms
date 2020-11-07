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
		CREATE TABLE client_saml (
			client_id INT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
			endpoint VARCHAR NOT NULL,
			certificate VARCHAR
		);
	
		CREATE TABLE saml_auth(
			user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
			identifier VARCHAR NOT NULL,
			session_index VARCHAR NOT NULL
		);
		
		ALTER TABLE clients
		ADD COLUMN subdomain VARCHAR NOT NULL UNIQUE;
    `);
};

exports.down = function (db) {
	return db.runSql(`
        DROP TABLE saml;
        DROP TABLE saml_auth;
        
        ALTER TABLE clients
		DROP COLUMN subdomain;
    `);
};

exports._meta = {
	"version": 1
};
