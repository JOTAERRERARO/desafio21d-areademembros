/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Ignora erros de ESLint no build da Vercel
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
