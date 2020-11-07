import {Inject, Injectable} from "@nestjs/common";
import {NEST_PGPROMISE_CONNECTION} from "nest-pgpromise/dist";
import {PgPromiseDb} from "@/database/pgpromise";
import {PhysicalExamRegion} from "@/physicalexamregions/physicalexamregion.entity";

@Injectable()
export class PhysicalExamRegionRepository {
    constructor(@Inject(NEST_PGPROMISE_CONNECTION) private readonly db: PgPromiseDb) {
    }

    async find(): Promise<PhysicalExamRegion[]> {
        let sql = `
                SELECT * FROM physical_exam_regions`;

        return await this.db.manyOrNone(sql);
    }
}
