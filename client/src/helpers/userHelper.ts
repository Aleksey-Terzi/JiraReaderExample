export function setUser(username: string, token: string) {
    localStorage.setItem("username", username);
    localStorage.setItem("token", token);
}

export function getUserToken() {
    return localStorage.getItem("token");
}

export function getUserName() {
    return localStorage.getItem("username");
}

export function clearUser() {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
}