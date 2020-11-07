import {Inject, Injectable} from "@nestjs/common";
import {NEST_PGPROMISE_CONNECTION} from "nest-pgpromise/dist";
import {PgPromiseDb} from "@/database/pgpromise";
import {BL12Folate} from "@/bloods/bl12folate/bl12folate.entity";

@Injectable()
export class Bl12folateRepository {
    constructor(@Inject(NEST_PGPROMISE_CONNECTION) private readonly db: PgPromiseDb) {
    }

    async find(clientId: number, patientId: number): Promise<BL12Folate | null> {
        const sql = "SELECT * FROM patient_bloods_bl12_folate WHERE client_id=$(clientId) AND patient_id=$(patientId);";
        return await this.db.oneOrNone(sql, {clientId, patientId});
    }

    async setBl12FolateInfo(clientId: number, patientId: number, vitaminB12: number, folate: number): Promise<boolean | null> {
        let bl12Folate = await this.find(clientId, patientId);
        let sql = "";
        if (bl12Folate === null) {
            sql = "INSERT INTO patient_bloods_bl12_folate(client_id, patient_id, vitamin_b12, folate) VALUES ($(clientId), $(patientId), $(vitaminB12), $(folate));";
        }
        else {
            sql = "UPDATE patient_bloods_bl12_folate SET vitamin_b12=$(vitaminB12), folate=$(folate) WHERE client_id=$(clientId) AND patient_id=$(patientId);";
        }
        let rowsAffected = await this.db.result(sql, {clientId, patientId, vitaminB12, folate}, result => result.rowCount);
        return rowsAffected === 1;
    }
}
