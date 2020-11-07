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
        ALTER TABLE patients
        ADD COLUMN deleted BOOLEAN NOT NULL DEFAULT FALSE;
    
        CREATE TABLE scenarios
        (
            id SERIAL PRIMARY KEY,
            client_id INT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
            name VARCHAR NOT NULL,
            description VARCHAR NOT NULL,
            active BOOLEAN NOT NULL DEFAULT FALSE,
            cover_image VARCHAR,
            deleted BOOLEAN NOT NULL DEFAULT FALSE,
			created_at TIMESTAMP DEFAULT NOW(),
			updated_at TIMESTAMP DEFAULT NOW()
        );
        
        CREATE TRIGGER update_scenarios_updated_at BEFORE UPDATE ON scenarios FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
        
        CREATE TABLE scenario_patients
        (
            scenario_id INT NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
            patient_id INT NOT NULL REFERENCES patients(id) ON DELETE CASCADE
        );
        
        CREATE TABLE nodes
        (
            id SERIAL PRIMARY KEY,
            slug VARCHAR NOT NULL,
            type INT NOT NULL,
            text VARCHAR,
            data JSONB
        );
        
        CREATE TABLE node_groups
        (
            id SERIAL PRIMARY KEY,
            name VARCHAR
        );
        
        CREATE TABLE group_nodes
        (
            group_id INT NOT NULL REFERENCES node_groups(id) ON DELETE CASCADE,
            node_id INT NOT NULL REFERENCES nodes(id) ON DELETE CASCADE
        );
        
        CREATE TABLE scenario_node_groups
        (
            scenario_id INT NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
            group_id INT NOT NULL REFERENCES node_groups(id) ON DELETE CASCADE
        );
    `);
};

exports.down = async function (db) {
    await db.runSql(`
		DROP TABLE scenario_node_groups;
		DROP TABLE group_nodes;
		DROP TABLE node_groups;
		DROP TABLE nodes;
		DROP TABLE scenario_patients;
		DROP TABLE scenarios;
		
        ALTER TABLE patients
        DROP COLUMN deleted;
    `);
};

exports._meta = {
    "version": 1
};
