import {Inject, Injectable} from "@nestjs/common";
import {NEST_PGPROMISE_CONNECTION} from "nest-pgpromise/dist";
import {PgPromiseDb} from "@/database/pgpromise";
import {SSO} from "@/sso/sso.entity";

@Injectable()
export class SsoRepository {
    constructor(@Inject(NEST_PGPROMISE_CONNECTION) private readonly db: PgPromiseDb) {
    }

    async find(clientId: number): Promise<SSO | null> {
        const sql = "SELECT * FROM client_saml WHERE client_id=$(clientId);";
        return await this.db.oneOrNone(sql, {clientId})
    }

    async setSSOSettings(clientId: number, endpoint: string, certificate: string): Promise<boolean> {
        let currentSso = await this.find(clientId);
        let sql = "";
        if (currentSso !== null) {
            if (endpoint.trim() === "" || certificate.trim() === "") {
                sql = "DELETE FROM client_saml WHERE client_id=$(clientId);";
            } else {
                sql = "UPDATE client_saml SET endpoint=$(endpoint), certificate=$(certificate) WHERE client_id=$(clientId);";
            }
        } else {
            sql = "INSERT INTO client_saml(client_id, endpoint, certificate) VALUES($(clientId), $(endpoint), $(certificate));";
        }

        if (currentSso?.endpoint === null && (endpoint.trim() === "" || certificate.trim() === "")) {
            return true;
        }

        let rowsAffected = await this.db.result(sql, {clientId, endpoint, certificate}, result => result.rowCount);

        return rowsAffected === 1;
    }

}
