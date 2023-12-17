import { JIRA_API_PASSWORD, JIRA_API_USERNAME, TEMPO_API_TOKEN } from './settings';
import { startServer } from "./server";
import { JiraReaderApi } from "./jira/api/jiraReaderApi";
import { TempoReaderApi } from "./tempo/api/tempoReaderApi";
import { mongoConnect } from './mongoInit';
import { getUser, saveUser } from './models/data/userModel';

// createMockData();

run();

async function run() {
    await mongoConnect();

    const existingUser = await getUser("Test");
    if (!existingUser) {
        await saveUser({
            name: "Test",
            passwordHash: "hash"
        });
    }

    // const jiraReader = new JiraReaderMock(MOCK_JIRA_USERS, MOCK_JIRA_ISSUES, MOCK_JIRA_VERSIONS);
    // const tempoReader = new TempoReaderMock(MOCK_TEMPO_WORKLOGS);
    
    const jiraReader = new JiraReaderApi(JIRA_API_USERNAME, JIRA_API_PASSWORD);
    const tempoReader = new TempoReaderApi(TEMPO_API_TOKEN);

    startServer(jiraReader, tempoReader);
}