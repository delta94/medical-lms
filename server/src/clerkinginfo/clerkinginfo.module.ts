import {Module} from "@nestjs/common";
import {ClerkingInfoRepository} from "@/clerkinginfo/clerkinginfo.repository";
import {ClerkingInfoController} from "@/clerkinginfo/clerkinginfo.controller";
import {ClerkingInfoService} from "@/clerkinginfo/clerkinginfo.service";

@Module({
    exports: [ClerkingInfoRepository],
    controllers: [ClerkingInfoController],
    providers: [ClerkingInfoService, ClerkingInfoRepository]
})
export class ClerkingInfoModule {
}
