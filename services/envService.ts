// 輔助函式：安全取得環境變數
// 支援 Vite (import.meta.env) 與 一般環境 (process.env)

export const getEnv = (key: string): string | undefined => {
  try {
    // 優先嘗試 Vite 的 import.meta.env
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
       // @ts-ignore
      return import.meta.env[key];
    }
  } catch (e) {
    // 忽略錯誤
  }

  try {
    // 嘗試 process.env
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
  const geminiKey = process.env.API_KEY; // Gemini 必須使用 process.env.API_KEY
  
  // 只要有其中一個 key，我們就視為有能力開啟部分真實功能
  return !!(finnhubKey || geminiKey);
};
