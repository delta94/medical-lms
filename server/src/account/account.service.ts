import {forwardRef, Inject, Injectable, UnauthorizedException} from "@nestjs/common";
import {AccountRepository} from "@/account/account.repository";
import {UserRepository} from "@/user/user.repository";
import {PasswordHasher} from "@/account/auth/password-hasher";
import {Role, SamlData, User} from "@/user/user.entity";
import {JwtService} from "@nestjs/jwt";
import {Profile} from "passport-saml";
import {samlConstants} from "@/account/auth/consts";
import {ClientRepository} from "@/client/client.repository";
import {isPasswordStrongEnough, WeakPasswordException} from "@/account/auth/password-policy";
import {FeatureFlags, FeatureService} from "@/feature/feature.service";

//TODO authorisation
@Injectable()
export default class AccountService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly accountRepository: AccountRepository,
        private readonly featureService: FeatureService,
        private readonly userRepository: UserRepository,
        private readonly clientRepository: ClientRepository) {
    }

    async getUserIfValidCredentials(clientId: number, email: string, password: string) {
        const user = await this.userRepository.findByEmail(email);
        if (user == null)
            return new UserResponse(null, LoginError.UserNonExistent);

        if (user.disabled)
            return new UserResponse(null, LoginError.UserDisabled);

        const hashedPassword = await this.accountRepository.findHashedPasswordByEmail(email);
        const passwordsMatched = await PasswordHasher.compare(password, hashedPassword);

        if (passwordsMatched)
            return new UserResponse(user, LoginError.None);

        return new UserResponse(null, LoginError.IncorrectPassword);
    }

    async getUserIfValidSamlResponse(clientId: number, samlResponse: Profile): Promise<SamlUserResponse> {
        if (!await this.featureService.isEnabled(clientId, FeatureFlags.samlSSO))
            throw new UnauthorizedException();

        let user = await this.userRepository.findBySamlIdentifier(samlResponse.nameID);

        let samlData: SamlData | null = null;

        if (user == null) {
            user = await this.userRepository.findByEmail(samlResponse[samlConstants.email] as string);

            if (user != null) {
                samlData = await this.accountRepository.findSamlDataByEmail(user.email);

                if (!(samlData?.identifier === null || samlData?.identifier === ""))
                    return new SamlUserResponse(null, SamlLoginError.UserNotIdentified);
            }
        }

        if (user == null) {
            //User needs to be created
            return new SamlUserResponse(null, SamlLoginError.None);
        }

        samlData = await this.accountRepository.findSamlDataByEmail(user.email);

        if (samlData === null)
            return new SamlUserResponse(null, SamlLoginError.UserNotSso);

        if (user.disabled)
            return new SamlUserResponse(null, SamlLoginError.UserDisabled);

        return new SamlUserResponse(user, SamlLoginError.None);
    }

    async provisionNewSamlUser(clientId: number, profile: Profile): Promise<User> {
        const user: User = {
            clientId: clientId,
            name: profile[samlConstants.name] as string,
            email: profile[samlConstants.email] as string,
            role: Role.Standard,
            disabled: false,
            mfaEnabled: false
        }

        let result = await this.userRepository.create(user);

        await this.accountRepository.createSamlData(result.id, profile.nameID, profile.sessionIndex);

        return result;
    }

    login(user: any) {
        return {
            success: true,
            user: user,
            access_token: this.jwtService.sign(user)
        }
    }

    async samlLogin(user: any) {
        let subdomain = await this.clientRepository.findSubdomainById(user.clientId);

        return {
            subdomain: subdomain,
            user: user,
            access_token: this.jwtService.sign(user)
        }
    }

    async setLanguage(clientId: number, userId: number, language: string): Promise<boolean> {
        return await this.accountRepository.setLanguage(clientId, userId, language);
    }

    async changePassword(clientId: number, userId: number, email: string, currentPassword: string, newPassword: string): Promise<boolean> {
        let userResponse = await this.getUserIfValidCredentials(clientId, email, currentPassword);
        if (!userResponse.user)
            return false;

        if (!isPasswordStrongEnough(newPassword))
            throw new WeakPasswordException();

        let hashedPassword = await PasswordHasher.hash(newPassword);
        return await this.accountRepository.updatePassword(userId, hashedPassword);
    }
}

export enum LoginError {
    None = 1,
    UserNotActivated = 2,
    UserNonExistent = 3,
    IncorrectPassword = 4,
    UserDisabled = 5
}

export enum SamlLoginError {
    None = 1,
    SsoNotConfigured = 2,
    UserNonExistent = 3,
    UserNotIdentified = 4,
    UserDisabled = 5,
    UserNotSso = 6
}

export class UserResponse {
    readonly user: User;
    readonly loginError: LoginError;

    constructor(user: User, loginError: LoginError) {
        this.user = user;
        this.loginError = loginError;
    }
}

export class SamlUserResponse {
    readonly user: User;
    readonly loginError: SamlLoginError;

    constructor(user: User, loginError: SamlLoginError) {
        this.user = user;
        this.loginError = loginError;
    }
}