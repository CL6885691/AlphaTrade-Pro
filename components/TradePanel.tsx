import React, { useState, useEffect } from 'react';
import { portfolioService } from '../services/portfolioService';
import { fetchQuote } from '../services/marketService';
import { TradeType, Transaction } from '../types';

interface TradePanelProps {
  currentSymbol: string;
  onTradeComplete: () => void; // 通知父層更新資產
}

const TradePanel: React.FC<TradePanelProps> = ({ currentSymbol, onTradeComplete }) => {
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [quoting, setQuoting] = useState(false);
  const [history, setHistory] = useState<Transaction[]>([]);
  const [advice, setAdvice] = useState<string>('');

  // 載入歷史紀錄
  useEffect(() => {
    loadHistory();
  }, []);

  // 當 symbol 改變，重置價格
  useEffect(() => {
    setPrice(0);
  }, [currentSymbol]);

  const loadHistory = async () => {
    const txs = await portfolioService.getTransactions();
    setHistory(txs);
    const adv = await portfolioService.getPortfolioAdvice();
    setAdvice(adv);
  };

  const handleQuote = async () => {
    setQuoting(true);
    const quote = await fetchQuote(currentSymbol);
    setPrice(quote);
    setQuoting(false);
  };

  const handleTrade = async (type: TradeType) => {
    if (price <= 0) {
      alert('請先進行詢價');
      return;
    }
    if (quantity <= 0) {
        alert('股數必須大於 0');
        return;
    }

    if(!window.confirm(`確認要以 $${price} ${type === TradeType.BUY ? '買入' : '賣出'} ${quantity} 股 ${currentSymbol}?`)) {
        return;
    }

    setLoading(true);
    await portfolioService.executeTrade(currentSymbol, type, price, quantity);
    await loadHistory();
    onTradeComplete(); // Refresh Dashboard
    setLoading(false);
    alert('交易成功！');
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full flex flex-col">
      <h2 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">下單交易台</h2>
      
      {/* 詢價與輸入區 */}
      <div className="space-y-4 mb-6">
        <div>
           <label className="block text-sm font-medium text-slate-600 mb-1">交易標的</label>
           <div className="font-mono text-lg font-bold text-slate-800 bg-slate-50 p-2 rounded border border-slate-200">
             {currentSymbol}
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">股數</label>
                <input 
                    type="number" 
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>
            <div>
                 <label className="block text-sm font-medium text-slate-600 mb-1">現價 (USD)</label>
                 <div className="relative">
                    <input 
                        type="number" 
                        value={price}
                        readOnly
                        className="w-full p-2 border border-slate-300 rounded bg-slate-50 text-slate-700 font-mono"
                    />
                    <button 
                        onClick={handleQuote}
                        disabled={quoting}
                        className="absolute right-1 top-1 bottom-1 px-3 bg-blue-100 text-blue-700 text-xs font-bold rounded hover:bg-blue-200 disabled:opacity-50"
                    >
                        {quoting ? '...' : '詢價'}
                    </button>
                 </div>
            </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-2">
            <button
                onClick={() => handleTrade(TradeType.BUY)}
                disabled={loading || price === 0}
                className="w-full py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 shadow-md shadow-emerald-200 disabled:opacity-50 disabled:shadow-none transition-all"
            >
                {loading ? '處理中...' : '買入 Buy'}
            </button>
            <button
                onClick={() => handleTrade(TradeType.SELL)}
                disabled={loading || price === 0}
                className="w-full py-3 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 shadow-md shadow-rose-200 disabled:opacity-50 disabled:shadow-none transition-all"
            >
                {loading ? '處理中...' : '賣出 Sell'}
            </button>
        </div>
      </div>

      {/* 交易常識與建議 */}
      <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 mb-6">
          <h3 className="text-amber-800 font-bold text-sm mb-1 flex items-center">
             <span className="mr-1">💡</span> 投資顧問建議
          </h3>
          <p className="text-amber-900 text-xs leading-relaxed">
              {advice || "載入建議中..."}
          </p>
      </div>

      {/* 歷史紀錄 */}
      <div className="flex-1 overflow-hidden flex flex-col">
         <h3 className="text-sm font-bold text-slate-500 mb-2">近期交易紀錄</h3>
         <div className="flex-1 overflow-y-auto">
             <table className="w-full text-sm text-left">
                 <thead className="text-xs text-slate-400 uppercase bg-slate-50 sticky top-0">
                     <tr>
                         <th className="px-3 py-2">時間</th>
                         <th className="px-3 py-2">標的</th>
                         <th className="px-3 py-2">買/賣</th>
                         <th className="px-3 py-2 text-right">成交價</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                     {history.map(tx => (
                         <tr key={tx.id} className="hover:bg-slate-50">
                             <td className="px-3 py-2 text-slate-500 text-xs">
                                 {new Date(tx.timestamp).toLocaleDateString()}
                             </td>
                             <td className="px-3 py-2 font-medium">{tx.symbol}</td>
                             <td className="px-3 py-2">
                                 <span className={`px-2 py-0.5 rounded text-xs font-bold ${tx.type === TradeType.BUY ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                     {tx.type === TradeType.BUY ? '買' : '賣'}
                                 </span>
                             </td>
                             <td className="px-3 py-2 text-right font-mono text-slate-600">
                                 ${tx.price}
                             </td>
                         </tr>
                     ))}
                     {history.length === 0 && (
                         <tr>
                             <td colSpan={4} className="text-center py-4 text-slate-400">尚無交易資料</td>
                         </tr>
                     )}
                 </tbody>
             </table>
         </div>
      </div>
    </div>
  );
};

export default TradePanel;
