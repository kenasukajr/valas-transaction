import httpProxy from 'http-proxy';

const proxy = httpProxy.createProxyServer();

export const config = {
  api: {
    bodyParser: false,
  },
};

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export default function handler(req, res) {
  // Modify the target URL based on the request path
  const target = BACKEND_URL;

  return new Promise((resolve, reject) => {
    proxy.web(req, res, { target }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
