import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Put,
    Request,
    UnauthorizedException,
    UseGuards
} from '@nestjs/common';
import {AuthGuard} from "@nestjs/passport";
import {FeatureService, IFeatureStatus} from "@/feature/feature.service";
import {SuccessResult} from "@/SuccessResult";
import {Role} from "@/user/user.entity";

export class SetFeatureModel {
    [key: string]: {
        enabled: boolean | null;
        force: boolean;
    }
}

@Controller("/api/v1/clients/:id/features")
@UseGuards(AuthGuard('jwt'))
export class FeatureController {
    constructor(
        private readonly featureService: FeatureService,
    ) {}

    @Get()
    async get(@Param("id", new ParseIntPipe()) id: number): Promise<{ global: any, client: any }> {
        let globalFeatureFlags = this.featureService.getFeatureFlagsForSystem();
        let clientFeatureFlags = await this.featureService.getFeatureFlagsForClient(id);

        return {
            global: Object.fromEntries(globalFeatureFlags),
            client: Object.fromEntries(clientFeatureFlags)
        }
    }

    @Put()
    async set(@Param("id", new ParseIntPipe()) id: number, @Body() model: SetFeatureModel, @Request() request): Promise<SuccessResult> {
        if (request.user.role !== Role.Admin)
            throw new UnauthorizedException();

        let success = await this.featureService.setFeatureFlagsForClient(id, new Map<string, IFeatureStatus>(Object.entries(model)));
        return new SuccessResult(success);
    }
}
