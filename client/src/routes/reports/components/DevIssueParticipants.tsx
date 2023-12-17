import { Col, Row } from "react-bootstrap";
import { ReportIssueModel } from "../../../api/models/reportModel";
import { convertSecondsToTime } from "../../../helpers/timeHelper";

interface Props {
    issue: ReportIssueModel;
}

export function DevIssueParticipants({ issue } : Props) {
    return (
        <>
            {issue.participants.map(p => (
                <Row key={p.name}>
                    <Col lg="7" className="pe-5">
                        <b className="me-3">-</b>
                        {p.name}
                    </Col>
                    <Col lg="3" className="text-center">
                        {convertSecondsToTime(p.workTimeSeconds)}
                    </Col>
                    <Col lg="2" className="text-end">
                        {p.percent}%
                    </Col>
                </Row>
            ))}
        </>
    );
}