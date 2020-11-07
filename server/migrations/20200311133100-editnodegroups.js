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
        ALTER TABLE scenario_node_groups
        ADD COLUMN id serial UNIQUE NOT NULL,
        ADD COLUMN name VARCHAR,
        ADD COLUMN is_start BOOLEAN NOT NULL DEFAULT FALSE,
        ADD COLUMN is_outcome BOOLEAN NOT NULL DEFAULT FALSE;
        
        UPDATE scenario_node_groups
        SET id=ng.id, name=ng.name
        FROM scenario_node_groups sng
        JOIN node_groups ng on ng.id = sng.group_id;
       
        ALTER TABLE scenario_node_groups
        DROP COLUMN group_id;
        
        ALTER TABLE group_nodes
        DROP CONSTRAINT group_nodes_group_id_fkey,
        ADD CONSTRAINT group_nodes_group_id_fkey FOREIGN KEY (group_id) REFERENCES scenario_node_groups(id);
        
        DROP TABLE node_groups;
    `);
};

exports.down = async function (db) {
    await db.runSql(`
        ALTER TABLE scenario_node_groups
        DROP COLUMN is_start,
        DROP COLUMN is_outcome;
    `);
};

exports._meta = {
    "version": 1
};
