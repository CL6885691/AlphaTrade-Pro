import React, { useState, useEffect } from 'react';
import { 
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { fetchCandleData } from '../services/marketService';
import { CandleData } from '../types';

interface TradingViewProps {
  symbol: string;
}

const TradingView: React.FC<TradingViewProps> = ({ symbol }) => {
  const [data, setData] = useState<CandleData[]>([]);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState<'1D' | '1M' | '1Y'>('1M');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // 根據 range 決定 days 參數 (簡化邏輯)
      const days = range === '1D' ? 1 : range === '1M' ? 30 : 365;
      const resolution = range === '1D' ? '15' : 'D'; // 1D 用 15分K，其他用日K
      
      const candles = await fetchCandleData(symbol, resolution, days);
      setData(candles);
      setLoading(false);
    };

    loadData();
  }, [symbol, range]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">{symbol} 行情走勢</h2>
          <p className="text-sm text-slate-500">K線與成交量分析</p>
        </div>
        <div className="flex space-x-2">
          {['1D', '1M', '1Y'].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r as any)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                range === r 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 w-full min-h-[350px] relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="dateStr" 
              tick={{ fontSize: 12, fill: '#64748b' }} 
              axisLine={false}
              tickLine={false}
              minTickGap={30}
            />
            <YAxis 
              yAxisId="price"
              domain={['auto', 'auto']}
              orientation="right"
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              yAxisId="volume"
              orientation="left"
              tick={false}
              axisLine={false}
              tickLine={false}
              domain={[0, 'dataMax * 3']} // 讓成交量Bar只佔底部
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              labelStyle={{ color: '#64748b', marginBottom: '0.5rem' }}
            />
            
            {/* 成交量 */}
            <Bar yAxisId="volume" dataKey="volume" fill="#cbd5e1" barSize={20} opacity={0.5} name="成交量" />
            
            {/* 價格走勢 (使用 Line 代表趨勢，因為 Recharts 畫 K 棒較複雜，為求穩定顯示) */}
            <Line 
              yAxisId="price" 
              type="monotone" 
              dataKey="close" 
              stroke="#2563eb" 
              strokeWidth={2} 
              dot={false}
              activeDot={{ r: 6 }}
              name="收盤價"
            />
            
            {/* 這裡我們可以用兩個 Line 來模擬 Bollinger Bands 或 High/Low 範圍，但保持簡單專業即可 */}
            <Line 
               yAxisId="price" 
               type="monotone" 
               dataKey="open" 
               stroke="transparent" 
               dot={false} 
               activeDot={false}
               strokeWidth={0}
               name="開盤價" // 僅為了 Tooltip 顯示
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TradingView;
