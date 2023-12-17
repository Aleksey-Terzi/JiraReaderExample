import { TempoWorklog } from "./tempoWorklog";

export interface TempoReader {
    readWorklogs(issueIds: string[]): Promise<TempoWorklog[]>;
}