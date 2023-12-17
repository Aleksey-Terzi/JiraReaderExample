import { JiraIssue } from "./jiraIssue";
import { JiraUser } from "./jiraUser";
import { JiraVersion } from "./jiraVersion";

export interface JiraReader {
    readIssues(releaseVersion: string): Promise<JiraIssue[]>;
    readAllUsers(): Promise<JiraUser[]>;
    readVersions(project: string): Promise<JiraVersion[]>;
}