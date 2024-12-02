import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Split Bunny",
        short_name: "Split Bunny",
        description: "Split Bunny is an app that helps you split bills with your friends.",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        share_target: {
            action: "/",
            method: "POST",
            enctype: "multipart/form-data",
            params: {
                title: "title",
                text: "text",
                url: "url",
                files: [
                    {
                        name: "file",
                        accept: ["image/*"],
                    },
                ],
            },
        },
        icons: [
            {
                src: "/icon-192x192.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/icon-512x512.png",
                sizes: "512x512",
                type: "image/png",
            },
        ],
    }
}
