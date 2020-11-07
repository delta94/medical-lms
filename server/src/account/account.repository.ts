import {Inject, Injectable} from "@nestjs/common";
import {NEST_PGPROMISE_CONNECTION} from "nest-pgpromise/dist";
import {PgPromiseDb} from "@/database/pgpromise";
import {FidoCredential} from "@/account/auth/fido";

@Injectable()
export class AccountRepository {
    constructor(@Inject(NEST_PGPROMISE_CONNECTION) private readonly db: PgPromiseDb) {
    }

    async createPassword(userId: number, hashedPassword: string): Promise<void> {
        const sql = `
            INSERT INTO password_auth(user_id, password_hash)
            VALUES ($(userId), $(hashedPassword));`;

        await this.db.none(sql, {userId, hashedPassword});
    }

    async createSamlData(userId: number, identifier: string, sessionIndex: string): Promise<any|null> {
        const sql = `
            INSERT INTO saml_auth(user_id, identifier, session_index)
            VALUES($(userId), $(identifier), $(sessionIndex));`;
        const rowsAffected = await this.db.result(sql, {userId, identifier, sessionIndex}, result => result.rowCount);
        return rowsAffected === 1;
    }

    async createFidoCredential(credential: FidoCredential): Promise<void> {
        let sql = `
            INSERT INTO fido_auth(user_id, credential_id, public_key, signature_counter, aa_guid, identifier)
            VALUES ($(userId), $(credentialId), $(publicKey), $(signatureCounter), $(aaGuid), $(identifier));
        `;

        await this.db.none(sql, credential);
    }

    async findHashedPasswordByEmail(email: string): Promise<string|null> {
        const sql = `
            SELECT password_hash 
            FROM users u
            JOIN password_auth pa ON pa.user_id = u.id
            WHERE u.email = $(email);`;
        const result = await this.db.oneOrNone(sql, {email});
        return result?.passwordHash;
    }

    async findSamlDataByEmail(email: string): Promise<any|null> {
        const sql = `
            SELECT sa.* 
            FROM users u
            JOIN saml_auth sa ON sa.user_id = u.id
            WHERE u.email = $(email);`;
        return await this.db.oneOrNone(sql, {email});
    }

    async findCredentialById(id: number[]): Promise<FidoCredential|null> {
        let sql = "SELECT * FROM fido_auth WHERE credential_id = $(id);";
        return await this.db.oneOrNone(sql, {id});
    }

    async findCredentialsByUserId(userId: number): Promise<FidoCredential[]> {
        let sql = "SELECT * FROM fido_auth WHERE user_id = $(userId);";
        return await this.db.query(sql, {userId});
    }

    async findSecretByUserId(userId: number): Promise<string|null> {
        let sql = "SELECT secret FROM totp_auth WHERE user_id = $(userId);";
        return (await this.db.oneOrNone(sql, {userId}))?.secret;
    }

    async findIfTotpEnabled(userId: number): Promise<boolean> {
        let sql = "SELECT enabled FROM totp_auth WHERE user_id = $(userId);";
        return (await this.db.oneOrNone(sql, {userId}))?.enabled ?? false;
    }

    async findRecoveryCodes(userId: number): Promise<string[]> {
        let sql = "SELECT code FROM mfa_recovery_codes WHERE user_id = $(userId);";
        return (await this.db.query(sql, {userId})).map(c => c.code);
    }

    async updatePassword(userId: number, hashedPassword: string): Promise<boolean> {
        const sql = `
            UPDATE password_auth
            SET password_hash = $(hashedPassword)
            WHERE user_id = $(userId);`;
        const rowsAffected = await this.db.result(sql, {userId, hashedPassword}, result => result.rowCount);
        return rowsAffected === 1;
    }

    async setLanguage(clientId: number, id: number, language: string): Promise<boolean> {
        const sql = `
            UPDATE users
            SET language = $(language)
            WHERE client_id=$(clientId) AND id=$(id);        
        `;
        const rowsAffected = await this.db.result(sql, {clientId, id, language}, result => result.rowCount);
        return rowsAffected == 1;
    }

    async updateSignatureCounter(credentialId: number[], counter: number): Promise<boolean> {
        let sql = "UPDATE fido_auth SET signature_counter=$(counter) WHERE credential_id = $(credentialId);";
        let rowsAffected = await this.db.result(sql, {credentialId, counter}, result => result.rowCount);
        return rowsAffected === 1;
    }

    async updateSecretKey(userId: number, secret: string): Promise<boolean> {
        let existingSecret = await this.findSecretByUserId(userId);
        let sql = existingSecret === undefined || existingSecret.trim() === ""
            ? "INSERT INTO totp_auth(user_id, secret) VALUES($(userId), $(secret));"
            : "UPDATE totp_auth SET secret=$(secret) WHERE user_id=$(userId);";
        let rowsAffected = await this.db.result(sql, {userId, secret}, result => result.rowCount);
        return rowsAffected === 1;
    }

    async disableTotp(userId: number): Promise<boolean> {
        let sql = "DELETE FROM totp_auth WHERE user_id = $(userId);";
        let rowsAffected = await this.db.result(sql, {userId}, result => result.rowCount);
        return rowsAffected === 1;
    }

    async setMfaEnabledStatus(userId: number, enabled: boolean): Promise<boolean> {
        let sql = "UPDATE users SET mfa_enabled=$(enabled) WHERE id = $(userId);";
        let rowsAffected = await this.db.result(sql, {userId, enabled}, result => result.rowCount);
        return rowsAffected === 1;
    }

    async setRecoveryCodes(userId: number, recoveryCodes: string[]): Promise<void> {
        let sql = "DELETE FROM mfa_recovery_codes WHERE user_id = $(userId);";
        await this.db.none(sql, {userId});

        sql = "INSERT INTO mfa_recovery_codes(user_id, code) VALUES($(userId), $(code));";
        for (let code of recoveryCodes) {
            await this.db.none(sql, {userId, code});
        }
    }

    async setTotpEnabled(userId: number): Promise<boolean> {
        let sql = "UPDATE totp_auth SET enabled=true WHERE user_id=$(userId);"
        let rowsAffected = await this.db.result(sql, {userId}, result => result.rowCount);
        return rowsAffected === 1;
    }

    async deleteCredentialById(id: Uint8Array): Promise<boolean> {
        let sql = "DELETE FROM fido_auth WHERE credential_id=$(id);";
        let rowsAffected = await this.db.result(sql, {id}, result => result.rowCount);
        return rowsAffected === 1;
    }


    async useRecoveryCode(userId: number, code: string): Promise<[boolean, number]> {
        let sql = "DELETE FROM mfa_recovery_codes WHERE user_id=$(userId) AND code=$(code);";
        let rowsAffected = await this.db.result(sql, {userId, code}, result => result.rowCount);

        sql = "SELECT COUNT(*) as count FROM mfa_recovery_codes WHERE user_id=$(userId);";
        let codesRemaining = (await this.db.one(sql, {userId})).count;

        return [rowsAffected === 1, codesRemaining];
    }
}