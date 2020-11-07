import {forwardRef, Module} from '@nestjs/common';
import {UserController} from "./user.controller";
import {UserService} from "./user.service";
import {UserRepository} from "./user.repository";
import {UserContext} from "./user.context";
import {AccountModule} from "@/account/account.module";

@Module({
    imports: [forwardRef(() => AccountModule)],
    exports: [UserRepository],
    controllers: [UserController],
    providers: [UserService, UserContext, UserRepository]
})
export class UserModule {
}
