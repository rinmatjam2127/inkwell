const TOKEN_KEY = "inkwell_access_token";
export function saveToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}
export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}
export function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
}

export function saveUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
} 

export function getUser() {
    const user = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
}

export function clearUser() {
    localStorage.removeItem(USER_KEY);
}