import { useCallback, useEffect, useState } from "react"
import { Alert, Form, Spinner, Stack } from "react-bootstrap";
import { DevGrid } from "./components/DevGrid";
import { ReleaseListModel } from "../../api/models/releaseListModel";
import { ReportModel } from "../../api/models/reportModel";
import { Client } from "../../api/client";
import { LoadingButton } from "../../components/LoadingButton";

export function Dev() {
    const [loadingReleaseList, setLoadingReleaseList] = useState(true);
    const [loadingReport, setLoadingReport] = useState(false);
    const [error, setError] = useState<string>();
    const [releaseList, setReleaselist] = useState<ReleaseListModel>();
    const [releaseVersion, setReleaseVersion] = useState<string>();
    const [jiraIssueUrl, setJiraIssueUrl] = useState<string>();
    const [report, setReport] = useState<ReportModel>();

    const loadReleases = useCallback(async (refresh: boolean) => {
        setLoadingReleaseList(true);

        try {
            const releaseList = await Client.releaseList(refresh);
            setReleaselist(releaseList);
        }
        catch (e) {
            const err = e as Error;
            setError(err.message);
        }

        setLoadingReleaseList(false);
    }, []);

    const loadReport = useCallback(async (releaseVersion: string, refresh: boolean) => {
        if (!releaseVersion) {
            setReport(undefined);
            setReleaseVersion(undefined);
            return;
        }

        setLoadingReport(true);

        try {
            const result = await Client.buildDevPerformanceReport(releaseVersion, refresh);            

            setJiraIssueUrl(result.jiraIssueUrl);
            setReport(result.report);
            setReleaseVersion(releaseVersion);
        }
        catch (e) {
            const err = e as Error;
            setError(err.message);
        }

        setLoadingReport(false);
    }, []);

    useEffect(() => {
        loadReleases(false);
    }, [loadReleases]);

    return (
        <>
            {error && (
                <Alert variant="danger">
                    {error}
                </Alert>
            )}

            <Stack direction="horizontal" className="mb-3">
                <Form.Select
                    className="w-25"
                    disabled={loadingReleaseList || !releaseList || loadingReport}
                    onChange={e => loadReport(e.target.value, false)}
                >
                    <option></option>
                    {releaseList?.versions?.map(v => (
                        <option key={v.name} value={v.name}>
                            {v.name}
                        </option>
                    ))}
                </Form.Select>

                {releaseList && (
                    <div className="form-text ms-2">
                        updated
                        on {new Date(releaseList.updatedAt).toLocaleDateString("en-CA")}
                        {` at ${new Date(releaseList.updatedAt).toLocaleTimeString("en-CA")}`}
                    </div>
                )}

                <LoadingButton
                    text="Refresh"
                    loadingText="Refreshing..."
                    className="ms-2"
                    loading={loadingReleaseList}
                    disabled={loadingReport}
                    onClick={() => loadReleases(true)}
                />
            </Stack>

            {!error && (releaseVersion || loadingReport) && (
                <>
                    <Stack direction="horizontal" className="mb-3">
                        <div>
                            The report
                            {report && (
                                <>
                                    updated
                                    on {new Date(report.updatedAt).toLocaleDateString("en-CA")}
                                    {` at ${new Date(report.updatedAt).toLocaleTimeString("en-CA")}`}
                                </>
                            )}
                        </div>
                        <LoadingButton
                            text="Refresh"
                            loadingText="Refreshing..."
                            className="ms-2"
                            loading={loadingReport}
                            disabled={!releaseVersion || loadingReleaseList}
                            onClick={() => loadReport(releaseVersion!, true)}
                        />
                    </Stack>

                    <DevGrid loading={loadingReport} jiraIssueUrl={jiraIssueUrl} report={report?.issues} />

                    {loadingReport && (
                        <Stack direction="horizontal">
                            <Spinner animation="border" className="me-3" />
                            Loading...
                        </Stack>
                    )}
                </>
            )}
        </>
    )
}