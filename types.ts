// 交易方向枚舉
export enum TradeType {
  BUY = 'BUY',
  SELL = 'SELL'
}

// K線資料結構
export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  dateStr: string;
}

// 資產結構
export interface Asset {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  type: 'STOCK' | 'CASH' | 'CRYPTO' | 'OTHER';
}

// 交易紀錄結構
export interface Transaction {
  id: string;
  symbol: string;
  type: TradeType;
  price: number;
  quantity: number;
  timestamp: number;
  total: number;
}

// AI 分析結果結構
export interface AIAnalysisResult {
  symbol: string;
  summary: string;
  advice: string;
  timestamp: number;
}

// 應用程式模式
export enum AppMode {
  MOCK = 'MOCK', // 模擬模式 (樣品屋)
  REAL = 'REAL'  // 真實模式 (真房子)
}
