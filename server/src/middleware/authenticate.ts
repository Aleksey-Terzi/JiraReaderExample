import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { JWT_KEY } from "../settings";
import { AuthenticatedRequest } from "../models/authentication/authenticatedRequest";
import { JwtTokenPayload } from "../models/authentication/jwtTokenPayload";
import { AuthUser } from "../models/authentication/authUser";

export function authenticate() {
    return async function authenticateInternal(req: Request, _: Response, next: NextFunction) {
        const authenticatedRequest = req as AuthenticatedRequest;

        try {
            authenticatedRequest.user = await parseHeader(req.headers.authorization);
        } catch (e) {
            authenticatedRequest.user = undefined;
        }

        authenticatedRequest.isAuthenticated = !!authenticatedRequest.user;

        next();
    }
}

async function parseHeader(authorization?: string) {
    return new Promise<AuthUser | undefined>((resolve, reject) => {
        if (!authorization) {
            return resolve(undefined);
        }
    
        const parts = authorization.split(" ");
        if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
            return resolve(undefined);
        }
    
        const token = parts[1];
        
        jwt.verify(token, JWT_KEY, { complete: false }, (err, decoded) => {
            if (err) {
                return reject(err);
            }

            const name = (decoded as JwtTokenPayload).username;
            return resolve({
                name
            });
        });
    });
}