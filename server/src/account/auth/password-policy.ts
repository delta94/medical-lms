import * as zxcvbn from "zxcvbn";

const minLength: number = 8;

export function getPasswordScore(password: string | null): number {
    if (password === null || password.trim() === "" || password.length < minLength) return 0;
    return zxcvbn(password).score;
}

export function isPasswordStrongEnough(password: string | null): boolean {
    return getPasswordScore(password) > 2;
}

export class WeakPasswordException extends Error {

}
