import React, { useState } from 'react';
import { useHistory } from '@/context/HistoryContext';
import { Search, Trash2, Receipt, Clock, BookOpen } from 'lucide-react';

export const HistorySidebar: React.FC<{ collapsed?: boolean, onNavigate?: (page: string) => void }> = ({ collapsed, onNavigate }) => {
    const { filteredClients, searchQuery, setSearchQuery, deleteRecord, clearAll } = useHistory();

    const menuItems = [
        { id: 'database', label: 'Dashboard', icon: '📊', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40' },
        { id: 'analytics', label: 'Analytics', icon: '📈', color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/40' },
        { id: 'settings', label: 'Settings', icon: '⚙️', color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/40' },
        { id: 'help', label: 'Help / FAQ', icon: '❓', color: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/40' },
        { id: 'about', label: 'About', icon: 'ℹ️', color: 'bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900/40' },
        { id: 'share', label: 'Share App', icon: '🔗', color: 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-cyan-900/40', action: () => {
            if (navigator.share) {
                navigator.share({
                    title: 'VKCalc.in – India Tax Suite',
                    text: 'Try VKCalc.in for CA-grade tax tools, calculators, and analytics!',
                    url: 'https://vkcalc.in'
                });
            } else {
                window.open('https://vkcalc.in', '_blank');
            }
        }},
        { id: 'call', label: 'Call Support', icon: '📞', color: 'bg-lime-50 dark:bg-lime-900/20 text-lime-700 dark:text-lime-300 hover:bg-lime-100 dark:hover:bg-lime-900/40', action: () => window.open('tel:+917018064385') },
        { id: 'whatsapp', label: 'WhatsApp', icon: '📱', color: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40', action: () => window.open('https://wa.me/917018064385', '_blank') },
        { id: 'email', label: 'Email', icon: '✉️', color: 'bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-pink-900/40', action: () => window.open('mailto:vkcalc.in@gmail.com', '_blank') },
        { id: 'feedback', label: 'Feedback', icon: '💬', color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40' }
    ];

    if (collapsed) {
        return (
            <aside className="flex flex-col items-center py-6 gap-4 h-full bg-white dark:bg-slate-900 transition-all duration-300 overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => item.action ? item.action() : (onNavigate && onNavigate(item.id))}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl text-lg transition-all shadow-sm hover:shadow-md ${item.color.split(' ').slice(0, 2).join(' ')}`}
                        title={item.label}
                    >
                        {item.icon}
                    </button>
                ))}
                <div className="w-8 h-px bg-slate-100 dark:bg-slate-800 my-2" />
                <div className="relative group">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm hover:shadow-md transition-all">
                        <Clock size={20} />
                    </div>
                </div>
                {/* AdSense/Amazon Placeholder */}
                <div className="mt-auto mb-6 w-10 h-32 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center justify-center text-[10px] text-slate-400 border border-dashed border-slate-200 dark:border-slate-700 font-bold uppercase tracking-widest [writing-mode:vertical-lr] rotate-180 shadow-inner">
                    Promotion
                </div>
            </aside>
        );
    }

    return (
        <aside className="h-full bg-white dark:bg-slate-900 flex flex-col transition-colors duration-300 overflow-hidden">
            {/* Audit Portal Menu Items */}
            <div className="p-4 space-y-2 border-b border-slate-100 dark:border-slate-800">
                <div className="grid grid-cols-1 gap-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => item.action ? item.action() : (onNavigate && onNavigate(item.id))}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm hover:shadow-md ${item.color}`}
                        >
                            <span className="text-base">{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2">
                        <Clock size={16} className="text-blue-600" />
                        Recent Audits
                    </h2>
                    {filteredClients.length > 0 && (
                        <button
                            onClick={clearAll}
                            className="text-[10px] font-bold text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors uppercase tracking-widest"
                        >
                            <Trash2 size={12} /> CLEAR
                        </button>
                    )}
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
                    <input
                        type="text"
                        placeholder="Search Name or PAN..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-transparent border focus:border-blue-500 focus:bg-white dark:focus:bg-slate-700 rounded-xl text-xs font-medium transition-all outline-none shadow-inner"
                    />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {filteredClients.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-slate-400 dark:text-slate-600">
                        <Receipt size={32} strokeWidth={1.5} className="mb-2 opacity-20" />
                        <p className="text-[11px] italic text-center font-medium">No history found</p>
                    </div>
                ) : (
                    filteredClients.map((client) => (
                        <div
                            key={client.id}
                            className="group bg-white dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all cursor-pointer relative"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm shadow-sm">
                                        {client.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate w-40">{client.name}</h3>
                                        <p className="text-[10px] text-slate-400 font-mono font-medium tracking-tight uppercase">{client.pan || 'NO PAN'}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); deleteRecord(client.id); }}
                                    className="p-1.5 text-slate-300 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                            <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50 dark:border-slate-800">
                                <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded uppercase tracking-tighter">
                                    AY {client.assessmentYear}
                                </span>
                                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-500">
                                    ₹{client.taxLiability.toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {/* AdSense/Amazon Placeholder */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                <div className="w-full h-28 bg-amber-50 dark:bg-amber-900/10 border-2 border-dashed border-amber-200 dark:border-amber-900/30 rounded-2xl flex flex-col items-center justify-center text-xs text-amber-700 dark:text-amber-500 font-bold shadow-inner">
                    Featured Promotion<br />
                    <span className="text-[10px] text-amber-500/70 font-medium">(Premium Taxation Resources)</span>
                </div>
            </div>
        </aside>
    );
};
