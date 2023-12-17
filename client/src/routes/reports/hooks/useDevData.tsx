import { useMemo } from "react";
import { ReportIssueModel } from "../../../api/models/reportModel";
import { DevData } from "../models/devData";

export function useDevData(report? : ReportIssueModel[]) {
    const data = useMemo<DevData | undefined>(() => {
        if (!report) {
            return undefined;
        }

        const summary = report.reduce((prev, cur) => {
            prev.totalCount++;
            prev.estimateSeconds += cur.estimateSeconds;
            prev.workTimeSeconds += cur.workTimeSeconds;

            if (cur.estimateSeconds - cur.workTimeSeconds < 0) {
                prev.underestimatedCount++;
            }

            return prev;
        }, {
            totalCount: 0,
            underestimatedCount: 0,
            estimateSeconds: 0,
            workTimeSeconds: 0
        });

        const records = report.sort((a, b) => {
            const overtime1 = a.estimateSeconds - a.workTimeSeconds;
            const overtime2 = b.estimateSeconds - b.workTimeSeconds;
            return overtime1 - overtime2;
        });

        return {
            summary,
            records
        }
    }, [report]);

    return data;
}