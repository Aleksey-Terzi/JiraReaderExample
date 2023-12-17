import { URLSearchParams } from "url";

interface FetchError {
    error: string;
}

async function request<T>(url: string, options: RequestInit, params?: Record<string, string>) {
    if (params) {
        url += `?${new URLSearchParams(params).toString()}`;
    }

    const response = await fetch(url, options);

    const json = await response.json();

    if (!response.ok) {
        const error = (json as FetchError).error;
        throw new Error(`HTTP error. Status: ${response.status}. ${error}`);
    }

    // await new Promise((resolve) => setTimeout(resolve, 5000));

    return json as T;
}

export const requestHelper = {
    request
};