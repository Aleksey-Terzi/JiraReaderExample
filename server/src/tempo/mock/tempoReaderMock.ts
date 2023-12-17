import fs from "fs/promises";
import { TempoReader } from "../common/tempoReader";
import { TempoWorklog } from "../common/tempoWorklog";

export class TempoReaderMock implements TempoReader {
    constructor (private readonly worklogsFileName: string) {}

    async readWorklogs(_: string[]) {
        const text = await fs.readFile(this.worklogsFileName, { encoding: "utf-8" });
        return JSON.parse(text) as TempoWorklog[];
    }

}