/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // 🚫 Ignora todos os erros do ESLint durante o build na Vercel
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
