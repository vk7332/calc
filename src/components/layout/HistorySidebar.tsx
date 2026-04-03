import React, { useState } from 'react';
import { useHistory } from '@/context/HistoryContext';
import { Search, Trash2, Receipt, Clock, XCircle, BookOpen } from 'lucide-react';

export const HistorySidebar: React.FC<{ collapsed?: boolean }> = ({ collapsed }) => {
    const { filteredClients, searchQuery, setSearchQuery, deleteRecord, clearAll } = useHistory();
    const [hovered, setHovered] = useState(false);

    if (collapsed && !hovered) {
        return (
            <aside
                className="flex flex-col items-center justify-center h-full py-4 relative group"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <div className="flex flex-col items-center gap-2">
                    <div className="relative group">
                        <Clock size={28} className="text-blue-600 mb-2" />
                        <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                            Recent Audits
                        </span>
                    </div>
                    <div className="relative group">
                        <BookOpen size={24} className="text-amber-600" />
                        <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                            Taxation Books
                        </span>
                    </div>
                </div>
                {/* AdSense/Amazon Placeholder */}
                <div className="mt-8 w-10 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-[10px] text-gray-400 border border-dashed border-gray-300 rotate-90">
                    Ad Placeholder
                </div>
            </aside>
        );
    }

    if (collapsed && hovered) {
        // Show expanded menu on hover
        return (
            <aside
                className="absolute right-0 top-0 w-80 h-full bg-slate-50 border-l border-slate-200 flex flex-col z-30 shadow-lg transition-all"
                onMouseLeave={() => setHovered(false)}
            >
                {/* Full menu (same as uncollapsed) */}
                <div className="p-4 bg-white border-b border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                            <Clock size={16} className="text-blue-600" />
                            Recent Audits
                        </h2>
                        {filteredClients.length > 0 && (
                            <button
                                onClick={clearAll}
                                className="text-[10px] font-medium text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                            >
                                <XCircle size={12} /> CLEAR ALL
                            </button>
                        )}
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search Name or PAN..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent border focus:border-blue-500 focus:bg-white rounded-lg text-sm transition-all outline-none"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    {filteredClients.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                            <Receipt size={32} strokeWidth={1.5} className="mb-2 opacity-20" />
                            <p className="text-xs italic text-center">No history found for "{searchQuery}"</p>
                        </div>
                    ) : (
                        filteredClients.map((client) => (
                            <div
                                key={client.id}
                                className="group bg-white p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer relative"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
                                            {client.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-bold text-slate-800 truncate w-36">{client.name}</h3>
                                            <p className="text-[10px] text-slate-400 uppercase font-mono">{client.pan || 'NO PAN'}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); deleteRecord(client.id); }}
                                        className="p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50">
                                    <span className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                                        AY {client.assessmentYear}
                                    </span>
                                    <span className="text-xs font-bold text-emerald-600">
                                        ₹{client.taxLiability.toLocaleString('en-IN')}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                {/* AdSense/Amazon Placeholder */}
                <div className="p-4">
                    <div className="w-full h-28 bg-yellow-50 border-2 border-dashed border-yellow-300 rounded-xl flex flex-col items-center justify-center text-xs text-yellow-700 font-bold">
                        Amazon/Affiliate Ad<br />
                        <span className="text-[10px] text-yellow-500">(Promote Taxation Books)</span>
                    </div>
                </div>
            </aside>
        );
    }

    // Not collapsed: full menu
    return (
        <aside className={`fixed right-0 top-16 w-80 h-[calc(100vh-64px)] bg-slate-50 border-l border-slate-200 flex flex-col z-20 shadow-sm`}>
            <div className="p-4 bg-white border-b border-slate-200">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <Clock size={16} className="text-blue-600" />
                        Recent Audits
                    </h2>
                    {filteredClients.length > 0 && (
                        <button
                            onClick={clearAll}
                            className="text-[10px] font-medium text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                        >
                            <XCircle size={12} /> CLEAR ALL
                        </button>
                    )}
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search Name or PAN..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent border focus:border-blue-500 focus:bg-white rounded-lg text-sm transition-all outline-none"
                    />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {filteredClients.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                        <Receipt size={32} strokeWidth={1.5} className="mb-2 opacity-20" />
                        <p className="text-xs italic text-center">No history found for "{searchQuery}"</p>
                    </div>
                ) : (
                    filteredClients.map((client) => (
                        <div
                            key={client.id}
                            className="group bg-white p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer relative"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
                                        {client.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-bold text-slate-800 truncate w-36">{client.name}</h3>
                                        <p className="text-[10px] text-slate-400 uppercase font-mono">{client.pan || 'NO PAN'}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); deleteRecord(client.id); }}
                                    className="p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                            <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50">
                                <span className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                                    AY {client.assessmentYear}
                                </span>
                                <span className="text-xs font-bold text-emerald-600">
                                    ₹{client.taxLiability.toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {/* AdSense/Amazon Placeholder */}
            <div className="p-4">
                <div className="w-full h-28 bg-yellow-50 border-2 border-dashed border-yellow-300 rounded-xl flex flex-col items-center justify-center text-xs text-yellow-700 font-bold">
                    Amazon/Affiliate Ad<br />
                    <span className="text-[10px] text-yellow-500">(Promote Taxation Books)</span>
                </div>
            </div>
        </aside>
    );
};