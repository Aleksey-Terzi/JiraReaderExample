import { JiraReader } from "../jira/common/jiraReader";
import { JiraUser } from "../jira/common/jiraUser";
import { TempoReader } from "../tempo/common/tempoReader";
import { createDevJiraIssues } from "./devReportHelper";
import { DevJiraIssue } from "./devJiraIssue";
import { DevJiraUser } from "./devJiraUser";
import { ReportIssueModel } from "../models/data/reportModel";

interface Participant {
    accountId: string;
    workTimeSeconds: number;
}

export class DevReportBuilder {
    private users?: JiraUser[];
    private devIssues?: DevJiraIssue[];
    private result?: ReportIssueModel[];

    constructor (private jiraReader: JiraReader, private tempoReader: TempoReader) {
    }

    async buildDevPerformanceReport(releaseVersion: string) {
        await this.readData(releaseVersion);

        this.result = [];

        for (const devIssue of this.devIssues!) {
            if (!devIssue.estimateSeconds) {
                continue;
            }

            if (!devIssue.children?.length) {
                this.addIssueWithoutChildren(devIssue);
            } else {
                this.addIssueWithChildren(devIssue);
            }
        }

        return this.result;
    }

    private async readData(releaseVersion: string) {
        const issues = await this.jiraReader.readIssues(releaseVersion);
        const issueIds = issues.map(x => x.id);
        const worklogs = await this.tempoReader.readWorklogs(issueIds);

        worklogs.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

        this.devIssues = createDevJiraIssues(issues, worklogs);

        this.users = await this.jiraReader.readAllUsers();
    }

    private addIssueWithChildren(parentIssue: DevJiraIssue) {
        const parentDevs = parentIssue.users?.filter(x => x.isDev) || [];
        const childDevs = parentIssue.children!.flatMap(c => c.users?.filter(u => u.isDev) || []);
        const allDevs = parentDevs.concat(childDevs);

        if (!allDevs.length) {
            return;
        }

        const participants = this.getParticipants(allDevs);
        const workTimeSeconds = allDevs.reduce((prev, u) => prev + u.workTimeSeconds, 0);
        const childKeys = parentIssue.children!.map(x => x.key);
        const childrenEstimateSeconds = parentIssue.children!.reduce((prev, issue) => prev + (issue.estimateSeconds || 0), 0);
        const estimateSeconds = parentIssue.estimateSeconds || childrenEstimateSeconds;

        this.addResult(parentIssue, participants, workTimeSeconds, estimateSeconds, childKeys);
    }

    private addIssueWithoutChildren(reportIssue: DevJiraIssue) {
        if (!reportIssue.users?.length) {
            return;
        }

        const devs = reportIssue.users.filter(x => x.isDev);
        const workTimeSeconds = devs.reduce((prev, user) => prev + user.workTimeSeconds, 0);

        if (workTimeSeconds) {
            const participants = this.getParticipants(devs);
            this.addResult(reportIssue, participants, workTimeSeconds, reportIssue.estimateSeconds!);
        }
    }

    private addResult(
        reportIssue: DevJiraIssue,
        participants: Participant[],
        workTimeSeconds: number,
        estimateSeconds: number,
        childKeys?: string[],
        )
    {
        const participantsWithNames = participants.map(p => {
            const name = this.users!.find(x => x.accountId === p.accountId)?.displayName ?? `Unknown_${p.accountId}`;
            const percent = Math.round(100 * p.workTimeSeconds / workTimeSeconds);

            return {
                name,
                workTimeSeconds: p.workTimeSeconds,
                percent
            };
        });

        this.result!.push({
            issueId: reportIssue.id,
            issueKey: reportIssue.key,
            summary: reportIssue.summary,
            status: reportIssue.status,
            participants: participantsWithNames,
            childKeys,
            estimateSeconds: estimateSeconds,
            workTimeSeconds
        });
    }

    private getParticipants(users: DevJiraUser[]) {
        const participants: Participant[] = [];
        for (const user of users) {
            let workTime = participants.find(x => x.accountId === user.accountId);
            if (!workTime) {
                participants.push(workTime = {
                    accountId: user.accountId,
                    workTimeSeconds: 0
                });
            }
            workTime.workTimeSeconds += user.workTimeSeconds;
        }

        participants.sort((a, b) => b.workTimeSeconds - a.workTimeSeconds);

        return participants;
    }
}