export function decodeJwt(token: string): { sub: string; [key: string]: unknown } {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(''),
    );
    const payload = JSON.parse(jsonPayload);
    if (typeof payload.sub !== 'string') {
      throw new Error('JWT payload missing "sub" claim');
    }
    return payload;
  } catch (e) {
    throw new Error('Failed to decode JWT');
  }
}
