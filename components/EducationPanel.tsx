import React from 'react';
import { EDUCATION_CONTENT } from '../constants';

const EducationPanel: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mt-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">新手交易教室</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {EDUCATION_CONTENT.map((item, idx) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-lg">
                        <h3 className="font-bold text-slate-700 mb-2 text-sm">{item.title}</h3>
                        <p className="text-slate-600 text-xs leading-relaxed">
                            {item.content}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EducationPanel;
