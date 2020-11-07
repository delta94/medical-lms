import {PgPromiseDb} from "./pgpromise";
import {NEST_PGPROMISE_CONNECTION} from "nest-pgpromise/dist";
import {Inject} from "@nestjs/common";

export abstract class Seed {
    public constructor(@Inject(NEST_PGPROMISE_CONNECTION) protected readonly db: PgPromiseDb) {}

    async reset(): Promise<void> {
        await this.db.query(`
            DO $$ DECLARE
                r RECORD;
            BEGIN
                FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
                    EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
                END LOOP;
            END $$;
        `);
    }

    abstract async execute(): Promise<void>;
}