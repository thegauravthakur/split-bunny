// import BundleAnalyzer from "@next/bundle-analyzer"
import type { NextConfig } from "next"

// const withBundleAnalyzer = BundleAnalyzer()

const nextConfig: NextConfig = {
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
