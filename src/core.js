const dev = 'https://dewbk.vercel.app';
// 31-10-23
// const dev = 'https://jagoopakistan.com';

// const dev = 'http://localhost:5000';
// const dev = 'https://dev610.sidat.digital';
export const baseUrl = window.location.hostname.split(':')[0] === 'localhost' ? dev : '';
