import fs from "fs/promises";
import { JiraReaderApi } from "./jira/api/jiraReaderApi";
import { TempoReaderApi } from "./tempo/api/tempoReaderApi";
import { JiraIssue } from "./jira/common/jiraIssue";
import { JIRA_API_USERNAME, JIRA_API_PASSWORD, TEMPO_API_TOKEN, MOCK_JIRA_ISSUES, MOCK_JIRA_USERS, MOCK_TEMPO_WORKLOGS, MOCK_JIRA_VERSIONS, JIRA_PROJECT, MOCK_DEV_REPORT } from "./settings";
import { DevReportBuilder } from "./reports/devReportBuilder";
import { JiraReaderMock } from "./jira/mock/jiraReaderMock";
import { TempoReaderMock } from "./tempo/mock/tempoReaderMock";

export async function createMockData() {
    const jiraReader = new JiraReaderApi(JIRA_API_USERNAME, JIRA_API_PASSWORD);
    const tempoReader = new TempoReaderApi(TEMPO_API_TOKEN);

    try {
        const issues = await readJiraIssues(jiraReader);
        console.log("Mocked issues:", issues.length);

        const users = await readJiraUsers(jiraReader);
        console.log("Mocked users:", users.length);

        const version = await readJiraVersions(jiraReader);
        console.log("Mocked versions:", version.length);

        const worklogs = await readWorklogs(tempoReader, issues);
        console.log("Mocked worklogs:", worklogs.length);

        console.log("Mock creation is DONE");
    } catch (e) {
        const err = e as Error;
        console.error(err.message);
    }

    await buildReport();
}

async function buildReport() {
    const jiraReader = new JiraReaderMock(MOCK_JIRA_USERS, MOCK_JIRA_ISSUES, MOCK_JIRA_VERSIONS);
    const tempoReader = new TempoReaderMock(MOCK_TEMPO_WORKLOGS);
    const report = await new DevReportBuilder(jiraReader, tempoReader).buildDevPerformanceReport("23.6");

    await fs.writeFile(MOCK_DEV_REPORT, JSON.stringify(report, null, 4), { encoding: "utf-8" });
}

async function readJiraIssues(jiraReader: JiraReaderApi) {
    const issues = await jiraReader.readIssues("23.6");

    await fs.writeFile(MOCK_JIRA_ISSUES, JSON.stringify(issues, null, 4), { encoding: "utf-8" });

    return issues;
}

async function readJiraUsers(jiraReader: JiraReaderApi) {
    const users = await jiraReader.readAllUsers();

    await fs.writeFile(MOCK_JIRA_USERS, JSON.stringify(users, null, 4), { encoding: "utf-8" });

    return users;
}

async function readJiraVersions(jiraReader: JiraReaderApi) {
    const versions = await jiraReader.readVersions(JIRA_PROJECT);

    await fs.writeFile(MOCK_JIRA_VERSIONS, JSON.stringify(versions, null, 4), { encoding: "utf-8" });

    return versions;
}

async function readWorklogs(tempoReader: TempoReaderApi, issues: JiraIssue[]) {
    const issueIds = issues.map(x => x.id);
    const worklogs = await tempoReader.readWorklogs(issueIds);

    await fs.writeFile(MOCK_TEMPO_WORKLOGS, JSON.stringify(worklogs, null, 4), { encoding: "utf-8" });

    return worklogs;
}