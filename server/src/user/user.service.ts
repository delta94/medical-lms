import {forwardRef, Inject, Injectable, Scope, UnauthorizedException} from "@nestjs/common";
import {UserRepository} from "./user.repository";
import {Role, User} from "./user.entity";
import {PaginatedList} from "@/PaginatedList";
import {QueryRequest} from "@/FilteredQueryRequest";
import {MailerService} from "@nest-modules/mailer";
import {FeatureFlags, FeatureService} from "@/feature/feature.service";
import {isAuthorisedAtLevel, isAuthorisedForClient, UserContext} from "./user.context";
import {AccountRepository} from "@/account/account.repository";
import {PasswordHasher} from "@/account/auth/password-hasher";

@Injectable({scope: Scope.REQUEST})
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly mailerService: MailerService,
        private readonly featureService: FeatureService,
        private readonly accountRepository: AccountRepository,
        @Inject("UserContext") private readonly userContext: any) {
    }

    async create(clientId: number, name: string, email: string, role: Role, disabled: boolean): Promise<User> {
        if (!(isAuthorisedAtLevel(this.userContext, Role.SuperUser) && isAuthorisedForClient(this.userContext, clientId)))
            throw new UnauthorizedException();

        if (role > this.userContext.role)
            throw new UnauthorizedException();

        let user: User = {
            clientId: clientId,
            name: name,
            email: email,
            role: role,
            disabled: disabled,
            mfaEnabled: false
        };

        let result = await this.userRepository.create(user);
        if (await this.featureService.isEnabled(clientId, FeatureFlags.emails)) {
            await this.mailerService
                .sendMail({
                    to: user.email,
                    from: "noreply.system@medl.fi",
                    subject: "Invite",
                    template: "invite.hbs",
                });
        }

        //TODO in future replace this with activation email that takes the user to a page to set intiial password
        await this.accountRepository.createPassword(result.id, await PasswordHasher.hash("Password123"));

        return result;
    }

    async find(clientId: number, queryRequest: QueryRequest): Promise<PaginatedList<User>> {
        if (!(isAuthorisedAtLevel(this.userContext, Role.SuperUser) && isAuthorisedForClient(this.userContext, clientId)))
            throw new UnauthorizedException();

        return await this.userRepository.find(clientId, queryRequest);
    }

    async findById(clientId: number, id: number): Promise<User|null> {
        if (!(isAuthorisedAtLevel(this.userContext, Role.SuperUser) && isAuthorisedForClient(this.userContext, clientId)))
            throw new UnauthorizedException();

        return await this.userRepository.findById(clientId, id);
    }

    async update(clientId: number, id: number, name: string, email: string, role: Role, disabled: boolean): Promise<User> {
        if (!(isAuthorisedAtLevel(this.userContext, Role.SuperUser) && isAuthorisedForClient(this.userContext, clientId)))
            throw new UnauthorizedException();

        let user = await this.findById(clientId, id);
        if (user.role > this.userContext.role)
            throw new UnauthorizedException();
        user.name = name;
        user.email = email;
        user.disabled = disabled;
        if (role <= this.userContext.role)
            user.role = role;

        return await this.userRepository.update(user);
    }

    async delete(clientId: number, id: number): Promise<boolean> {
        if (!(isAuthorisedAtLevel(this.userContext, Role.SuperUser) && isAuthorisedForClient(this.userContext, clientId)))
            throw new UnauthorizedException();

        return await this.userRepository.delete(clientId, id);
    }
}
