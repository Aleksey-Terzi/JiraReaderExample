import { Request } from "express";
import { AuthUser } from "./authUser";

export interface AuthenticatedRequest extends Request {
    user?: AuthUser;
    isAuthenticated: boolean;
}