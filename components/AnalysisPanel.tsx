import React, { useState, useEffect } from 'react';
import { fetchMarketAnalysis } from '../services/geminiService';

interface AnalysisPanelProps {
  symbol: string;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ symbol }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // 當 symbol 改變時，自動重新分析
  useEffect(() => {
    const getAnalysis = async () => {
      setLoading(true);
      setAnalysis(''); // 清空舊資料
      const result = await fetchMarketAnalysis(symbol);
      setAnalysis(result);
      setLoading(false);
    };

    if (symbol) {
      getAnalysis();
    }
  }, [symbol]);

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl shadow-sm border border-indigo-100 h-full">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <h2 className="text-xl font-bold text-indigo-900">Gemini 智能投顧</h2>
      </div>

      <div className="prose prose-indigo max-w-none">
        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-indigo-200 rounded w-3/4"></div>
            <div className="h-4 bg-indigo-200 rounded w-full"></div>
            <div className="h-4 bg-indigo-200 rounded w-5/6"></div>
            <div className="h-20 bg-indigo-100 rounded w-full mt-4"></div>
            <p className="text-sm text-indigo-400 mt-2">AI 正在分析 {symbol} 的財報與市場情緒...</p>
          </div>
        ) : (
          <div className="whitespace-pre-line text-slate-700 leading-relaxed text-sm md:text-base">
            {analysis}
          </div>
        )}
      </div>
      
      {!loading && (
         <div className="mt-4 pt-4 border-t border-indigo-100 text-xs text-indigo-400 flex justify-between">
            <span>分析模型: Gemini 2.5 Flash</span>
            <span>僅供參考，不構成投資建議</span>
         </div>
      )}
    </div>
  );
};

export default AnalysisPanel;
