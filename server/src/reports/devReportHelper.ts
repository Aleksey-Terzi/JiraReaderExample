import { JiraIssue } from "../jira/common/jiraIssue";
import { JIRA_DEV_USERS } from "../settings";
import { TempoWorklog } from "../tempo/common/tempoWorklog";
import { DevJiraIssue } from "./devJiraIssue";

const DEV_USERS = new Set<string>(JIRA_DEV_USERS.split(","));

export function createDevJiraIssues(jiraIssues: JiraIssue[], worklogs: TempoWorklog[]) {
    const map = new Map<string, DevJiraIssue>();

    for (const jiraIssue of jiraIssues) {
        map.set(jiraIssue.id, {
            id: jiraIssue.id,
            parentId: jiraIssue.fields.parent?.id,
            key: jiraIssue.key,
            summary: jiraIssue.fields.summary,
            status: jiraIssue.fields.status?.name,
            estimateSeconds: jiraIssue.fields.timeoriginalestimate,
            aggregateEstimateSeconds: jiraIssue.fields.aggregatetimeoriginalestimate
        });
    }

    const list: DevJiraIssue[] = [];

    map.forEach(reportIssue => {
        if (!reportIssue.parentId) {
            list.push(reportIssue);
            return;
        }

        let parent = map.get(reportIssue.parentId);
        if (!parent) {
            list.push(reportIssue);
            return;
        }

        if (!parent.children) {
            parent.children = [];
        }

        parent.children.push(reportIssue);
    });

    attachIssueUsers(map, worklogs);

    return list;
}

function attachIssueUsers(reportIssues: Map<string, DevJiraIssue>, worklogs: TempoWorklog[]) {
    for (const worklog of worklogs) {
        const reportIssue = reportIssues.get(String(worklog.issue.id));
        if (!reportIssue) {
            throw new Error(`The issue id = '${worklog.issue.id}' is not found`);
        }

        if (!reportIssue.users) {
            reportIssue.users = [];
        }

        let user = reportIssue.users.find(x => x.accountId === worklog.author.accountId);
        if (!user) {
            reportIssue.users.push(user = {
                accountId: worklog.author.accountId,
                isDev: DEV_USERS.has(worklog.author.accountId),
                firstLogCreatedAt: new Date(worklog.createdAt),
                workTimeSeconds: 0
            });
        }

        user.workTimeSeconds += worklog.timeSpentSeconds;
    }
}