import {PasswordHasher} from "./password-hasher";

test("should return hash", done => {
    PasswordHasher.hash("Password123")
        .then(res => {
            expect(res).toBeTruthy();
            done();
        });
});

test("should match", done => {
    PasswordHasher.compare("Password123", "$2b$12$LaiFrc5j0zTdSJkiyvOm1OJ9XPMJJ3H1vYFCYIIHUq0.XtArhJLja")
        .then(res => {
            expect(res).toBe(true);
            done();
        });
});

test("shouldn't match", done => {
    PasswordHasher.compare("Password", "$2b$12$LaiFrc5j0zTdSJkiyvOm1OJ9XPMJJ3H1vYFCYIIHUq0.XtArhJLja")
        .then(res => {
            expect(res).toBe(false);
            done();
        });
});
