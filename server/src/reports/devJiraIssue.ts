import { DevJiraUser } from "./devJiraUser";

export interface DevJiraIssue {
    id: string;
    parentId?: string;
    key: string;
    summary: string;
    status?: string;
    estimateSeconds?: number;
    aggregateEstimateSeconds?: number;
    children?: DevJiraIssue[];
    users?: DevJiraUser[];
}