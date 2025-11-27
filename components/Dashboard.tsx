import React, { useMemo } from 'react';
import { Asset } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DashboardProps {
  assets: Asset[];
}

const COLORS = ['#0ea5e9', '#22c55e', '#eab308', '#f43f5e', '#8b5cf6', '#64748b'];

const Dashboard: React.FC<DashboardProps> = ({ assets }) => {
  const totalValue = useMemo(() => {
    return assets.reduce((sum, asset) => {
        // 使用 currentPrice 或 avgPrice 計算市值
        const price = asset.currentPrice > 0 ? asset.currentPrice : asset.avgPrice;
        return sum + (price * asset.quantity);
    }, 0);
  }, [assets]);

  const chartData = useMemo(() => {
    return assets.map(asset => ({
      name: asset.symbol,
      value: (asset.currentPrice > 0 ? asset.currentPrice : asset.avgPrice) * asset.quantity
    })).filter(item => item.value > 0);
  }, [assets]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* 總資產卡片 */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-center items-center md:items-start">
        <h3 className="text-slate-500 font-medium mb-2">總資產估值 (USD)</h3>
        <div className="text-4xl font-bold text-slate-800">
          ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="mt-4 text-sm text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded">
          +2.4% (模擬日漲跌)
        </div>
      </div>

      {/* 資產圓餅圖 */}
      <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
        <h3 className="text-slate-700 font-bold mb-4">資產配置分佈</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => `$${value.toLocaleString()}`}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="middle" align="right" layout="vertical" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
