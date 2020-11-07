export interface PhysicalExamResults {
    id?: number,
    clientId: number,
    patientId: number,
    regionId: number,
    result: string,
    appropriate: boolean;
}
