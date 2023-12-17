import { convertSecondsToTime } from "../../../helpers/timeHelper";
import { DevSummary } from "../models/devSummary";

interface Props {
    summary: DevSummary;
}

export function DevGridSummary({ summary }: Props) {
    return (
        <tfoot>
            <tr>
                <th colSpan={3}>
                    <div>
                        Total Issue Count: {summary.totalCount}
                    </div>
                    <div>
                        Underestimated Issues: {summary.underestimatedCount}
                    </div>
                </th>
                <th className="text-center">
                    {convertSecondsToTime(summary.estimateSeconds)}
                </th>
                <th className="text-center">
                    {convertSecondsToTime(summary.workTimeSeconds)}
                </th>
                <th className="text-end">
                    Spend Time - Estimate =
                    {` ${convertSecondsToTime(summary.workTimeSeconds - summary.estimateSeconds)}`}
                </th>
            </tr>
        </tfoot>
    );
}