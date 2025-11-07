const BASE = 'http://127.0.0.1:8000/api';

export function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token
    ? { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
    : { 'Accept': 'application/json' };
}


export async function getCSRFToken() {
  try {
    await fetch('http://127.0.0.1:8000/sanctum/csrf-cookie', {
      credentials: 'include'
    });
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];
  } catch (e) {
    console.error('CSRF fetch error:', e);
    throw new Error('Failed to fetch CSRF token');
  }
}

export async function apiPost(path, body) {
  try {
    console.log('Sending request to:', `${BASE}${path}`);
    console.log('With body:', body);

    const headers = {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    };

    const res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      credentials: 'include',
      headers,
      body: JSON.stringify(body)
    });

    console.log('Response status:', res.status);
    const responseData = await res.clone().json().catch(() => ({}));
    console.log('Response data:', responseData);

    return res;
  } catch (e) {
    console.error('API error:', e);
    throw e;
  }
}


export async function apiGet(path) {
  try {
    const res = await fetch(`${BASE}${path}`, {
      credentials: 'include',
      headers: getAuthHeaders(),
    });
    return res;
  } catch (e) {
    console.error('API error:', e);
    throw e;
  }
}