
export interface ScenarioBaseAttempt{
    attemptId: number;
    clientId: number;
    scenarioId: number;
    completed: boolean;
    timeStarted: Date | undefined;
    timeFinished: Date | undefined;
}

export interface ScenarioDecision {
    attemptId: number;
    step: number;
    decision: any;
}

export interface ScenarioFullAttempt extends ScenarioBaseAttempt{
    decisions: Array<any>;
}
