/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        formats: ['image/avif', 'image/webp'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
                port: '',
            },
            {
                protocol: 'http',
                hostname: '**',
                port: '',
            }
        ],
        // deviceSizes : correspond aux largeurs de viewport (breakpoints Tailwind)
        deviceSizes: [375, 640, 768, 1024, 1280, 1920],
        // imageSizes : correspond aux largeurs d'images générées (doit être < deviceSizes)
        // Calculées selon votre grid : 1 col (375px), 2 cols (384px), 3 cols (341px), 4 cols (320px)
        // + marges pour les écrans Retina (2x)
        imageSizes: [320, 384, 400, 450, 500, 640, 750, 828],
        minimumCacheTTL: 60,
    },
    eslint: { ignoreDuringBuilds: true, },
    // Compression et optimisation
    compress: true,
    poweredByHeader: false,
}

module.exports = nextConfig