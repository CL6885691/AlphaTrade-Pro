import React, { useState, useEffect } from 'react';
import { hasRealModeKeys } from './services/envService';
import { portfolioService } from './services/portfolioService';
import { DEFAULT_SYMBOL } from './constants';
import { Asset } from './types';

// Components
import TradingView from './components/TradingView';
import Dashboard from './components/Dashboard';
import AnalysisPanel from './components/AnalysisPanel';
import TradePanel from './components/TradePanel';
import AssetManager from './components/AssetManager';
import EducationPanel from './components/EducationPanel';

const App: React.FC = () => {
  const [currentSymbol, setCurrentSymbol] = useState<string>(DEFAULT_SYMBOL);
  const [tempSymbol, setTempSymbol] = useState<string>(DEFAULT_SYMBOL);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isRealMode] = useState<boolean>(hasRealModeKeys());

  const refreshAssets = async () => {
    const data = await portfolioService.getAssets();
    setAssets(data);
  };

  useEffect(() => {
    refreshAssets();
  }, []);

  const handleSymbolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempSymbol.trim()) {
      setCurrentSymbol(tempSymbol.toUpperCase());
    }
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              α
            </div>
            <h1 className="text-xl font-bold text-slate-800 hidden sm:block">AlphaTrade Pro</h1>
          </div>

          <div className="flex items-center space-x-4">
            <form onSubmit={handleSymbolSubmit} className="relative">
              <input
                type="text"
                value={tempSymbol}
                onChange={(e) => setTempSymbol(e.target.value)}
                placeholder="輸入代號 (e.g. TSLA)"
                className="w-40 sm:w-64 pl-4 pr-10 py-1.5 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button 
                type="submit"
                className="absolute right-1 top-1 bottom-1 p-1 bg-white rounded-full shadow-sm hover:text-blue-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
            </form>

            <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
              isRealMode ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isRealMode ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
              {isRealMode ? '真實模式 (Real)' : '模擬模式 (Mock)'}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* 資產儀表板 */}
        <Dashboard assets={assets} />

        {/* 記帳工具 */}
        <AssetManager onUpdate={refreshAssets} />

        {/* 主要工作區 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* 左側：行情圖表 (佔 8 格) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="h-[500px]">
              <TradingView symbol={currentSymbol} />
            </div>
            
            {/* AI 分析面板 */}
            <div className="min-h-[250px]">
               <AnalysisPanel symbol={currentSymbol} />
            </div>
          </div>

          {/* 右側：交易面板 (佔 4 格) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
             <div className="flex-1 min-h-[600px]">
                <TradePanel currentSymbol={currentSymbol} onTradeComplete={refreshAssets} />
             </div>
          </div>
        </div>

        {/* 底部：教學區域 */}
        <EducationPanel />

      </main>

      <footer className="bg-slate-800 text-slate-400 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p>&copy; 2024 AlphaTrade Pro. All rights reserved.</p>
          <p className="mt-2 text-xs text-slate-500">
             本系統僅供模擬與教育用途，不構成任何真實投資建議。<br/>
             {isRealMode ? "目前連接至真實市場 API。" : "目前運行於模擬資料模式。"}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
