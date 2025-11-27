import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    // 關鍵修正：使用相對路徑 './' 解決 GitHub Pages 子目錄導致的 404 白屏問題
    base: './', 
    define: {
      // 安全地注入 API KEY，避免覆寫整個 process.env
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});