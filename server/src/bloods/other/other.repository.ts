import {Inject, Injectable} from "@nestjs/common";
import {NEST_PGPROMISE_CONNECTION} from "nest-pgpromise/dist";
import {PgPromiseDb} from "@/database/pgpromise";
import {Other} from "@/bloods/other/other.entity";

@Injectable()
export class OtherRepository {
    constructor(@Inject(NEST_PGPROMISE_CONNECTION) private readonly db: PgPromiseDb) {
    }

    async find(clientId: number, patientId: number): Promise<Other | null> {
        const sql = "SELECT * FROM patient_bloods_other WHERE client_id=$(clientId) AND patient_id=$(patientId);";
        return await this.db.oneOrNone(sql, {clientId, patientId});
    }

    async setOtherInfo(clientId: number, patientId: number, magnesium: number, amylase: number, crp: number, haematinicsFerritin: number, troponinI: number, hba1c: number, lactate: number): Promise<boolean | null> {
        let other = await this.find(clientId, patientId);
        let sql = "";
        if (other === null) {
            sql = "INSERT INTO patient_bloods_other(client_id, patient_id, magnesium, amylase, crp, haematinics_ferritin, troponin_i, hba1c, lactate) VALUES ($(clientId), $(patientId), $(magnesium), $(amylase), $(crp), $(haematinicsFerritin), $(troponinI), $(hba1c), $(lactate));";
        }
        else {
            sql = "UPDATE patient_bloods_other SET magnesium=$(magnesium), amylase=$(amylase), crp=$(crp), haematinics_ferritin=$(haematinicsFerritin), hba1c=$(hba1c), lactate=$(lactate) WHERE client_id=$(clientId) AND patient_id=$(patientId);";
        }
        let rowsAffected = await this.db.result(sql, {clientId, patientId, magnesium, amylase, crp, haematinicsFerritin, troponinI, hba1c, lactate}, result => result.rowCount);
        return rowsAffected === 1;
    }
}
