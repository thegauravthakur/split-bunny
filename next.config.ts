import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    async redirects() {
        return [
            {
                source: "/group/:group_id",
                destination: "/group/:group_id/expenses",
                permanent: false,
            },
        ]
    },
    /* config options here */
}

export default nextConfig
