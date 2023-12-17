import { ReportIssueModel } from "../../../api/models/reportModel";
import { DevSummary } from "./devSummary";

export interface DevData {
    summary: DevSummary;
    records: ReportIssueModel[];
}