import {Inject, Injectable} from "@nestjs/common";
import {NEST_PGPROMISE_CONNECTION} from "nest-pgpromise/dist";
import {PgPromiseDb} from "@/database/pgpromise";
import {TFTS} from "@/bloods/tfts/tfts.entity";

@Injectable()
export class TftsRepository {
    constructor(@Inject(NEST_PGPROMISE_CONNECTION) private readonly db: PgPromiseDb) {
    }

    async find(clientId: number, patientId: number): Promise<TFTS | null> {
        const sql = "SELECT * FROM patient_bloods_tfts WHERE client_id=$(clientId) AND patient_id=$(patientId);";
        return await this.db.oneOrNone(sql, {clientId, patientId});
    }

    async setTFTSInfo(clientId: number, patientId: number, tsh: number, freeT4: number, freeT3: number): Promise<boolean | null> {
        let tfts = await this.find(clientId, patientId);
        let sql = "";
        if (tfts === null) {
            sql = "INSERT INTO patient_bloods_tfts(client_id, patient_id, tsh, free_t4, free_t3) VALUES ($(clientId), $(patientId), $(tsh), $(freeT4), $(freeT3));";
        }
        else {
            sql = "UPDATE patient_bloods_tfts SET tsh=$(tsh), free_t4=$(freeT4), free_t3=$(freeT3) WHERE client_id=$(clientId) AND patient_id=$(patientId);";
        }
        let rowsAffected = await this.db.result(sql, {clientId, patientId, tsh, freeT4, freeT3}, result => result.rowCount);
        return rowsAffected === 1;
    }
}
