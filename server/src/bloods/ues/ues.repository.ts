import {Inject, Injectable} from "@nestjs/common";
import {NEST_PGPROMISE_CONNECTION} from "nest-pgpromise/dist";
import {PgPromiseDb} from "@/database/pgpromise";
import {UES} from "@/bloods/ues/ues.entity";

@Injectable()
export class UesRepository {
    constructor(@Inject(NEST_PGPROMISE_CONNECTION) private readonly db: PgPromiseDb) {
    }

    async find(clientId: number, patientId: number): Promise<UES | null> {
        const sql = "SELECT * FROM patient_bloods_ues WHERE client_id=$(clientId) AND patient_id=$(patientId);";
        return await this.db.oneOrNone(sql, {clientId, patientId});
    }

    async setUESInfo(clientId: number, patientId: number, sodium: number, potassium: number, urea: number, creatinine: number, eGFR: number): Promise<boolean | null> {
        let ues = await this.find(clientId, patientId);
        let sql = "";
        if (ues === null) {
            sql = "INSERT INTO patient_bloods_ues(client_id, patient_id, sodium, potassium, urea, creatinine, eGFR) VALUES ($(clientId), $(patientId), $(sodium), $(potassium), $(urea), $(creatinine), $(eGFR));";
        } else {
            sql = "UPDATE patient_bloods_ues SET sodium=$(sodium), potassium=$(potassium), urea=$(urea), creatinine=$(creatinine), eGFR=$(eGFR) WHERE client_id=$(clientId) AND patient_id=$(patientId);";
        }
        let rowsAffected = await this.db.result(sql, {
            clientId,
            patientId,
            sodium,
            potassium,
            urea,
            creatinine,
            eGFR
        }, result => result.rowCount);
        return rowsAffected === 1;
    }
}
