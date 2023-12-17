export interface ReportIssueModel {
    issueId: string;
    issueKey: string;
    summary: string;
    status?: string;
    mainDev: string;
    participants: {
        name: string;
        workTimeSeconds: number;
        percent: number;    
    }[];
    childKeys?: string[];
    estimateSeconds: number;
    workTimeSeconds: number;
}

export interface ReportModel {
    releaseVersion: string;
    createdAt: Date;
    updatedAt: Date;
    issues: ReportIssueModel[];
}

export interface ResultModel {
    jiraIssueUrl: string;
    report: ReportModel;
}