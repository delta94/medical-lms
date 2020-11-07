import {Inject, Injectable} from "@nestjs/common";
import {NEST_PGPROMISE_CONNECTION} from "nest-pgpromise/dist";
import {PgPromiseDb} from "@/database/pgpromise";
import {ArterialBloodGas} from "@/arterialbloodgas/arterialbloodgas.entity";

@Injectable()
export class ArterialBloodGasRepository {
    constructor(@Inject(NEST_PGPROMISE_CONNECTION) private readonly db: PgPromiseDb) {
    }

    async find(clientId: number, patientId: number): Promise<ArterialBloodGas | null> {
        const sql = "SELECT * FROM patients_arterial_blood_gas WHERE client_id=$(clientId) AND patient_id=$(patientId);";
        return await this.db.oneOrNone(sql, {clientId, patientId});
    }

    async setArterialBloodGas(clientId: number, patientId: number, ph: number, pao2: number, paco2: number, hco3: number, baseExcess: number, lactate: number): Promise<boolean | null> {
        let arterialBloodGas = await this.find(clientId, patientId);
        let sql = "";
        if (arterialBloodGas === null) {
            sql = "INSERT INTO patients_arterial_blood_gas(client_id, patient_id, pH, PaO2, PaCO2, HCO3, base_excess, lactate) VALUES ($(clientId), $(patientId), $(ph), $(pao2), $(paco2), $(hco3), $(baseExcess), $(lactate));";
        }
        else {
            sql = "UPDATE patients_arterial_blood_gas SET pH=$(ph), PaO2=$(pao2), PaCO2=$(paco2), HCO3=$(hco3), base_excess=$(baseExcess), lactate=$(lactate) WHERE client_id=$(clientId) AND patient_id=$(patientId);";
        }
        let rowsAffected = await this.db.result(sql, {clientId, patientId, ph, pao2, paco2, hco3, baseExcess, lactate}, result => result.rowCount);
        return rowsAffected === 1;
    }
}
