import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages 会把站点挂在 /<repo>/ 下（例如 /xiaojiepai/）
  // 生产环境（npm run build）下设置 base，开发环境保持 /
  base: process.env.GITHUB_PAGES === 'true' ? '/xiaojiepai/' : '/',
  plugins: [react()],
})
