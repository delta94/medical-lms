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
        CREATE TABLE scenario_graph (
            scenario_id INT UNIQUE NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
            nodes JSONB,
            links JSONB
        );
        
        DROP TABLE group_nodes;
        DROP TABLE scenario_node_groups;
        DROP TABLE nodes;
    `);
};

exports.down = async function (db) {
    await db.runSql(`
        DROP TABLE scenario_graph;
    `);
};

exports._meta = {
    "version": 1
};
