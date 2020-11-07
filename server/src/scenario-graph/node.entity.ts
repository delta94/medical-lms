export interface ScenarioNode {
    id?: number;
    slug: string;
    type: NodeType;
    data: any;
}

export enum NodeType {
    Start = 0,
    Text = 1,
    Option = 2,
    Conditional = 3,
    Outcome = 4,
    PhysicalExam = 5,
    PatientInfo = 6,
    ClerkingInfo = 7,
    BloodTests = 8,
    Environment = 9,
    ArterialBloodGas = 10,
    ChangeFlag = 12
}
