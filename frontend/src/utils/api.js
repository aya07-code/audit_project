const BASE = 'http://127.0.0.1:8000/api';

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
    const xsrfToken = await getCSRFToken();

    console.log('Sending request to:', `${BASE}${path}`);
    console.log('With body:', body);
    console.log('XSRF Token:', xsrfToken);
    
    const res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-XSRF-TOKEN': decodeURIComponent(xsrfToken || '')
      },
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
      headers: {
        'Accept': 'application/json'
      }
    });
    return res;
  } catch (e) {
    console.error('API error:', e);
    throw e;
  }
}