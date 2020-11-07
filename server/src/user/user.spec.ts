import {INestApplication, UnauthorizedException} from "@nestjs/common";
import {MailerService} from "@nest-modules/mailer";
import {Test} from "@nestjs/testing";
import {AppModule} from "@/app.module";
import {UserService} from "@/user/user.service";
import {ContextIdFactory} from "@nestjs/core";
import {FeatureService} from "@/feature/feature.service";
import {IUserContext, UserContext} from "@/user/user.context";
import {Role} from "@/user/user.entity";
import {TestSeed} from "@/database/test.seed";
import {getInstance} from "db-migrate";
import {IIdentity} from "@/account/auth/identity";

const standardId = 1;
const superId = 2;
const adminId = 3;

export class SuperIdentity implements IIdentity {
    readonly id: number = superId;
    readonly clientId: number = 1;
    readonly name: string = "Sally Spence";
    readonly email: string = "super@example.com";
    readonly role: Role = Role.SuperUser;
    readonly isAuthenticated: boolean;
}

export class SuperContext implements IUserContext {
    user: IIdentity = new SuperIdentity();

    get clientId(): number {
        return this.user.clientId;
    }

    get email(): string {
        return this.user.email;
    }

    get role(): Role {
        return this.user.role;
    }
}

describe('Users (Logged in as Super User)', () => {
    let app: INestApplication;
    let userService: UserService;

    beforeAll(async () => {
        const contextId = ContextIdFactory.create();
        jest
            .spyOn(ContextIdFactory, 'getByRequest')
            .mockImplementation(() => contextId);
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule]
        })
            .overrideProvider(MailerService)
            .useValue({})
            .overrideProvider(FeatureService)
            .useValue({
                isEnabled: async (clientId: number, featureName: string) => {
                    return Promise.resolve(false);
                }
            })
            .overrideProvider(UserContext)
            .useClass(SuperContext)
            .compile();

        app = moduleRef.createNestApplication();
        await app.init();
        userService = await app.resolve(UserService, contextId);
        let testSeed = await app.resolve(TestSeed);
        const dbmigrate = getInstance(true);
        await testSeed.reset();
        await dbmigrate.up();
        await testSeed.execute();
    });

    it("findById clientMismatch", async () => {
        try {
            let user = await userService.findById(2, 1);
            expect(1).toBe(2); //THis should fail
        } catch (e) {
            expect(e).toBeInstanceOf(UnauthorizedException);
        }
    });

    it("findById", async () => {
        let user = await userService.findById(1, 1);
        expect(user.name).toBe("Ffion Davies");
    });

    it("update", async () => {
        const updatedEmail = "updated@example.com";
        let user = await userService.findById(1, standardId);
        let updatedUser = await userService.update(1, standardId, user.name, updatedEmail, user.role, user.disabled);
        expect(updatedUser.name).toBe(user.name);
        expect(updatedUser.email).toBe(updatedEmail);
        expect(updatedUser.role).toBe(user.role);
        expect(updatedUser.disabled).toBe(user.disabled);
    });

    it("can't update admin", async () => {
        let user = await userService.findById(1, adminId);
        try {
            await userService.update(1, adminId, user.name, user.email, user.role, user.disabled);
            expect(1).toBe(2); //THis should fail
        } catch (e) {
            expect(e).toBeInstanceOf(UnauthorizedException);
        }
    });

    it("can't privilege escalate", async () => {
        let user = await userService.findById(1, standardId);
        let updatedUser = await userService.update(1, standardId, user.name, user.email, Role.Admin, user.disabled);
        expect(updatedUser.role).toBe(Role.Standard);
    });

    it("can't privilege escalate self", async () => {
        let user = await userService.findById(1, superId);
        let updatedUser = await userService.update(1, superId, user.name, user.email, Role.Admin, user.disabled);
        expect(updatedUser.role).toBe(Role.SuperUser);
    });

    afterAll(async () => {
        await app.close();
    });
});