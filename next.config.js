/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // Type errors fail the build — keep CI honest.
    ignoreBuildErrors: false,
  },
  async redirects() {
    return [
      // Case studies moved from /projects to /work
      { source: '/projects', destination: '/work', permanent: true },
      { source: '/projects/:slug', destination: '/work/:slug', permanent: true },
      // Blog became Insights
      { source: '/blog', destination: '/insights', permanent: true },
      { source: '/blog/:slug', destination: '/insights/:slug', permanent: true },
    ];
  },
};

module.exports = nextConfig;
