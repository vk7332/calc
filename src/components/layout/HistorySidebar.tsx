import React from 'react';
import { useHistory } from '@/context/HistoryContext';
import { Search, Trash2, Receipt, Clock, XCircle } from 'lucide-react';

export const HistorySidebar: React.FC = () => {
    const { filteredClients, searchQuery, setSearchQuery, deleteRecord, clearAll } = useHistory();

    return (
        <aside className="fixed right-0 top-16 w-80 h-[calc(100vh-64px)] bg-slate-50 border-l border-slate-200 flex flex-col z-20 shadow-sm">
            {/* Search & Header Section */}
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

            {/* Scrollable Client List */}
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
        </aside>
    );
};