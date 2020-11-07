import {deleteRequest, getRequest, postRequest} from "api/HttpMethods";
import {SuccessResult} from "../SuccessResult";

export let FidoApi = {
    isEnabled(email: string | null = null): Promise<boolean> {
        return getRequest(`${getBaseUrl()}${email !== null ? `?email=${email}` : ""}`);
    },
    getAuthenticators(): Promise<any[]> {
        return getRequest(`${getBaseUrl()}/authenticators`);
    },
    deleteAuthenticator(id: string): Promise<SuccessResult> {
        return deleteRequest(`${getBaseUrl()}/authenticators/${id}`);
    },
    getCredentialOptions(): Promise<any> {
        return postRequest(`${getBaseUrl()}/credentials-options`);
    },
    makeCredential(attestationRawResponse: any, identifier: string): Promise<any> {
        return postRequest(`${getBaseUrl()}/make-credential`, {attestationRawResponse, identifier});
    },
    getAssertionOptions(email: string): Promise<any> {
        return postRequest(`${getBaseUrl()}/assertion-options`, email);
    },
    makeAssertion(assertion: any): Promise<any> {
        return postRequest(`${getBaseUrl()}/make-assertion`, assertion);
    }
};

export let Fido = {
    async verifyAuthenticator(email: string): Promise<any> {
        return FidoApi.getAssertionOptions(email)
            .then(async options => {
                if (options.status !== "ok") {
                    return Promise.reject();
                }

                options.challenge = coerceToArrayBuffer(options.challenge);
                options.allowCredentials = options.allowCredentials.map((c: any) => {
                    c.id = coerceToArrayBuffer(c.id);
                    return c;
                });

                let credential: any | null = null;
                try {
                    credential = await navigator.credentials.get({
                        publicKey: options
                    });
                } catch (e) {
                    console.error(e);
                    return Promise.reject(e);
                }

                if (credential) {
                    let authData = new Uint8Array(credential.response.authenticatorData);
                    let clientDataJson = new Uint8Array(credential.response.clientDataJSON);
                    let rawId = new Uint8Array(credential.rawId);
                    let sig = new Uint8Array(credential.response.signature);

                    const data = {
                        id: credential.id,
                        rawId: coerceToBase64Url(rawId),
                        type: credential.type,
                        extensions: credential.getClientExtensionResults(),
                        response: {
                            authenticatorData: coerceToBase64Url(authData),
                            clientDataJson: coerceToBase64Url(clientDataJson),
                            signature: coerceToBase64Url(sig)
                        }
                    };

                    FidoApi.makeAssertion(data)
                        .then(response => {
                            if (response.status !== "ok") {
                                return Promise.reject();
                            }

                            return Promise.resolve();
                        });
                } else {
                    return Promise.reject();
                }
            });
    },
    async registerAuthenticator(identifier: string): Promise<any> {
        return await FidoApi.getCredentialOptions()
            .then(async (options) => {
                if (options.status !== "ok") {
                    return Promise.reject();
                }

                options.challenge = coerceToArrayBuffer(options.challenge);
                options.user.id = coerceToArrayBuffer(options.user.id);
                options.excludeCredentials = options.excludeCredentials.map((c: any) => {
                    c.id = coerceToArrayBuffer(c.id);
                    return c;
                });

                if (options.authenticatorSelection.authenticatorAttachment === null) options.authenticatorSelection.authenticatorAttachment = undefined;

                let newCredential: any | null = null;
                try {
                    newCredential = await navigator.credentials.create({
                        publicKey: options
                    });
                } catch (e) {
                    const msg = "Could not create credentials in browser.  Probably because the username is already registered with your authenticator. Please change username or authenticator.";
                    console.error(msg, e);

                    return Promise.reject();
                }

                if (newCredential) {
                    let attestationObject = new Uint8Array(newCredential.response.attestationObject);
                    let clientDataJson = new Uint8Array(newCredential.response.clientDataJSON);
                    let rawId = new Uint8Array(newCredential.rawId);

                    const data = {
                        id: newCredential.id,
                        rawId: coerceToBase64Url(rawId),
                        type: newCredential.type,
                        extensions: newCredential.getClientExtensionResults(),
                        response: {
                            attestationObject: coerceToBase64Url(attestationObject),
                            clientDataJson: coerceToBase64Url(clientDataJson)
                        }
                    };

                    FidoApi.makeCredential(data, identifier)
                        .then(response => {
                            if (response.status !== "ok") {
                                return Promise.reject();
                            }

                            return Promise.resolve();
                        });
                }
            });
    }
};

function getBaseUrl(): string {
    return "/api/v1/account/mfa/fido";
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
