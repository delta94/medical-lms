import {Global, Module} from "@nestjs/common";
import {NestPgpromiseModule} from "nest-pgpromise/dist";
import {DevSeed} from "./dev.seed";
import {getInstance} from "db-migrate";
import {camelizeColumnNames} from "./util";
import {ProdSeed} from "@/database/prod.seed";
import {TestSeed} from "@/database/test.seed";

@Global()
@Module({
    imports: [
        NestPgpromiseModule.register({
            connection: {
                host: process.env.DB_HOST,
                port: +process.env.DB_PORT,
                database: process.env.DB_SCHEMA,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
            },
            initOptions: {
                // @ts-ignore
                receive(data): any {
                    camelizeColumnNames(data);
                }
            }
        })
    ],
    providers: [DevSeed, TestSeed, ProdSeed]
})
export class DatabaseModule {
    constructor(
        private readonly devSeed: DevSeed,
        private readonly testSeed: TestSeed,
        private readonly prodSeed: ProdSeed
    ) {
        this.migrate();
    }

    private async migrate() {
        const env = process.env.NODE_ENV;
        if (!(env.toLowerCase() === "ci" || env === "testing")) {
            const dbmigrate = getInstance(true);
            const resetDatabase = env === "development" ? true : process.env.DB_RESET === "true";

            if (resetDatabase)
                await this.devSeed.reset();
            await dbmigrate.up();

            if (resetDatabase) {
                if (env === "development")
                    await this.devSeed.execute();
                else if (env === "production")
                    await this.prodSeed.execute();
            }
        }
    }
}