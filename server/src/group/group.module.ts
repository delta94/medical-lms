import {Module} from "@nestjs/common";
import {GroupRepository} from "@/group/group.repository";
import {GroupController} from "@/group/group.controller";
import {GroupService} from "@/group/group.service";

@Module({
    exports: [GroupRepository],
    controllers: [GroupController],
    providers: [GroupService, GroupRepository]
})
export class GroupModule {}