import fs from "fs/promises"
import { JiraReader } from "../common/jiraReader";
import { JiraUser } from "../common/jiraUser";
import { JiraIssue } from "../common/jiraIssue";
import { JiraVersion } from "../common/jiraVersion";

export class JiraReaderMock implements JiraReader {
    constructor (
        private readonly usersFileName: string,
        private readonly issuesFileName: string,
        private readonly versionsFileName: string,
        )
    {
    }

    async readIssues(_: string) {
        const text = await fs.readFile(this.issuesFileName, { encoding: "utf-8" });
        return JSON.parse(text) as JiraIssue[];
    }

    async readAllUsers() {
        const text = await fs.readFile(this.usersFileName, { encoding: "utf-8" });
        return JSON.parse(text) as JiraUser[];
    }

    async readVersions(project: string) {
        const text = await fs.readFile(this.versionsFileName, { encoding: "utf-8" });
        return JSON.parse(text) as JiraVersion[];
    }
}