import { getEnv } from './envService';
import { generateMockCandles } from '../constants';
import { CandleData } from '../types';

const FINNHUB_API_KEY = getEnv('VITE_FINNHUB_API_KEY');

// 取得 K 線資料 (Hybrid Mode)
export const fetchCandleData = async (symbol: string, resolution: string = 'D', days: number = 30): Promise<CandleData[]> => {
  // 1. 檢查是否為真實模式且有 Key
  if (FINNHUB_API_KEY) {
    try {
      // 計算時間戳記 (UNIX timestamp)
      const to = Math.floor(Date.now() / 1000);
      const from = to - (days * 86400); // 概抓天數
      
      const url = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.s === 'ok') {
        // 轉換 Finnhub 格式為我們的 CandleData 格式
        return data.t.map((timestamp: number, index: number) => ({
          time: timestamp * 1000,
          dateStr: new Date(timestamp * 1000).toISOString().split('T')[0],
          open: data.o[index],
          high: data.h[index],
          low: data.l[index],
          close: data.c[index],
          volume: data.v[index],
        }));
      } else {
        console.warn('Finnhub API returned no data or error, falling back to mock.');
      }
    } catch (error) {
      console.error('Failed to fetch real market data:', error);
      // 失敗時自動降級為模擬資料
    }
  }

  // 2. 模擬模式 (Mock Data)
  // 模擬網路延遲
  await new Promise(resolve => setTimeout(resolve, 600)); 
  console.info(`[MarketService] Using Mock Data for ${symbol}`);
  return generateMockCandles(days);
};

// 取得即時報價 (Hybrid Mode)
export const fetchQuote = async (symbol: string): Promise<number> => {
    if (FINNHUB_API_KEY) {
        try {
            const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();
            if (data.c) {
                return data.c; // Current price
            }
        } catch (error) {
            console.error('Failed to fetch quote:', error);
        }
    }
    
    // Mock Quote
    await new Promise(resolve => setTimeout(resolve, 400));
    const basePrice = 100 + Math.random() * 100;
    return Number(basePrice.toFixed(2));
}
