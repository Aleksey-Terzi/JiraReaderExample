import dotenv from 'dotenv-flow';

dotenv.config();

export const PORT = process.env.PORT;
export const EMBEDDED_REACT_APP = process.env.EMBEDDED_REACT_APP!.toLowerCase() === "true";
export const MONGO_URL = process.env.MONGO_URL!;
export const TEMPO_API_BASE_URL = process.env.TEMPO_API_BASE_URL!;
export const TEMPO_API_TOKEN = process.env.TEMPO_API_TOKEN!;
export const JIRA_API_BASE_URL = process.env.JIRA_API_BASE_URL!;
export const JIRA_API_USERNAME = process.env.JIRA_API_USERNAME!;
export const JIRA_API_PASSWORD = process.env.JIRA_API_PASSWORD!;
export const JIRA_PROJECT = process.env.JIRA_PROJECT!;
export const JIRA_ISSUE_URL = process.env.JIRA_ISSUE_URL!;
export const JIRA_DEV_USERS = process.env.JIRA_DEV_USERS!;
export const JWT_KEY = process.env.JWT_KEY!;
export const JWT_EXPIRES_HOURS = parseInt(process.env.JWT_EXPIRES_HOURS!);
export const MOCK_JIRA_USERS = process.env.MOCK_JIRA_USERS!;
export const MOCK_JIRA_ISSUES = process.env.MOCK_JIRA_ISSUES!;
export const MOCK_JIRA_VERSIONS = process.env.MOCK_JIRA_VERSIONS!;
export const MOCK_TEMPO_WORKLOGS = process.env.MOCK_TEMPO_WORKLOGS!;
export const MOCK_DEV_REPORT = process.env.MOCK_DEV_REPORT!;