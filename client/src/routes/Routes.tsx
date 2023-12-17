import { createBrowserRouter } from "react-router-dom";
import { App } from "../App";
import { Dev } from "./reports/Dev";
import { Login } from "./login/Login";
import { Logout } from "./login/Logout";
import { Register } from "./login/Register";

export const router = createBrowserRouter([
    {
        path:"/",
        element: <App />,
        children: [
            { path: "/reports/dev", element: <Dev /> }
        ]
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/logout",
        element: <Logout />
    },
    {
        path: "/register",
        element: <Register />
    }
]);