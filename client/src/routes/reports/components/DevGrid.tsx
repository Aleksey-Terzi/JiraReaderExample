import { ReportIssueModel } from "../../../api/models/reportModel";
import { DevGridSummary } from "./DevGridSummary";
import { DevGridRow } from "./DevGridRow";
import { useDevData } from "../hooks/useDevData";

interface Props {
    loading: boolean;
    jiraIssueUrl?: string;
    report?: ReportIssueModel[];
}

export function DevGrid({ loading, jiraIssueUrl, report }: Props) {
    const data = useDevData(report);

    return (
        <table className="table table-striped">
            <thead>
                <tr>
                    <th>Issue #</th>
                    <th>Summary</th>
                    <th>Status</th>
                    <th className="text-center">Estimate</th>
                    <th className="text-center">Spent Time</th>
                    <th>Developers</th>
                </tr>
            </thead>
            <tbody>
                {!loading && data?.records && data.records.map(issue => (
                    <DevGridRow jiraIssueUrl={jiraIssueUrl} issue={issue} />
                ))}
            </tbody>
            {!loading && data?.summary && <DevGridSummary summary={data.summary} />}
        </table>
    );
}