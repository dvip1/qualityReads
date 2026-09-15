/** @type {import('next').NextConfig} */
const nextConfig = {
    // Emits .next/standalone: a self-contained server with only the traced
    // node_modules, which is what the Docker runner stage ships.
    output: 'standalone',

    // Keep these out of the webpack bundle. The mongodb driver has optional
    // native requires (kerberos, mongodb-client-encryption, aws4, snappy, socks)
    // that webpack cannot resolve; output tracing still copies the real packages
    // into .next/standalone.
    serverExternalPackages: ['mongodb', 'ioredis'],

    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                port: '',
                pathname: '/**',
            }
        ]
    }
};

export default nextConfig;
