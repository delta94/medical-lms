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
        CREATE TABLE student_scenario_attempts
		(
		    attempt_id SERIAL NOT NULL,
			client_id INT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
			scenario_id INT NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
			time_started TIMESTAMP WITH TIME ZONE,
			time_finished TIMESTAMP WITH TIME ZONE,
			completed BOOLEAN NOT NULL DEFAULT FALSE,
			PRIMARY KEY(attempt_id)
		);
		
		CREATE TABLE student_scenario_decisions
		(
			attempt_id INT NOT NULL REFERENCES student_scenario_attempts(attempt_id)  ON DELETE CASCADE,
			step INT NOT NULL,
			decision JSONB
		);
    `);
};

exports.down = async function (db) {
    await db.runSql(`
        DROP TABLE student_scenario_decisions;
        DROP TABLE student_scenario_attempts;
    `);
};

exports._meta = {
    "version": 1
};
