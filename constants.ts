import { CandleData, Asset, Transaction, TradeType } from './types';

// 預設股票代號
export const DEFAULT_SYMBOL = 'AAPL';

// 模擬的 K 線資料產生器
export const generateMockCandles = (days: number = 30): CandleData[] => {
  const data: CandleData[] = [];
  let price = 150;
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const volatility = price * 0.02;
    const change = (Math.random() - 0.5) * volatility;
    
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    const volume = Math.floor(Math.random() * 1000000) + 500000;
    
    data.push({
      time: date.getTime(),
      dateStr: date.toISOString().split('T')[0],
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume
    });
    
    price = close;
  }
  return data;
};

// 模擬的資產資料
export const MOCK_ASSETS: Asset[] = [
  { id: '1', symbol: 'USD', name: '現金 (USD)', quantity: 50000, avgPrice: 1, currentPrice: 1, type: 'CASH' },
  { id: '2', symbol: 'AAPL', name: 'Apple Inc.', quantity: 150, avgPrice: 145.50, currentPrice: 178.35, type: 'STOCK' },
  { id: '3', symbol: 'TSLA', name: 'Tesla Inc.', quantity: 50, avgPrice: 210.00, currentPrice: 245.60, type: 'STOCK' },
  { id: '4', symbol: 'BTC', name: 'Bitcoin', quantity: 0.5, avgPrice: 35000, currentPrice: 42000, type: 'CRYPTO' },
];

// 模擬的交易紀錄
export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', symbol: 'AAPL', type: TradeType.BUY, price: 145.50, quantity: 100, timestamp: Date.now() - 86400000 * 10, total: 14550 },
  { id: 't2', symbol: 'TSLA', type: TradeType.BUY, price: 210.00, quantity: 50, timestamp: Date.now() - 86400000 * 5, total: 10500 },
  { id: 't3', symbol: 'AAPL', type: TradeType.BUY, price: 150.00, quantity: 50, timestamp: Date.now() - 86400000 * 2, total: 7500 },
];

// 模擬的 AI 分析回應
export const MOCK_AI_RESPONSE = `
根據最近的市場數據分析，${DEFAULT_SYMBOL} 展現出強勁的上升趨勢。

**總結：**
目前的股價位於移動平均線之上，且成交量穩定放大，顯示市場信心充足。基本面來看，該公司最近的季度財報超出預期，特別是在服務營收方面有顯著增長。

**投資建議：**
短期內建議「持有」或「逢低買入」。若股價回測支撐位，是加碼的好時機。長期投資者應關注下個季度的產品發布會。請注意，科技股波動較大，建議設定止損點位。
`;

// 教學內容
export const EDUCATION_CONTENT = [
  {
    title: "K線圖基礎 (Candlestick)",
    content: "K線圖由「實體」和「影線」組成。實體代表開盤價與收盤價的範圍，影線代表最高與最低價。紅色通常代表下跌(收盤 < 開盤)，綠色代表上漲(收盤 > 開盤)。"
  },
  {
    title: "成交量 (Volume) 的意義",
    content: "成交量代表在特定時間內的交易總數。價格上漲配合成交量放大，通常代表趨勢強勁；價格上漲但成交量萎縮，可能代表上漲動力不足。"
  },
  {
    title: "移動平均線 (MA)",
    content: "MA 是過去一段時間的平均價格連線。常見有 5日、20日、60日線。當短均線向上穿過長均線(黃金交叉)，通常視為買進訊號。"
  }
];
