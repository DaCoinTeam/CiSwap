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
                source: "/api/:path*",
                // eslint-disable-next-line no-undef
                destination: `${process.env.REACT_APP_SERVER_PORT}/api/:path*`
            }
        ]
    }
}

// eslint-disable-next-line no-undef
module.exports = nextConfig
