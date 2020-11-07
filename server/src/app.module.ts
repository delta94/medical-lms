import {MiddlewareConsumer, Module, NestModule, RequestMethod} from "@nestjs/common";
import {UserModule} from "@/user/user.module";
import {DatabaseModule} from "@/database/database.module";
import {ClientModule} from "@/client/client.module";
import {AccountModule} from "@/account/account.module";
import {GroupModule} from "@/group/group.module";
import {ResourceModule} from "@/resource/resource.module";
import {HandlebarsAdapter, MailerModule} from '@nest-modules/mailer';
import {SubdomainMiddleware} from "@/extras/SubdomainMiddleware";
import {FeatureModule} from "@/feature/feature.module";
import {PhysicalExamRegionModule} from "@/physicalexamregions/physicalexamregion.module";
import {PhysicalExamResultsModule} from "@/physicalexamresults/physicalexamresults.module";
import {PatientModule} from "@/patient/patient.module";
import {ScenarioModule} from "@/scenario/scenario.module";
import {GraphModule} from "@/scenario-graph/graph.module";
import {SsoModule} from "@/sso/sso.module";
import {FbcModule} from "@/bloods/fbc/fbc.module";
import {UesModule} from "@/bloods/ues/ues.module";
import {LftsModule} from "@/bloods/lfts/lfts.module";
import {Bl12folateModule} from "@/bloods/bl12folate/bl12folate.module";
import {BoneProfileModule} from "@/bloods/boneprofile/boneprofile.module";
import {CoagulationModule} from "@/bloods/coagulation/coagulation.module";
import {TftsModule} from "@/bloods/tfts/tfts.module";
import {OtherModule} from "@/bloods/other/other.module";
import {ClerkingInfoModule} from "@/clerkinginfo/clerkinginfo.module";
import {ArterialBloodGasModule} from "@/arterialbloodgas/arterialbloodgas.module";
import {ScenarioSpeakerModule} from "@/scenario-speakers/scenariospeaker.module";
import {REQUEST} from "@nestjs/core";
import {ScenarioDecisionModule} from "@/scenario-decisions/scenario-decision.module";

@Module({
    imports: [
        DatabaseModule,
        FeatureModule,
        AccountModule,
        UserModule,
        GroupModule,
        ClientModule,
        ResourceModule,
        PatientModule,
        PhysicalExamRegionModule,
        PhysicalExamResultsModule,
        ScenarioModule,
        ScenarioDecisionModule,
        GraphModule,
        HandlebarsAdapter,
        FbcModule,
        LftsModule,
        UesModule,
        Bl12folateModule,
        BoneProfileModule,
        CoagulationModule,
        TftsModule,
        OtherModule,
        ClerkingInfoModule,
        SsoModule,
        ArterialBloodGasModule,
        ScenarioSpeakerModule,
        MailerModule.forRoot({
            transport: {
                host: process.env.EMAIL_HOST || "smtp.mailtrap.io",
                port: 2525,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                }
            },
            defaults: {
                from:'"nest-modules" <modules@nestjs.com>',
            },
            template: {
                dir: `${__dirname}/templates`,
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
        })
    ]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {
        consumer
            .apply(SubdomainMiddleware)
            .forRoutes({path: "*", method: RequestMethod.ALL});
    }
}


