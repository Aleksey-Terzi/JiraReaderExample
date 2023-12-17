import { TempoWorklog } from "../common/tempoWorklog";
import { TempoWorklogSearchData } from "./tempoWorklogSearchData";
import { TempoReader } from "../common/tempoReader";
import { requestHelper } from "../../helpers/requestHelper";
import { TEMPO_API_BASE_URL } from "../../settings";

const REQUEST_URL_WORKLOGS_SEARCH = 'worklogs/search';

export class TempoReaderApi implements TempoReader {
    private readonly headers: HeadersInit;

    constructor (private readonly apiKey: string) {
        this.headers = this.createHeaders();
    }

    async readWorklogs(issueIds: string[]) {
        const url = TempoReaderApi.getUrl(REQUEST_URL_WORKLOGS_SEARCH);

        let result: TempoWorklog[] = [];
        let offset = 0;
        let next: string | undefined;

        do {
            const data = await requestHelper.request<TempoWorklogSearchData>(url, {
                method: "POST",
                headers: this.headers,
                body: JSON.stringify({
                    issueIds
                })
            }, {
                offset: offset.toString()
            });

            result = result.concat(data.results);

            offset += data.results.length;
            next = data.metadata.next;
        } while (next);

        return result;
    }

    private createHeaders() {
        return {
            "Authorization": `Bearer ${this.apiKey}`,
            "Accept": "application/json",
            "Content-Type": "application/json"
        };
    }

    private static getUrl(requestUrl: string) {
        return `${TEMPO_API_BASE_URL}/${requestUrl}`
    }
}