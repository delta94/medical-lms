import {Injectable, NotFoundException} from "@nestjs/common";
import {AccountRepository} from "@/account/account.repository";
import {UserRepository} from "@/user/user.repository";
import {FeatureService} from "@/feature/feature.service";
import {generateRandomString} from "@/account/mfa.service";
import * as base32 from "thirty-two";

@Injectable()
export default class TotpService {
    constructor(
        private readonly accountRepository: AccountRepository,
        private readonly featureService: FeatureService,
        private readonly userRepository: UserRepository) {
    }

    async isTotpEnabled(email: string): Promise<boolean> {
        let user = await this.userRepository.findByEmail(email);
        if (user === null) throw new NotFoundException();

        return this.accountRepository.findIfTotpEnabled(user.id);
    }

    async disable(userId: number): Promise<boolean> {
        let authenticators = await this.accountRepository.findCredentialsByUserId(userId);
        if (authenticators.length === 0) {
            await this.accountRepository.setMfaEnabledStatus(userId, false);
            //TODO send email
        }

        return await this.accountRepository.disableTotp(userId);
    }

    //Based off https://github.com/jaredhanson/passport-totp/blob/9abb4862d60862028ab5af112a331c81d220d77b/examples/two-factor/server.js#L37
    async generateTotpSetup(email: string) {
        let user = await this.userRepository.findByEmail(email);
        if (user === null) throw new NotFoundException();

        if (user.mfaEnabled && await this.isTotpEnabled(email))
            throw Error("TOTP based two-factor authentication already enabled");
        let secret = generateRandomString(10, "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567");
        await this.accountRepository.updateSecretKey(user.id, secret);
        secret = base32.encode(secret).toString();
        let otpUrl = `otpauth://totp/${email}?secret=${secret}&period=${30}`;
        let qrCodeImage = `https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=${encodeURIComponent(otpUrl)}`;
        return {
            manualSetupKey: secret,
            qrCodeImage
        }
    }

    async verifyTotpSetup(clientId: number, userId: number) {
        let mfaEnabled = await this.featureService.isEnabled(clientId, "mfa");
        let totpEnabled = await this.featureService.isEnabled(clientId, "mfa-totp");
        if (mfaEnabled && totpEnabled) {
            await this.accountRepository.setMfaEnabledStatus(userId, true);
            await this.accountRepository.setTotpEnabled(userId);
        }
    }
}