import {Module} from "@nestjs/common";
import {BoneProfileRepository} from "@/bloods/boneprofile/boneprofile.repository";
import {BoneProfileController} from "@/bloods/boneprofile/boneprofile.controller";
import {BoneProfileService} from "@/bloods/boneprofile/boneprofile.service";

@Module({
    exports: [BoneProfileRepository],
    controllers: [BoneProfileController],
    providers: [BoneProfileService, BoneProfileRepository]
})
export class BoneProfileModule {
}
