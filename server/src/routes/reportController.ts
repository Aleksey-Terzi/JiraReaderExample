import { Response, Request, Router, NextFunction } from "express";
import { DevReportBuilder } from "../reports/devReportBuilder";
import { JiraReader } from "../jira/common/jiraReader";
import { TempoReader } from "../tempo/common/tempoReader";
import { getReport, saveReport } from "../models/data/reportModel";
import { JIRA_ISSUE_URL, JIRA_PROJECT } from "../settings";
import { getReleaseList, saveReleaseList } from "../models/data/releaseListModel";

export class ReportController {
    constructor (private jiraReader: JiraReader, private tempoReader: TempoReader) {
    }

    getController() {
        const router = Router();

        router.get("/dev/:releaseVersion", this.devPerformanceReport.bind(this));
        router.get("/versions", this.releases.bind(this));

        return router;
    }

    private async releases(req: Request, res: Response, next: NextFunction) {
        try {
            const refresh = req.query["refresh"];

            let releaseList = refresh !== "1" ? await getReleaseList() : undefined;
            if (releaseList) {
                return res.json(releaseList);
            }

            const versions = await this.jiraReader.readVersions(JIRA_PROJECT);

            releaseList = {
                createdAt: new Date(),
                updatedAt: new Date(),
                versions: versions.map(v => ({
                    name: v.name,
                    startDate: new Date(v.startDate)
                })).sort((a, b) => {
                    if (a.startDate < b.startDate) {
                        return 1;
                    } else if (a.startDate > b.startDate) {
                        return -1;
                    } else {
                        return 0;
                    }
                })
            };

            await saveReleaseList(releaseList);
            
            return res.json(releaseList);
        } catch (e) {
            next(e);
        }
    }

    private async devPerformanceReport(req: Request<{releaseVersion: string}>, res: Response, next: NextFunction) {
        try {
            const refresh = req.query["refresh"];
            const releaseVersion = req.params.releaseVersion;

            let report = refresh !== "1" ? await getReport(releaseVersion) : undefined;
            if (report) {
                return res.json({
                    jiraIssueUrl: JIRA_ISSUE_URL,
                    report
                });
            }

            const reportBuilder = new DevReportBuilder(this.jiraReader, this.tempoReader);
            const issues = await reportBuilder.buildDevPerformanceReport(releaseVersion);

            report = {
                releaseVersion,
                createdAt: new Date(),
                updatedAt: new Date(),
                issues
            };

            await saveReport(report);

            return res.json({
                jiraIssueUrl: JIRA_ISSUE_URL,
                report
            });
        }
        catch (e) {
            next(e);
        }
    }
}