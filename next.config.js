/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "loremflickr.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.kibrispdr.org",
        port: "",
        pathname: "/**",
      },
    ],
    domains: [
        `${process.env.S3_UPLOAD_BUCKET}.s3.amazonaws.com`,
        `${process.env.S3_UPLOAD_BUCKET}.s3.${process.env.S3_UPLOAD_REGION}.amazonaws.com`,
    ]
  },
};

module.exports = nextConfig;
