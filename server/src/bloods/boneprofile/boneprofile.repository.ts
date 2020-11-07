import {Inject, Injectable} from "@nestjs/common";
import {NEST_PGPROMISE_CONNECTION} from "nest-pgpromise/dist";
import {PgPromiseDb} from "@/database/pgpromise";
import {BoneProfile} from "@/bloods/boneprofile/boneprofile.entity";

@Injectable()
export class BoneProfileRepository {
    constructor(@Inject(NEST_PGPROMISE_CONNECTION) private readonly db: PgPromiseDb) {
    }

    async find(clientId: number, patientId: number): Promise<BoneProfile | null> {
        const sql = "SELECT * FROM patient_bloods_bone_profile WHERE client_id=$(clientId) AND patient_id=$(patientId);";
        return await this.db.oneOrNone(sql, {clientId, patientId});
    }

    async setBoneProfileInfo(clientId: number, patientId: number, correctedCalcium: number, alp: number, phosphate: number ): Promise<boolean | null> {
        let boneProfile = await this.find(clientId, patientId);
        let sql = "";
        if (boneProfile === null) {
            sql = "INSERT INTO patient_bloods_bone_profile(client_id, patient_id, corrected_calcium, alp, phosphate) VALUES ($(clientId), $(patientId), $(correctedCalcium), $(alp), $(phosphate));";
        }
        else {
            sql = "UPDATE patient_bloods_bone_profile SET corrected_calcium=$(correctedCalcium), alp=$(alp), phosphate=$(phosphate) WHERE client_id=$(clientId) AND patient_id=$(patientId);";
        }
        let rowsAffected = await this.db.result(sql, {clientId, patientId, correctedCalcium, alp, phosphate}, result => result.rowCount);
        return rowsAffected === 1;
    }
}
