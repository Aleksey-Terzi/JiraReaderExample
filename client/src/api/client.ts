import { ResultModel } from "./models/reportModel";
import { ReleaseListModel } from "./models/releaseListModel";
import { router } from "../routes/Routes";
import { getUserToken, setUser } from "../helpers/userHelper";
import { ApiError } from "./models/apiError";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const REQUEST_URL_LOGIN = "auth/login";
const REQUEST_URL_REGISTER = "auth/register";
const REQUEST_URL_HASUSERS = "auth/has-users";
const REQUEST_URL_DEV_PERFORMANCE_REPORT = "reports/dev";
const REQUEST_URL_VERSIONS = "reports/versions";

interface FetchError {
    error: string;
}

async function hasUsers() {
    const result = await get<{ hasUsers: boolean }>(getUrl(REQUEST_URL_HASUSERS));
    return result.hasUsers;
}

async function login(username: string, password: string) {
    const body = {
        username,
        password
    };
    
    const result = await post<{ token: string }>(getUrl(REQUEST_URL_LOGIN), body);

    setUser(username, result.token);

    return result.token;
}

async function register(username: string, password: string) {
    const body = {
        username,
        password
    };
    
    await post(getUrl(REQUEST_URL_REGISTER), body);
}

async function releaseList(refresh: boolean) {
    const refreshParam = refresh ? "?refresh=1" : undefined;
    return await get<ReleaseListModel>(getUrl(REQUEST_URL_VERSIONS, refreshParam));
}

async function buildDevPerformanceReport(releaseVersion: string, refresh: boolean) {
    const refreshParam = refresh ? "?refresh=1" : undefined;
    return await get<ResultModel>(getUrl(REQUEST_URL_DEV_PERFORMANCE_REPORT, releaseVersion, refreshParam));
}

async function post<T>(url: string, body:unknown) {
    const token = getUserToken();

    return await request<T>(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
}

async function get<T>(url: string) {
    const token = getUserToken();

    return await request<T>(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
        }      
    });
}

async function request<T>(url: string, options: RequestInit) {
    const response = await fetch(url, options);
    const json = await response.json();

    if (response.status === 401) {
        router.navigate("/login");
    }

    if (!response.ok) {
        const error = (json as FetchError).error;
        throw new ApiError(response.status, error);
    }

    // await new Promise((resolve) => setTimeout(resolve, 5000));

    return json as T;
}

function getUrl(requestUrl: string, ...parts: (string | undefined)[]) {
    let url = `${BASE_URL}/${requestUrl}`;

    for (let i = 0; i < parts.length; i++) {
        if (parts[i]) {
            url += `/${parts[i]}`;
        }
    }

    return url;
}

export const Client = {
    hasUsers,
    login,
    register,
    releaseList,
    buildDevPerformanceReport
}