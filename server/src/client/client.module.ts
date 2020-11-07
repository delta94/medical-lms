import {Module} from '@nestjs/common';
import {ClientController} from "./client.controller";
import {ClientService} from "./client.service";
import {ClientRepository} from "./client.repository";
import {GroupModule} from "@/group/group.module";

@Module({
    imports: [GroupModule],
    exports: [ClientService, ClientRepository],
    controllers: [ClientController],
    providers: [ClientService, ClientRepository],
})
export class ClientModule {}
