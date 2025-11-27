import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 載入環境變數
  // 使用 '.' 作為路徑以避免 TypeScript 在某些環境下報錯
  const env = loadEnv(mode, '.', '');
  
  return {
    plugins: [react()],
    // 關鍵設定：使用相對路徑 './'，這樣無論部署在哪個子目錄，資源路徑都正確
    base: './', 
    define: {
      // 解決程式碼中使用 process.env.API_KEY 的問題
      // 讓 Vite 在打包時將環境變數 "燒錄" 進去
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      // 確保其他 process.env 參照不會報錯
      'process.env': {}
    }
  };
});