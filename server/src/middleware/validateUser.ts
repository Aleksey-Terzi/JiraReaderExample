import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "../models/authentication/authenticatedRequest";

export function validateUser() {
    return function validateUserInternal(req: Request, res: Response, next: NextFunction) {
        const authenticatedRequest = req as AuthenticatedRequest;

        if (!authenticatedRequest.isAuthenticated) {
            return res.status(401).send({
                error: "Unauthorized"
            });
        }

        next();
    }
}