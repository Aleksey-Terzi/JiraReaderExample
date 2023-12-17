import { JiraIssue } from "../common/jiraIssue";

export interface JiraIssueSearchData {
    expand: string;
    startAt: number;
    maxResult: number;
    total: number;
    issues: JiraIssue[];
}