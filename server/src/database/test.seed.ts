import {Injectable} from "@nestjs/common";
import {PasswordHasher} from "@/account/auth/password-hasher";
import {Role} from "@/user/user.entity";
import {Seed} from "@/database/seed";
import {FeatureFlags} from "@/feature/feature.service";

@Injectable()
export class TestSeed extends Seed {
    async execute(): Promise<void> {
        const cardiffId = (await this.db.one("INSERT INTO clients(name, subdomain) VALUES($(name), $(subdomain)) RETURNING id;", {name: "Cardiff University", subdomain: "cardiff"})).id;
        const standardId = (await this.db.one("INSERT INTO users(client_id, name, email, role) VALUES($(clientId), $(name), $(email), $(role)) RETURNING id;", {name: "Ffion Davies", clientId: cardiffId, email: "standard@cardiff.ac.uk", role: Role.Standard})).id;
        const superUserId = (await this.db.one("INSERT INTO users(client_id, name, email, role, disabled) VALUES($(clientId), $(name), $(email), $(role), false) RETURNING id;", {name: "Sally Spence", clientId: cardiffId, email: "super@cardiff.ac.uk", role: Role.SuperUser})).id;
        const adminId = (await this.db.one("INSERT INTO users(client_id, name, email, role) VALUES($(clientId), $(name), $(email), $(role)) RETURNING id;", {name: "John Smith", clientId: cardiffId, email: "admin@cardiff.ac.uk", role: Role.Admin})).id;
    }
}