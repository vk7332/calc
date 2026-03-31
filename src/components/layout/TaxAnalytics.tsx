import { useMemo } from 'react';
import { useHistory } from '@/context/HistoryContext';
import { BarChart, Users } from 'lucide-react';

export const TaxAnalytics = () => {
    const { clients } = useHistory();

    const stats = useMemo(() => {
        if (clients.length === 0) return null;

        // Income Bracket Logic
        const brackets = {
            '0-7L': 0,
            '7-15L': 0,
            '15-30L': 0,
            '30L+': 0
        };

        let totalPotentialSavings = 0;
        let newRegimeCount = 0;

        clients.forEach(client => {
            const income = client.totalIncome;
            if (income <= 700000) brackets['0-7L']++;
            else if (income <= 1500000) brackets['7-15L']++;
            else if (income <= 3000000) brackets['15-30L']++;
            else brackets['30L+']++;

            if (client.taxRegime === 'new') newRegimeCount++;
            totalPotentialSavings += client.auditReport?.savings || 0;
        });

        return { brackets, totalPotentialSavings, newRegimeCount, total: clients.length };
    }, [clients]);

    if (!stats) {
        return (
            <div className="flex flex-col items-center justify-center h-64 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <Users className="text-slate-300 mb-2" size={48} />
                <p className="text-slate-500 font-medium">No client data available for analytics yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Top Level KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-lg shadow-blue-200">
                    <p className="text-blue-100 text-[10px] font-bold uppercase tracking-wider mb-1">Total Audits</p>
                    <h3 className="text-3xl font-bold">{stats.total}</h3>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Total Client Savings</p>
                    <h3 className="text-3xl font-bold text-green-600">₹{stats.totalPotentialSavings.toLocaleString()}</h3>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">New Regime Adoption</p>
                    <h3 className="text-3xl font-bold text-slate-800">{Math.round((stats.newRegimeCount / stats.total) * 100)}%</h3>
                </div>
            </div>

            {/* Income Bracket Distribution */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <BarChart size={18} className="text-blue-600" /> Client Income Brackets
                </h4>
                <div className="space-y-4">
                    {Object.entries(stats.brackets).map(([range, count]) => (
                        <div key={range}>
                            <div className="flex justify-between text-xs font-bold mb-1">
                                <span className="text-slate-600">{range}</span>
                                <span className="text-slate-400">{count} Clients</span>
                            </div>
                            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                <div
                                    className="bg-blue-500 h-full transition-all duration-1000"
                                    style={{ width: `${(count / stats.total) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};