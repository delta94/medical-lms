import {Injectable, NotFoundException} from "@nestjs/common";
import {AccountRepository} from "@/account/account.repository";
import {UserRepository} from "@/user/user.repository";
import {ClientRepository} from "@/client/client.repository";
import {FeatureService} from "@/feature/feature.service";

@Injectable()
export default class MfaService {
    constructor(
        private readonly accountRepository: AccountRepository,
        private readonly featureService: FeatureService,
        private readonly userRepository: UserRepository,
        private readonly clientRepository: ClientRepository) {
    }

    async isMfaSetup(clientId: number, userId: number): Promise<boolean> {
        let user = await this.userRepository.findById(clientId, userId);
        if (user === null) throw new NotFoundException();

        return user.mfaEnabled;
    }

    async generateMfaRecoveryCodes(clientId: number, userId: number, regenerated: boolean = false): Promise<void> {
        let client = await this.clientRepository.findById(clientId);
        if (client === null) throw new NotFoundException();

        let user = await this.userRepository.findById(clientId, userId);
        if (user === null) throw new NotFoundException();

        let recoveryCodes: string[] = [];
        for (let i = 0; i < 10; i++) {
            recoveryCodes.push(generateRandomString(8, "0123456789abcdef"));
        }

        await this.accountRepository.setRecoveryCodes(userId, recoveryCodes);
        // if (regenerated) TODO send email
    }

    async findRecoveryCodes(userId: number): Promise<string[]> {
        return this.accountRepository.findRecoveryCodes(userId);
    }

    async verifyRecoveryCode(email: string, code: string): Promise<boolean> {
        let user = await this.userRepository.findByEmail(email);
        if (user === null) throw new NotFoundException();

        let [valid, codesRemaining] = await this.accountRepository.useRecoveryCode(user.id, code);
        if (!valid) return false;
        if (codesRemaining === 0)
            await this.generateMfaRecoveryCodes(user.clientId, user.id, true);

        return true;
    }

    async disableMfa(clientId: number, userId: number): Promise<boolean> {
        //TODO some sort of authorisation check

        let client = await this.clientRepository.findById(clientId);
        if (client === null) throw new NotFoundException();

        let user = await this.userRepository.findById(clientId, userId);
        if (user === null) throw new NotFoundException();

        if (!user.mfaEnabled)
            return false;

        await this.accountRepository.setMfaEnabledStatus(userId, false);
        await this.accountRepository.disableTotp(userId);
        //TODO maybe delete u2f authenticators

        //TODO send email
        return true;
    }
}

//Based on https://github.com/jaredhanson/passport-totp/blob/master/examples/two-factor/utils.js
export function generateRandomString(length: number, allowedCharacters: string) {
    let buf = [], charLength = allowedCharacters.length;

    for (let i = 0; i < length; ++i) {
        buf.push(allowedCharacters[getRandomInt(0, charLength - 1)]);
    }

    return buf.join("");
}

function getRandomInt(min, max): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}