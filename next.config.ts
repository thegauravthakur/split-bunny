// import BundleAnalyzer from "@next/bundle-analyzer"
import withSerwistInit from "@serwist/next"
import type { NextConfig } from "next"

// const withBundleAnalyzer = BundleAnalyzer()

const withSerwist = withSerwistInit({
    swSrc: "src/app/sw.ts",
    swDest: "public/sw.js",
    additionalPrecacheEntries: [{ url: "/~offline", revision: crypto.randomUUID() }],
})

const nextConfig: NextConfig = {
    cacheComponents: true,
    // Use webpack for builds (Serwist doesn't support Turbopack yet)
    // https://github.com/serwist/serwist/issues/54
    turbopack: {},
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

export default withSerwist(nextConfig)
