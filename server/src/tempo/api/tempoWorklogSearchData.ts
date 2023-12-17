import { TempoWorklog } from "../common/tempoWorklog";

export interface TempoWorklogSearchData {
    metadata: {
        count: number;
        offset: number;
        limit: number;
        next?: string;
    };
    results: TempoWorklog[];
}