// 輔助函式：安全取得環境變數
// 支援 Vite (import.meta.env) 與 一般環境 (process.env)

export const getEnv = (key: string): string | undefined => {
  // 1. 優先嘗試 Vite 的 import.meta.env
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
       // @ts-ignore
      return import.meta.env[key];
    }
  } catch (e) {
    // 忽略錯誤
  }

  // 2. 嘗試 process.env (這會由 Vite define plugin 注入或 Node 環境提供)
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch (e) {
    // 忽略錯誤
  }

  return undefined;
};

// 檢查是否擁有真實模式所需的金鑰
export const hasRealModeKeys = (): boolean => {
  const finnhubKey = getEnv('VITE_FINNHUB_API_KEY');
  // 注意：在 vite.config.ts 中我們 define 了 'process.env.API_KEY'
  // 所以這裡直接讀取 process.env.API_KEY 是安全的
  const geminiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : undefined;
  
  // 只要有其中一個 key，我們就視為有能力開啟部分真實功能
  return !!(finnhubKey || geminiKey);
};