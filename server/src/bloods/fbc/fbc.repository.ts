import {Inject, Injectable} from "@nestjs/common";
import {NEST_PGPROMISE_CONNECTION} from "nest-pgpromise/dist";
import {PgPromiseDb} from "@/database/pgpromise";
import {FBC} from "@/bloods/fbc/fbc.entity";

@Injectable()
export class FbcRepository {
    constructor(@Inject(NEST_PGPROMISE_CONNECTION) private readonly db: PgPromiseDb) {
    }

    async find(clientId: number, patientId: number): Promise<FBC | null> {
        const sql = "SELECT * FROM patient_bloods_fbc WHERE client_id=$(clientId) AND patient_id=$(patientId);";
        return await this.db.oneOrNone(sql, {clientId, patientId});
    }

    async setFBCInfo(clientId: number, patientId: number, hb: number, mcv: number, mch:number, totalWcc: number, neutrophils: number, lymphocytes: number, monocytes: number, eosinophils: number, platelets: number ): Promise<boolean | null> {
        let fbc = await this.find(clientId, patientId);
        let sql = "";
        if (fbc === null) {
            sql = "INSERT INTO patient_bloods_fbc(client_id, patient_id, hb, mcv, mch, total_wcc, neutrophils, lymphocytes, monocytes, eosinophils, platelets) VALUES ($(clientId), $(patientId), $(hb), $(mcv), $(mch), $(totalWcc), $(neutrophils), $(lymphocytes), $(monocytes), $(eosinophils), $(platelets));";
        }
        else {
            sql = "UPDATE patient_bloods_fbc SET hb=$(hb), mcv=$(mcv), mch=$(mch), total_wcc=$(totalWcc), lymphocytes=$(lymphocytes), monocytes=$(monocytes), eosinophils=$(eosinophils), platelets=$(platelets) WHERE client_id=$(clientId) AND patient_id=$(patientId);";
        }
        let rowsAffected = await this.db.result(sql, {clientId, patientId, hb, mcv, mch, totalWcc, neutrophils, lymphocytes, monocytes, eosinophils, platelets}, result => result.rowCount);
        return rowsAffected === 1;
    }
}
