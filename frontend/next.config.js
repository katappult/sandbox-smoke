/** @type {import('next').NextConfig} */
const nextConfig = {
   async headers() {
    return [
      {
        source: "/api/(.*)",
        // Headers
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
            
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/blog",
        destination: "/blog/fr",
        permanent: true,
      },
    ];
  },

  reactStrictMode: false,
  transpilePackages: [
    "antd",
    "rc-util",
    "@ant-design/icons",
    "@ant-design/icons-svg",
    "rc-pagination",
    "rc-picker",
    "rc-tree",
    "rc-table",
    "rc-input"
  ],
}

module.exports = nextConfig
