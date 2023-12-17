export interface JiraIssue {
    id: string;
    key: string;
    fields: {
        summary: string;
        timeoriginalestimate?: number;
        aggregatetimeoriginalestimate?: number;
        customfield_10020: [{
            id: number;
            name: string;
        }],
        parent?: {
            id: string;
            key: string;
        },
        assignee: {
            accountId: string;
            emailAddress: string;
            displayName: string;
        },
        status: {
            id: number;
            name: string;
        }
        labels: string[]
    } 
}