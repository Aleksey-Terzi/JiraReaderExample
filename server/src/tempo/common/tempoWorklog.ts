export interface TempoWorklog {
    tempoWorklogId: number;
    issue: {
        id: number;
    },
    timeSpentSeconds: number;
    billableSeconds: number;
    startDate: string;
    startTime: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    author: {
        accountId: string;
    }
}