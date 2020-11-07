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
        CREATE OR REPLACE FUNCTION update_updated_at_column() 
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW; 
        END;
        $$ language 'plpgsql';
    
        CREATE TABLE clients (
            id SERIAL PRIMARY KEY,
            name VARCHAR NOT NULL,
            disabled BOOLEAN NOT NULL DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        );
        
        CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
        
        CREATE TABLE client_features (
            client_id INT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
            features JSONB NOT NULL
        );
        
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            client_id INT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
            name VARCHAR NOT NULL,
            email VARCHAR NOT NULL,
            role INT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        );
        
        CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
        
        CREATE TABLE password_auth (
            user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            password_hash VARCHAR NOT NULL,
            password_reset_token VARCHAR,
            password_reset_token_expiry TIMESTAMP
        );
        
        CREATE TABLE groups (
            id SERIAL PRIMARY KEY,
            client_id INT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
            name VARCHAR NOT NULL,
            is_everyone BOOLEAN NOT NULL DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        );
        
        CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON groups FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
        
        CREATE TABLE group_relations (
            parent_id INT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
            child_id INT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
            CONSTRAINT parent_child_pk PRIMARY KEY (parent_id, child_id)
        );
        
        CREATE TABLE group_members (
            group_id INT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
            user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            CONSTRAINT group_user_pk PRIMARY KEY (group_id, user_id)
        );
    `);
};

exports.down = async function (db) {
    await db.runSql(`
        DROP TABLE IF EXISTS group_members;
        DROP TABLE IF EXISTS group_relations;
        DROP TABLE IF EXISTS groups;
        DROP TABLE IF EXISTS password_auth;
        DROP TABLE IF EXISTS users;
        DROP TABLE IF EXISTS client_features;
        DROP TABLE IF EXISTS clients;
    `);
};

exports._meta = {
    "version": 1
};
