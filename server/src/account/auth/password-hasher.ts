import {hash, compare} from "bcrypt";

export let PasswordHasher = {
    async hash(password: string): Promise<string> {
        return await hash(password, 12);
    },
    async compare(password: string, hash: string): Promise<boolean> {
        return await compare(password, hash);
    }
};