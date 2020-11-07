import {getRequest} from "../HttpMethods";

export let PhysicalExamRegionApi = {
    find(): Promise<PhysicalExamRegion[]> {
        return getRequest(getBaseUrl());
    }
};

export interface PhysicalExamRegion {
    id: number;
    name: string;
    female_sensitive: boolean;
    male_sensitive: boolean;
    deleted: boolean;
    defaultValue: string;
}

export function emptyPhysicalExamRegion(): PhysicalExamRegion {
    return {
        id: 0,
        name: '',
        female_sensitive: false,
        male_sensitive: false,
        deleted: false,
        defaultValue: ''
    }
}

function getBaseUrl(): string {
    return "/api/v1/physicalexam/regions";
}
