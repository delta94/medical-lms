import {Global, Module} from '@nestjs/common';
import {FeatureService} from "@/feature/feature.service";
import {ClientModule} from "@/client/client.module";
import {FeatureController} from "@/feature/feature.controller";

@Global()
@Module({
    imports: [ClientModule],
    exports: [FeatureService],
    controllers: [FeatureController],
    providers: [FeatureService],
})
export class FeatureModule {}
