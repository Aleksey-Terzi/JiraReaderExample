import { Report } from "../../mongo/report";

export interface ReportIssueModel {
    issueId: string;
    issueKey: string;
    summary: string;
    status?: string;
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

export async function getReport(releaseVersion: string) {
    const r = await Report.findOne({ releaseVersion });
    return r as ReportModel;
}

export async function saveReport(model: ReportModel) {
    await Report.findOneAndUpdate({
        releaseVersion: model.releaseVersion
    }, model, {
        upsert: true
    });
}

export async function deleteAll() {
    await Report.collection.drop();
}