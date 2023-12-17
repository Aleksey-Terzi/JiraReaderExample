import { ReportIssueModel } from "../../../api/models/reportModel";
import { convertSecondsToTime } from "../../../helpers/timeHelper";
import { DevIssueParticipants } from "./DevIssueParticipants";

interface Props {
    jiraIssueUrl?: string;
    issue: ReportIssueModel;
}

function displayChildKeys(keys?: string[]) {
    if (!keys || !keys.length) {
        return undefined;
    }

    const maxKeys = 10;
    const result: string[] = [];
    for (let i = 0; i < keys.length && i < maxKeys; i++) {
        const prefix = i > 0 ? ", ": "";
        result.push(prefix + keys[i]);
    }

    if (keys.length > maxKeys) {
        result.push(", ...");
    }

    return result;
}

export function DevGridRow({ jiraIssueUrl, issue } : Props) {
    return (
        <tr>
            <td className="text-nowrap">
                <a href={`${jiraIssueUrl}${issue.issueKey}`} target="_blank">
                    {issue.issueKey}
                </a>
            </td>
            <td>
                {issue.summary}
                {issue.childKeys && (
                    <div className="form-text">
                        {displayChildKeys(issue.childKeys)}
                    </div>
                )}
            </td>
            <td className="text-nowrap">{issue.status}</td>
            <td className="text-nowrap text-center">{convertSecondsToTime(issue.estimateSeconds)}</td>
            <td className={`text-nowrap text-center${issue.estimateSeconds - issue.workTimeSeconds < 0 ? " text-danger": ""}`}>
                {convertSecondsToTime(issue.workTimeSeconds)}
            </td>
            <td className="text-nowrap">
                <DevIssueParticipants issue={issue} />
            </td>
        </tr>
    );
}