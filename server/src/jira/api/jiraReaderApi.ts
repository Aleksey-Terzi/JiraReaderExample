import { JiraIssueSearchData } from './jiraIssueSearchData';
import { JiraIssue } from '../common/jiraIssue';
import { JiraUser } from '../common/jiraUser';
import { JiraReader } from '../common/jiraReader';
import { JiraVersion } from '../common/jiraVersion';
import { requestHelper } from '../../helpers/requestHelper';
import { JIRA_API_BASE_URL } from '../../settings';

const REQUEST_URL_ISSUE_SEARCH = 'search';
const REQUEST_URL_USERS_SEARCH = 'users';
const REQUEST_URL_PROJECT = 'project';

export class JiraReaderApi implements JiraReader {
    private readonly postHeaders: HeadersInit;
    private readonly getHeaders: HeadersInit;

    constructor (readonly username: string, readonly password: string) {
        this.postHeaders = this.createPostHeaders();
        this.getHeaders = this.createGetHeaders();
    }

    async readIssues(releaseVersion: string) {
        const issues = await this.readIssuesInternal(releaseVersion);
        const ids = issues.map(x => x.id);

        const children = await this.readIssuesInternal(undefined, ids);
        if (children.length) {
            const idsSet = new Set<string>(ids);
            for (const child of children) {
                if (!idsSet.has(child.id)) {
                    issues.push(child);
                }
            }
        }

        return issues;
    }

    private async readIssuesInternal(releaseVersion?: string, parentIds?: string[]) {
        const fields = [
            'id',
            'key',
            'summary',
            'timeoriginalestimate',
            'aggregatetimeoriginalestimate',
            'status',
            'parent',
            'assignee',
            'labels'
        ];

        let jql = "project='DEV'";
        if (releaseVersion) {
            jql += ` and sprint=${releaseVersion}`;
        }

        if (parentIds?.length) {
            const parentIdsText = parentIds?.join(", ");
            jql += ` and parent in (${parentIdsText})`;
        }

        const url = JiraReaderApi.getUrl(REQUEST_URL_ISSUE_SEARCH);

        let result: JiraIssue[] = [];
        let startAt = 0;
        let total = 0;

        do {            
            const data = await requestHelper.request<JiraIssueSearchData>(url, {
                method: "POST",
                headers: this.postHeaders,
                body: JSON.stringify({
                    startAt,
                    jql,
                    fields
                })
            });

            result = result.concat(data.issues);

            total = data.total;
            startAt += data.issues.length;
        } while (startAt < total);

        return result;
    }

    async readAllUsers() {
        const url = JiraReaderApi.getUrl(REQUEST_URL_USERS_SEARCH);

        let result: JiraUser[] = [];
        let startAt = 0;
        let readCount = 0;

        do {
            const data = await requestHelper.request<JiraUser[]>(url, {
                method: "GET",
                headers: this.getHeaders,
            }, {
                startAt: startAt.toString()
            });

            result = result.concat(data);

            readCount = data.length;
            startAt += data.length;
        } while (readCount > 0)

        return result;
    }

    async readVersions(project: string) {
        const url = JiraReaderApi.getUrl(REQUEST_URL_PROJECT) + `/${project}/versions`;

        const data = await requestHelper.request<JiraVersion[]>(url, {
            method: "GET",
            headers: this.getHeaders
        });

        return data.map(v => ({
            name: v.name,
            startDate: v.startDate
        }));
    }

    private createPostHeaders() {
        const nameAndPassword = Buffer.from(`${this.username}:${this.password}`).toString('base64');

        return {
            "Authorization": `Basic ${nameAndPassword}`,
            "Accept": "application/json",
            "Content-Type": "application/json"
        };
    }

    private createGetHeaders() {
        const nameAndPassword = Buffer.from(`${this.username}:${this.password}`).toString('base64');

        return {
            "Authorization": `Basic ${nameAndPassword}`,
            "Accept": "application/json"
        };
    }

    private static getUrl(requestUrl: string) {
        return `${JIRA_API_BASE_URL}/${requestUrl}`
    }
}