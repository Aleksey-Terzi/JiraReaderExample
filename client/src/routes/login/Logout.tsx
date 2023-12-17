import { Navigate } from "react-router-dom";
import { clearUser } from "../../helpers/userHelper";

export function Logout() {
    clearUser();

    return (
        <Navigate to="/login" />
    );
}