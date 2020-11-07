import {Inject, Injectable} from "@nestjs/common";
import {NEST_PGPROMISE_CONNECTION} from "nest-pgpromise/dist";
import {PgPromiseDb} from "@/database/pgpromise";
import {PaginatedList} from "@/PaginatedList";
import {
    ScenarioBaseAttempt,
    ScenarioDecision,
    ScenarioFullAttempt
} from "@/scenario-decisions/scenario-decision.entity";
import {QueryRequest} from "@/FilteredQueryRequest";

@Injectable()
export class ScenarioDecisionRepository {
    constructor(@Inject(NEST_PGPROMISE_CONNECTION) private readonly db: PgPromiseDb) {
    }

    async findAttempts(clientId: number, scenarioId: number, queryRequest: QueryRequest): Promise<PaginatedList<ScenarioBaseAttempt>>{
        const sql = `SELECT * from student_scenario_attempts s
                    WHERE s.client_id=$(clientId) AND s.scenario_id=$(scenarioId)
                    ORDER BY time_started
                    OFFSET $(offset) LIMIT $(pageSize)`;

        const countSql = `SELECT COUNT(*) from student_scenario_attempts s
                    WHERE s.client_id=$(clientId) AND s.scenario_id=$(scenarioId)`;

        let attempts =  await this.db.manyOrNone(sql,
            {clientId : clientId,
                    scenarioId: scenarioId,
                    offset: queryRequest.offset,
                    pageSize: queryRequest.pageSize});

        let count = await this.db.one(countSql, {clientId : clientId, scenarioId: scenarioId});

        return new PaginatedList<ScenarioBaseAttempt>(attempts, count, queryRequest.pageSize, queryRequest.page);
    }

    async findAttemptById(id: number) : Promise<ScenarioBaseAttempt>{
        const sql = `SELECT * FROM student_scenario_attempts WHERE attempt_id = $(attemptId);`;
        return await this.db.oneOrNone(sql, {attemptId: id});
    }

    async createAttempt(clientId: number, scenarioId: number) : Promise<ScenarioBaseAttempt>{
        let timeNow = new Date();
        const sql = `INSERT INTO student_scenario_attempts (client_id, scenario_id, time_started, completed) 
                    VALUES($(clientId), $(scenarioId), $(timeNow), $(completed)) RETURNING attempt_id;`

        let attemptId = (await this.db.oneOrNone(sql, {
            clientId: clientId,
            scenarioId: scenarioId,
            timeNow: timeNow,
            completed: false
        }))?.attemptId;

        return (attemptId)
            ? this.findAttemptById(attemptId)
            : null;
    }

    async update(clientId: number, scenarioId: number, data: ScenarioBaseAttempt) : Promise<ScenarioBaseAttempt>{
        const sql = `UPDATE student_scenario_attempts
                     SET time_finished=$(timeFinished), completed=$(completed)
                     WHERE attempt_id=$(attemptId)`;

        await this.db.oneOrNone(sql, data);
        return this.findAttemptById(data.attemptId);
    }

    async findDecisions(clientId: number, scenarioId: number, attemptId: number): Promise<Array<ScenarioDecision>>{
        const sql = "SELECT * FROM student_scenario_decisions WHERE attempt_id = $(attemptId) ORDER BY step ASC;";
        return await this.db.manyOrNone(sql, {attemptId});
    }

    async createDecision(clientId: number, scenarioId: number, decision: ScenarioDecision) : Promise<ScenarioDecision>{
        const sql = `INSERT INTO student_scenario_decisions (attempt_id, step, decision) 
                    VALUES($(attemptId), $(step), $(decision));`;

        await this.db.none(sql, {attemptId: decision.attemptId, step: decision.step, decision: decision.decision});

        const sqlFind = "SELECT * FROM student_scenario_decisions WHERE attempt_id = $(attemptId) AND step = $(step);";

        return await this.db.oneOrNone(sqlFind, {attemptId: decision.attemptId, step: decision.step});
    }

}
