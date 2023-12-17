import { Router } from "express";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_HOURS, JWT_KEY } from "../settings";
import { JwtTokenPayload } from "../models/authentication/jwtTokenPayload";
import { getUser, hasUsers, saveUser } from "../models/data/userModel";
import { AuthenticatedRequest } from "../models/authentication/authenticatedRequest";
import { createHash } from "crypto";

function getPasswordHash(password?: string) {
    return password
        ? createHash("md5").update(password).digest("hex")
        : undefined;
}

export function getAuthController() {
    const router = Router();

    router.get("/has-users", async (_, res, next) => {
        try {
            const hasUsersValue = await hasUsers();
            return res.json({
                hasUsers: hasUsersValue
            });
        } catch (e) {
            next (e);
        }
    });

    router.post("/login", async (req, res, next) => {
        const { username, password } = req.body;

        try {
            const user = await getUser(username);
            const passwordHash = getPasswordHash(password);
         
            if (!user || user.passwordHash !== passwordHash) {
                return res.status(401).send({
                    error: "Unauthorized"
                });
            }
        } catch (e) {
            return next(e);
        }

        const payload: JwtTokenPayload = {
            username
        };
        
        const options = {
            expiresIn: `${JWT_EXPIRES_HOURS}h`
        };

        jwt.sign(payload, JWT_KEY, options, (err, token) => {
            if (err) {
                return next(err);
            }

            return res.json({
                token
            });    
        });
    });

    router.post("/register", async (req, res, next) => {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                error: "Empty username or password"
            });
        }

        const authenticatedRequest = req as AuthenticatedRequest;

        if (!authenticatedRequest.isAuthenticated && await hasUsers()) {
            return res.status(401).send({
                error: "Unauthorized"
            });
        }

        try {
            await saveUser({
                name: username,
                passwordHash: getPasswordHash(password)!
            });

            return res.status(201).json({
                username
            });
        } catch (e) {
            next(e);
        }
    });

    return router;
}