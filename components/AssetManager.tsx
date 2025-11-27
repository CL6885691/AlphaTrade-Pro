import React, { useState } from 'react';
import { portfolioService } from '../services/portfolioService';
import { Asset } from '../types';

interface AssetManagerProps {
    onUpdate: () => void;
}

const AssetManager: React.FC<AssetManagerProps> = ({ onUpdate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [symbol, setSymbol] = useState('');
    const [quantity, setQuantity] = useState('');
    const [cost, setCost] = useState('');
    
    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!symbol || !quantity || !cost) return;
        
        const newAsset: Asset = {
            id: '', // Service will assign
            symbol: symbol.toUpperCase(),
            name: symbol.toUpperCase(),
            quantity: Number(quantity),
            avgPrice: Number(cost),
            currentPrice: Number(cost), // Initial assumption
            type: 'STOCK'
        };
        
        await portfolioService.addAsset(newAsset);
        onUpdate();
        setSymbol('');
        setQuantity('');
        setCost('');
        setIsOpen(false);
        alert('資產已新增');
    };

    return (
        <div className="mb-6">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
                <span className="text-xl mr-1">{isOpen ? '−' : '+'}</span> 
                {isOpen ? '取消新增' : '手動記帳 / 新增場外資產'}
            </button>
            
            {isOpen && (
                <form onSubmit={handleAdd} className="mt-4 bg-slate-50 p-4 rounded-lg border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">代號</label>
                        <input 
                            required
                            type="text" 
                            placeholder="ex: NVDA"
                            value={symbol}
                            onChange={(e) => setSymbol(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">持有數量</label>
                        <input 
                            required
                            type="number" 
                            step="0.01"
                            placeholder="0"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">平均成本 (USD)</label>
                        <input 
                            required
                            type="number" 
                            step="0.01"
                            placeholder="0.00"
                            value={cost}
                            onChange={(e) => setCost(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded text-sm"
                        />
                    </div>
                    <button 
                        type="submit"
                        className="bg-slate-800 text-white py-2 px-4 rounded text-sm hover:bg-slate-900 font-bold"
                    >
                        確認新增
                    </button>
                </form>
            )}
        </div>
    );
};

export default AssetManager;
