import {Inject, Injectable} from "@nestjs/common";
import {NEST_PGPROMISE_CONNECTION} from "nest-pgpromise/dist";
import {PgPromiseDb} from "@/database/pgpromise";
import {Coagulation} from "@/bloods/coagulation/coagulation.entity";

@Injectable()
export class CoagulationRepository {
    constructor(@Inject(NEST_PGPROMISE_CONNECTION) private readonly db: PgPromiseDb) {
    }

    async find(clientId: number, patientId: number): Promise<Coagulation | null> {
        const sql = "SELECT * FROM patient_bloods_coagulation WHERE client_id=$(clientId) AND patient_id=$(patientId);";
        return await this.db.oneOrNone(sql, {clientId, patientId});
    }

    async setCoagulationInfo(clientId: number, patientId: number, pt: number, aptt: number, fibrinogen: number): Promise<boolean | null> {
        let coagulation = await this.find(clientId, patientId);
        let sql = "";
        if (coagulation === null) {
            sql = "INSERT INTO patient_bloods_coagulation(client_id, patient_id, pt, aptt, fibrinogen) VALUES ($(clientId), $(patientId), $(pt), $(aptt), $(fibrinogen));";
        }
        else {
            sql = "UPDATE patient_bloods_coagulation SET pt=$(pt), aptt=$(aptt), fibrinogen=$(fibrinogen) WHERE client_id=$(clientId) AND patient_id=$(patientId);";
        }
        let rowsAffected = await this.db.result(sql, {clientId, patientId, pt, aptt, fibrinogen}, result => result.rowCount);
        return rowsAffected === 1;
    }
}
