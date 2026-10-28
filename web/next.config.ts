import type { NextConfig } from 'next';

// The CAP backend (npm start in the repo root) serves OData on 4004.
// Proxying it keeps the browser on one origin, so no CORS setup is needed in development.
const CAP_URL = process.env.CAP_URL ?? 'http://localhost:4004';

const config: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [{ source: '/odata/:path*', destination: `${CAP_URL}/odata/:path*` }];
  },
};

export default config;
