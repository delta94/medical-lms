import {Injectable, NotFoundException} from "@nestjs/common";
import {AccountRepository} from "@/account/account.repository";
import {UserRepository} from "@/user/user.repository";
import {FeatureService} from "@/feature/feature.service";
import {Authenticator} from "@/account/auth/fido";

@Injectable()
export default class FidoService {
    constructor(
        private readonly accountRepository: AccountRepository,
        private readonly featureService: FeatureService,
        private readonly userRepository: UserRepository) {
    }

    async isFidoEnabled(email: string): Promise<boolean> {
        let user = await this.userRepository.findByEmail(email);
        if (user === null) throw new NotFoundException();

        return this.accountRepository.findIfTotpEnabled(user.id);
    }

    async getAuthenticators(userId: number): Promise<Authenticator[]> {
        return (await this.accountRepository.findCredentialsByUserId(userId)).map(c => {
            return {id: coerceToBase64Url(c.credentialId), identifier: c.identifier, createdAt: c.createdAt}
        });
    }

    async deleteAuthenticator(userId: number, id: Uint8Array): Promise<boolean> {
        let authenticators = await this.getAuthenticators(userId);

        if (authenticators.length === 1) {
            let totpEnabled = await this.accountRepository.findIfTotpEnabled(userId);
            if (!totpEnabled) {
                await this.accountRepository.setMfaEnabledStatus(userId, false);
            }
        }

        return await this.accountRepository.deleteCredentialById(id);
    }
}

//From https://github.com/abergs/fido2-net-lib/blob/master/Demo/wwwroot/js/helpers.js
export function coerceToArrayBuffer(thing: any) {
    if (typeof thing === "string") {
        // base64url to base64
        thing = thing.replace(/-/g, "+").replace(/_/g, "/");

        // base64 to Uint8Array
        const str = window.atob(thing);
        const bytes = new Uint8Array(str.length);
        for (let i = 0; i < str.length; i++) {
            bytes[i] = str.charCodeAt(i);
        }
        thing = bytes;
    }

    // Array to Uint8Array
    if (Array.isArray(thing)) {
        thing = new Uint8Array(thing);
    }

    // Uint8Array to ArrayBuffer
    if (thing instanceof Uint8Array) {
        thing = thing.buffer;
    }

    // error if none of the above worked
    if (!(thing instanceof ArrayBuffer)) {
        throw new TypeError("could not coerce to ArrayBuffer");
    }

    return thing;
}

export function coerceToBase64Url(thing: any) {
    // Array or ArrayBuffer to Uint8Array
    if (Array.isArray(thing)) {
        thing = Uint8Array.from(thing);
    }

    if (thing instanceof ArrayBuffer) {
        thing = new Uint8Array(thing);
    }

    // Uint8Array to base64
    if (thing instanceof Uint8Array) {
        let str = "";
        const len = thing.byteLength;

        for (let i = 0; i < len; i++) {
            str += String.fromCharCode(thing[i]);
        }
        thing = window.btoa(str);
    }

    if (typeof thing !== "string") {
        throw new Error("could not coerce to string");
    }

    // base64 to base64url
    // NOTE: "=" at the end of challenge is optional, strip it off here
    thing = thing.replace(/\+/g, "-").replace(/\//g, "_").replace(/=*$/g, "");

    return thing;
}
