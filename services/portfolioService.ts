import { getEnv } from './envService';
import { Asset, Transaction, TradeType } from '../types';
import { MOCK_ASSETS, MOCK_TRANSACTIONS } from '../constants';

const FIREBASE_CONFIG_STRING = getEnv('VITE_FIREBASE_CONFIG_STRING');

// 這裡我們使用簡單的 In-Memory + LocalStorage 實作來模擬資料庫
// 若要實作真正的 Firestore，需引入 firebase/app 和 firebase/firestore
// 但為了確保單檔預覽不崩潰，我們在此層做抽象化

class PortfolioService {
  private assets: Asset[] = [];
  private transactions: Transaction[] = [];
  private isRealMode: boolean = false;

  constructor() {
    this.isRealMode = !!FIREBASE_CONFIG_STRING;
    this.loadInitialData();
  }

  private loadInitialData() {
    // 優先從 LocalStorage 讀取，模擬持久化
    const savedAssets = localStorage.getItem('apt_assets');
    const savedTx = localStorage.getItem('apt_transactions');

    if (savedAssets) {
      this.assets = JSON.parse(savedAssets);
    } else {
      this.assets = [...MOCK_ASSETS];
    }

    if (savedTx) {
      this.transactions = JSON.parse(savedTx);
    } else {
      this.transactions = [...MOCK_TRANSACTIONS];
    }
    
    if (this.isRealMode) {
        console.log("Firebase Config Detected. In a full production build, this would connect to Firestore.");
        // 在此範例中，即使有 Config，為了確保預覽穩定，我們暫時還是使用 LocalStorage 邏輯，
        // 但標記為 Real Mode 以示區別。
    }
  }

  private save() {
    localStorage.setItem('apt_assets', JSON.stringify(this.assets));
    localStorage.setItem('apt_transactions', JSON.stringify(this.transactions));
  }

  async getAssets(): Promise<Asset[]> {
    // 模擬網路延遲
    await new Promise(r => setTimeout(r, 300));
    return this.assets;
  }

  async getTransactions(): Promise<Transaction[]> {
    await new Promise(r => setTimeout(r, 300));
    return this.transactions.sort((a, b) => b.timestamp - a.timestamp);
  }

  async addAsset(asset: Asset): Promise<void> {
    await new Promise(r => setTimeout(r, 500));
    this.assets.push({ ...asset, id: Date.now().toString() });
    this.save();
  }

  async executeTrade(symbol: string, type: TradeType, price: number, quantity: number): Promise<void> {
    await new Promise(r => setTimeout(r, 800));
    
    const total = price * quantity;
    const existingAsset = this.assets.find(a => a.symbol === symbol && a.type === 'STOCK');
    const cashAsset = this.assets.find(a => a.type === 'CASH');

    // 1. 處理現金
    if (cashAsset) {
        if (type === TradeType.BUY) {
            cashAsset.quantity -= total; // 買入扣錢
        } else {
            cashAsset.quantity += total; // 賣出加錢
        }
    }

    // 2. 處理股票資產
    if (type === TradeType.BUY) {
        if (existingAsset) {
            // 計算新平均成本
            const oldTotalCost = existingAsset.avgPrice * existingAsset.quantity;
            const newTotalCost = oldTotalCost + total;
            const newQuantity = existingAsset.quantity + quantity;
            existingAsset.avgPrice = newTotalCost / newQuantity;
            existingAsset.quantity = newQuantity;
        } else {
            this.assets.push({
                id: Date.now().toString(),
                symbol,
                name: symbol, // 簡化名稱
                quantity,
                avgPrice: price,
                currentPrice: price,
                type: 'STOCK'
            });
        }
    } else {
        // SELL
        if (existingAsset) {
            existingAsset.quantity -= quantity;
            if (existingAsset.quantity <= 0) {
                // 移除資產
                this.assets = this.assets.filter(a => a.id !== existingAsset.id);
            }
        }
    }

    // 3. 紀錄交易
    this.transactions.unshift({
        id: `tx_${Date.now()}`,
        symbol,
        type,
        price,
        quantity,
        total,
        timestamp: Date.now()
    });

    this.save();
  }
  
  // 根據歷史交易給予簡單建議 (模擬 AI 對投資組合的看法)
  async getPortfolioAdvice(): Promise<string> {
      await new Promise(r => setTimeout(r, 1000));
      const txCount = this.transactions.length;
      if (txCount < 5) {
          return "您的交易紀錄尚少。建議：新手應先少量多單，觀察市場波動，切勿單筆重押。";
      }
      
      const buyCount = this.transactions.filter(t => t.type === TradeType.BUY).length;
      if (buyCount / txCount > 0.8) {
          return "您目前的策略偏向「只買不賣」。建議：適時檢視獲利部位，可考慮部分停利以降低風險。";
      }
      
      return "您的交易頻率適中。建議：持續保持紀律，定期檢視資產配置比例，避免單一產業曝險過高。";
  }
}

export const portfolioService = new PortfolioService();
