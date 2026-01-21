import { API_URL } from '../config';

// api call to login
export async function login(username, password) {
    const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-type' : 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Login Failed');
    }

    return data;
}

// api call to register a new user
export async function register(username, password) {
    const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-type' : 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Registration Failed');
    }

    return data;
}
