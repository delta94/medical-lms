import {Inject, Injectable} from "@nestjs/common";
import {NEST_PGPROMISE_CONNECTION} from "nest-pgpromise/dist";
import {PgPromiseDb} from "@/database/pgpromise";
import {LFTS} from "@/bloods/lfts/lfts.entity";

@Injectable()
export class LftsRepository {
    constructor(@Inject(NEST_PGPROMISE_CONNECTION) private readonly db: PgPromiseDb) {
    }

    async find(clientId: number, patientId: number): Promise<LFTS | null> {
        const sql = "SELECT * FROM patient_bloods_lfts WHERE client_id=$(clientId) AND patient_id=$(patientId);";
        return await this.db.oneOrNone(sql, {clientId, patientId});
    }

    async setLFTSInfo(clientId: number, patientId: number, alp: number, alt: number, bilirubin: number, albumin: number ): Promise<boolean | null> {
        let lfts = await this.find(clientId, patientId);
        let sql = "";
        if (lfts === null) {
            sql = "INSERT INTO patient_bloods_lfts(client_id, patient_id, alp, alt, bilirubin, albumin) VALUES ($(clientId), $(patientId), $(alp), $(alt), $(bilirubin), $(albumin));";
        }
        else {
            sql = "UPDATE patient_bloods_lfts SET alp=$(alp), alt=$(alt), bilirubin=$(bilirubin), albumin=$(albumin) WHERE client_id=$(clientId) AND patient_id=$(patientId);";
        }
        let rowsAffected = await this.db.result(sql, {clientId, patientId, alp, alt, bilirubin, albumin}, result => result.rowCount);
        return rowsAffected === 1;
    }
}
