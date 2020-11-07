import {Inject, Injectable} from "@nestjs/common";
import {NEST_PGPROMISE_CONNECTION} from "nest-pgpromise/dist";
import {PgPromiseDb} from "@/database/pgpromise";
import {ClerkingInfo} from "@/clerkinginfo/clerkinginfo.entity";

@Injectable()
export class ClerkingInfoRepository {
    constructor(@Inject(NEST_PGPROMISE_CONNECTION) private readonly db: PgPromiseDb) {
    }

    async find(clientId: number, patientId: number): Promise<ClerkingInfo | null> {
        const sql = "SELECT * FROM patient_clerking_info WHERE client_id=$(clientId) AND patient_id=$(patientId);";
        return await this.db.oneOrNone(sql, {clientId, patientId});
    }

    async setClerkingInfo(clientId: number, patientId: number, currentComplaintHistory: string, medicalHistory: string, smokingStatus: boolean, alcoholConsumption: number, performanceStatus: string, adl: string, drugHistory: string, allergies: string, familyHistory: string, systemicReview: string): Promise<boolean | null> {
        let clerkingInfo = await this.find(clientId, patientId);
        let sql = "";
        if (clerkingInfo === null) {
            sql = "INSERT INTO patient_clerking_info(client_id, patient_id, current_complaint_history, medical_history, smoking_status, alcohol_consumption, performance_status, adl, drug_history, allergies, family_history, systemic_review) VALUES($(clientId), $(patientId), $(currentComplaintHistory), $(medicalHistory), $(smokingStatus), $(alcoholConsumption), $(performanceStatus), $(adl), $(drugHistory), $(allergies), $(familyHistory), $(systemicReview));";
        }  else {
            sql = "UPDATE patient_clerking_info SET current_complaint_history=$(currentComplaintHistory), medical_history=$(medicalHistory), smoking_status=$(smokingStatus), alcohol_consumption=$(alcoholConsumption), performance_status=$(performanceStatus), adl=$(adl), allergies=$(allergies), family_history=$(familyHistory), systemic_review=$(systemicReview) WHERE client_id=$(clientId) AND patient_id=$(patientId);";
        }
        let rowsAffected = await this.db.result(sql, {clientId, patientId, currentComplaintHistory, medicalHistory, smokingStatus, alcoholConsumption, performanceStatus, adl, drugHistory, allergies, familyHistory, systemicReview}, result => result.rowCount);
        return rowsAffected === 1;
    }
}
