import { GoogleGenAI } from "@google/genai";
import { MOCK_AI_RESPONSE } from '../constants';

// 取得 AI 分析 (Hybrid Mode)
export const fetchMarketAnalysis = async (symbol: string): Promise<string> => {
  // 1. 真實模式
  if (process.env.API_KEY) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `
      請擔任一位專業的金融分析師。
      請針對股票代號 "${symbol}" 進行最新的市場表現分析。
      
      要求：
      1. 不要使用 Markdown 語法 (如 **bold**, # header)，請使用純文字排版，段落分明即可。
      2. 包含「總結」與「投資建議」兩個部分。
      3. 語氣專業、客觀，使用繁體中文。
      4. 字數控制在 300 字以內。
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return response.text;

    } catch (error) {
      console.error("Gemini API Error:", error);
      return "目前無法連線至 AI 分析服務，請檢查 API Key 或稍後再試。\n\n(系統自動切換顯示範本建議...)";
    }
  }

  // 2. 模擬模式
  await new Promise(resolve => setTimeout(resolve, 1500)); // 模擬思考時間
  console.info(`[GeminiService] Using Mock Response for ${symbol}`);
  
  // 簡單替換代號讓 Mock 看起來有一點點動態
  return MOCK_AI_RESPONSE.replace(/AAPL/g, symbol).replace(/\*\*/g, ''); 
};
