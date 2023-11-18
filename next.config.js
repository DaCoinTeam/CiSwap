/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true
    },
    rewrites : async () => {
        return [
            {
                source: "/api1/:path*",
                // eslint-disable-next-line no-undef
                destination: "http://localhost:3001/api/:path*"
            }
        ]
    }
}

// eslint-disable-next-line no-undef
module.exports = nextConfig
