import http from "http";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import { JiraReader } from "./jira/common/jiraReader";
import { TempoReader } from "./tempo/common/tempoReader";
import { ReportController } from "./routes/reportController";
import { EMBEDDED_REACT_APP, PORT } from "./settings";
import { getAuthController } from "./routes/authController";
import { authenticate } from "./middleware/authenticate";
import { validateUser } from "./middleware/validateUser";
import path from "path";

export function startServer(jiraReader: JiraReader, tempoReader: TempoReader) {
    const app = express();

    if (!EMBEDDED_REACT_APP) {
        app.use(cors({
            origin: "http://localhost:3000"
        }));
    }

    app.use(morgan("combined"));
    app.use(express.json());

    app.use(authenticate());

    app.use("/api/reports", validateUser(), new ReportController(jiraReader, tempoReader).getController());
    app.use("/api/auth", getAuthController());

    if (EMBEDDED_REACT_APP) {
        app.use(express.static("public"));
        app.get('*', (_, res) => res.sendFile(path.resolve("public", "index.html")));
        console.log("React routing is initialized...");
    } else {
        app.use((_, res) => {
            res.status(404).json({
                error: "Not Found"
            });
        });
    }

    app.use((err: any, _0: Request, res: Response, _1: NextFunction) => {
        console.error(err);
        res.status(500).json({
            error: "Server Error"                
        });
    });

    const server = http.createServer(app);

    server.listen(PORT, () => {
        console.log(`Listening port ${PORT}...`);
    });
}