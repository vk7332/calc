import { useState, useEffect, useRef } from 'react';
import { useHistory } from '@/context/HistoryContext';
import { Calculator, Printer, ArrowLeft, Info, HelpCircle, Landmark, Percent, TrendingUp, Briefcase, Users, Sparkles, ChevronDown, Lightbulb, TrendingDown, Target, Zap, FileText, Save, Shield } from 'lucide-react';
import { calculateTaxITR2 } from '@/engines/TaxEngine';
import { useSettings } from '@/context/SettingsContext';
import { exportTaxReport } from '@/utils/pdfExport';

export default function AuditPortal() {
    const { settings } = useSettings();
    const { addRecord } = useHistory();
    const pageTopRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (pageTopRef.current) {
            pageTopRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    // --- Header States ---
    const [assesseeName, setAssesseeName] = useState<string>('');
    const [financialYear, setFinancialYear] = useState<string>('2026-2027');
    const [status, setStatus] = useState<string>('Individual');
    const [gender, setGender] = useState<string>('Male');
    const [isSeniorCitizen, setIsSeniorCitizen] = useState<string>('Not Senior Citizen');
    const [regime, setRegime] = useState<'old' | 'new'>('new');

    // --- Income States ---
    const [salary, setSalary] = useState<number>(0);
    const [houseProperty, setHouseProperty] = useState<number>(0);
    const [businessIncome, setBusinessIncome] = useState<number>(0);

    // Capital Gains
    const [stcgStt, setStcgStt] = useState<number>(0);
    const [stcgOthers, setStcgOthers] = useState<number>(0);
    const [ltcg12_5, setLtcg12_5] = useState<number>(0);
    const [ltcg20, setLtcg20] = useState<number>(0);

    // Other Sources
    const [otherInterest, setOtherInterest] = useState<number>(0);
    const [agriIncome, setAgriIncome] = useState<number>(0);
    const [lotteryWinnings, setLotteryWinnings] = useState<number>(0);

    // --- Deduction States ---
    const [ded80C, setDed80C] = useState<number>(0);
    const [ded80D, setDed80D] = useState<number>(0);
    const [ded80TTA, setDed80TTA] = useState<number>(0);
    const [otherDedOld, setOtherDedOld] = useState<number>(0);
    const [otherDedNew, setOtherDedNew] = useState<number>(0);

    // --- Tax Paid States ---
    const [tds, setTds] = useState<number>(0);
    const [advanceTax, setAdvanceTax] = useState<number>(0);
    const [selfAssessmentTax, setSelfAssessmentTax] = useState<number>(0);

    const [result, setResult] = useState<any>(null);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    const handleCalculate = () => {
        const totalIncome = salary + houseProperty + businessIncome + stcgStt + stcgOthers + ltcg12_5 + ltcg20 + otherInterest + lotteryWinnings;
        const totalDeductions = ded80C + ded80D + ded80TTA + (regime === 'old' ? otherDedOld : otherDedNew);

        // Map age group
        let ageGroup: 'Normal' | 'Senior' | 'Super' = 'Normal';
        if (isSeniorCitizen === 'Senior (60+)') ageGroup = 'Senior';
        if (isSeniorCitizen === 'Super Senior (80+)') ageGroup = 'Super';

        const res = calculateTaxITR2(
            totalIncome,
            lotteryWinnings,
            totalDeductions,
            settings,
            ageGroup
        );
        setResult(res);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleExportPdf = async () => {
        if (!result) return;
        setIsGeneratingPdf(true);
        try {
            await exportTaxReport(result, assesseeName || 'Valued Taxpayer', settings);
        } catch (error) {
            console.error("PDF Export failed:", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    const handleSaveAudit = async () => {
        if (!result) return;
        try {
            await addRecord({
                name: assesseeName || "Quick Client",
                pan: "",
                assessmentYear: financialYear,
                taxRegime: result.recommendedRegime,
                totalIncome: result.totalIncome,
                taxLiability: result.finalLiability,
                incomeDetails: { salary, houseProperty, businessIncome },
                deductions: { ded80C, ded80D },
                auditReport: result
            });
            alert("Audit saved successfully!");
        } catch (error) {
            console.error("Save failed:", error);
        }
    };

    // --- Dynamic Tips ---
    const getTaxTips = () => {
        if (!result) return [];
        const tips = [];
        if (result.savings > 0 && result.recommendedRegime === 'new') {
            tips.push({ icon: <Zap className="text-amber-500" />, text: `Switching to the NEW REGIME saves you ₹${result.savings.toLocaleString('en-IN')} instantly!`, type: 'action' });
        }
        if (salary > 750000) {
            tips.push({ icon: <Shield className="text-blue-500" />, text: "Income > 7.5L: Ensure you have Section 80D Health Insurance for maximum protection.", type: 'tip' });
        }
        if (ded80C < 150000 && regime === 'old') {
            tips.push({ icon: <Target className="text-emerald-500" />, text: `You can still save more tax by investing ₹${(150000 - ded80C).toLocaleString('en-IN')} in ELSS or PPF.`, type: 'tip' });
        }
        return tips;
    };

    const inputClasses = "w-full bg-slate-50 dark:bg-slate-900/80 border-2 border-slate-300 dark:border-slate-600 rounded-2xl px-6 py-5 text-lg font-black text-slate-900 dark:text-white outline-none focus:ring-8 focus:ring-blue-500/10 focus:border-blue-600 transition-all shadow-lg placeholder:text-slate-400 dark:placeholder:text-slate-500";
    const labelClasses = "block text-[12px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 group-hover:text-blue-600 transition-colors";
    const sectionHeaderClasses = "text-xl font-black text-slate-900 dark:text-white uppercase tracking-[0.3em] mb-12 pb-5 border-b-8 border-blue-600 inline-block rounded-sm";

    return (
        <div ref={pageTopRef} className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
            {/* Top Branding & Title */}
            <div className="text-center space-y-6 mb-16">
                <div className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-[11px] font-black uppercase tracking-[0.4em] shadow-sm">
                    <Sparkles className="w-5 h-5" /> Professional Taxation Suite
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Income Tax <span className="text-blue-600">Practitioner</span></h1>
                <p className="text-lg text-slate-500 dark:text-slate-400 font-bold max-w-3xl mx-auto leading-relaxed">Elite tax auditing and compliance logic for AY 2026-27. Precise, professional, and powerful.</p>
            </div>

            {/* Header Form Card */}
            <div className="bg-white dark:bg-slate-800/50 p-10 md:p-16 rounded-[4rem] border-2 border-slate-100 dark:border-slate-800 shadow-2xl shadow-blue-900/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
                    <div className="space-y-3">
                        <label className={labelClasses}><Briefcase size={14} /> Assessee Name</label>
                        <input type="text" className={inputClasses} placeholder="Client Name..." value={assesseeName} onChange={(e) => setAssesseeName(e.target.value)} />
                    </div>
                    <div className="space-y-3">
                        <label className={labelClasses}><Landmark size={14} /> Financial Year</label>
                        <div className="relative">
                            <select className={`${inputClasses} appearance-none cursor-pointer`} value={financialYear} onChange={(e) => setFinancialYear(e.target.value)}>
                                <option>2026-2027</option>
                                <option>2025-2026</option>
                                <option>2024-2025</option>
                            </select>
                            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className={labelClasses}><Info size={12} /> Status of Tax Payer</label>
                        <select className={inputClasses} value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option>Individual</option>
                            <option>HUF</option>
                            <option>Firm/LLP</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className={labelClasses}><Users size={12} /> Gender</label>
                        <select className={inputClasses} value={gender} onChange={(e) => setGender(e.target.value)}>
                            <option>Male</option>
                            <option>Female</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className={labelClasses}><HelpCircle size={12} /> Senior Citizen</label>
                        <select className={inputClasses} value={isSeniorCitizen} onChange={(e) => setIsSeniorCitizen(e.target.value)}>
                            <option>Not Senior Citizen</option>
                            <option>Senior (60+)</option>
                            <option>Super Senior (80+)</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className={labelClasses}><Percent size={12} /> Tax Regime Choice</label>
                        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                            <button onClick={() => setRegime('old')} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${regime === 'old' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Old Regime</button>
                            <button onClick={() => setRegime('new')} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${regime === 'new' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>New Regime</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Income & Deduction Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Left Column: Income */}
                <div className="space-y-10">
                    <div className="bg-white dark:bg-slate-800/50 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl">
                        <h3 className={sectionHeaderClasses}>Statement of Income</h3>

                        <div className="space-y-6">
                            <div className="group">
                                <label className={labelClasses}>Salary (After ₹75,000 Std. Deduction)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                                    <input type="number" className={`${inputClasses} pl-8`} value={salary} onChange={(e) => setSalary(Number(e.target.value))} />
                                </div>
                            </div>

                            <div className="group">
                                <label className={labelClasses}>House Property (After 30% Deduction)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                                    <input type="number" className={`${inputClasses} pl-8`} value={houseProperty} onChange={(e) => setHouseProperty(Number(e.target.value))} />
                                </div>
                            </div>

                            <div className="group">
                                <label className={labelClasses}>Business/Professional Income</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                                    <input type="number" className={`${inputClasses} pl-8`} value={businessIncome} onChange={(e) => setBusinessIncome(Number(e.target.value))} />
                                </div>
                            </div>

                            <div className="pt-6">
                                <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <TrendingUp size={14} /> Capital Gains Details
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[9px] font-black text-slate-400 uppercase block mb-2">Short Term (STT @20%)</label>
                                        <input type="number" className={inputClasses} value={stcgStt} onChange={(e) => setStcgStt(Number(e.target.value))} />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black text-slate-400 uppercase block mb-2">Short Term (Others)</label>
                                        <input type="number" className={inputClasses} value={stcgOthers} onChange={(e) => setStcgOthers(Number(e.target.value))} />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black text-slate-400 uppercase block mb-2">Long Term (@12.5%)</label>
                                        <input type="number" className={inputClasses} value={ltcg12_5} onChange={(e) => setLtcg12_5(Number(e.target.value))} />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black text-slate-400 uppercase block mb-2">Long Term (@20%)</label>
                                        <input type="number" className={inputClasses} value={ltcg20} onChange={(e) => setLtcg20(Number(e.target.value))} />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6">
                                <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-6">Other Sources</h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[9px] font-black text-slate-400 uppercase block mb-2">Interest/Dividend/Others</label>
                                        <input type="number" className={inputClasses} value={otherInterest} onChange={(e) => setOtherInterest(Number(e.target.value))} />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black text-slate-400 uppercase block mb-2">Agriculture Income</label>
                                        <input type="number" className={inputClasses} value={agriIncome} onChange={(e) => setAgriIncome(Number(e.target.value))} />
                                    </div>
                                    <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-2xl border border-red-100 dark:border-red-900/30">
                                        <label className="text-[9px] font-black text-red-600 uppercase block mb-2">Winning from Lotteries (30% Flat)</label>
                                        <input type="number" className={`${inputClasses} border-red-200 dark:border-red-800 focus:border-red-500 focus:ring-red-500/10`} value={lotteryWinnings} onChange={(e) => setLotteryWinnings(Number(e.target.value))} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Deductions & Tax Paid */}
                <div className="space-y-10">
                    <div className="bg-white dark:bg-slate-800/50 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl">
                        <h3 className={sectionHeaderClasses}>Deductions (Chapter VI-A)</h3>
                        <div className="space-y-6">
                            <div>
                                <label className={labelClasses}>Sec 80C, 80CCC, 80CCD (Max 1.5L)</label>
                                <input type="number" className={inputClasses} value={ded80C} onChange={(e) => setDed80C(Number(e.target.value))} />
                            </div>
                            <div>
                                <label className={labelClasses}>Sec 80D (Mediclaim)</label>
                                <input type="number" className={inputClasses} value={ded80D} onChange={(e) => setDed80D(Number(e.target.value))} />
                            </div>
                            <div>
                                <label className={labelClasses}>Sec 80TTA (Savings Interest)</label>
                                <input type="number" className={inputClasses} value={ded80TTA} onChange={(e) => setDed80TTA(Number(e.target.value))} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase block mb-2">Other (Old Regime)</label>
                                    <input type="number" className={inputClasses} value={otherDedOld} onChange={(e) => setOtherDedOld(Number(e.target.value))} />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase block mb-2">Other (New Regime)</label>
                                    <input type="number" className={inputClasses} value={otherDedNew} onChange={(e) => setOtherDedNew(Number(e.target.value))} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800/50 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl">
                        <h3 className={sectionHeaderClasses}>Detail of Tax Paid</h3>
                        <div className="space-y-6">
                            <div>
                                <label className={labelClasses}>Tax Deducted at Source (TDS)</label>
                                <input type="number" className={inputClasses} value={tds} onChange={(e) => setTds(Number(e.target.value))} />
                            </div>
                            <div>
                                <label className={labelClasses}>Advance Tax Paid</label>
                                <input type="number" className={inputClasses} value={advanceTax} onChange={(e) => setAdvanceTax(Number(e.target.value))} />
                            </div>
                            <div>
                                <label className={labelClasses}>Self Assessment Tax Paid</label>
                                <input type="number" className={inputClasses} value={selfAssessmentTax} onChange={(e) => setSelfAssessmentTax(Number(e.target.value))} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Actions & Results */}
            <div className="sticky bottom-8 z-30">
                <div className="bg-slate-900/90 dark:bg-black/90 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
                    <div className="flex items-center gap-4">
                        <button onClick={handleCalculate} className="px-10 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center gap-2">
                            <Calculator size={16} /> Calculate Tax
                        </button>
                        <button onClick={() => window.location.reload()} className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all">
                            <ArrowLeft size={18} />
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={handlePrint} className="px-6 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2">
                            <Printer size={16} /> Print
                        </button>
                        <button onClick={() => alert('HRA Calculator Module Loading...')} className="px-6 py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-amber-500/20">
                            HRA Calculator
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Display */}
            {result && (
                <div className="space-y-8 animate-in slide-in-from-top-8 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] text-white shadow-2xl">
                            <p className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-70">Gross Total Income</p>
                            <h4 className="text-4xl font-black tracking-tight">₹{result.totalIncome.toLocaleString('en-IN')}</h4>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Computed Tax Liability</p>
                            <h4 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">₹{(regime === 'old' ? result.oldTax : result.newTax).toLocaleString('en-IN')}</h4>
                        </div>
                        <div className="bg-emerald-500 p-8 rounded-[2.5rem] text-white shadow-2xl">
                            <p className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-70">Tax Refund / Payable</p>
                            <h4 className="text-4xl font-black tracking-tight">₹{Math.max(0, (regime === 'old' ? result.oldTax : result.newTax) - (tds + advanceTax + selfAssessmentTax)).toLocaleString('en-IN')}</h4>
                        </div>
                    </div>

                    {/* Dynamic Tax Saving Tips */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white dark:bg-slate-800/50 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl">
                            <h3 className={sectionHeaderClasses}>
                                <Lightbulb className="inline-block mr-2 text-amber-500" size={20} />
                                Smart Tax Tips
                            </h3>
                            <div className="space-y-4">
                                {getTaxTips().map((tip, i) => (
                                    <div key={i} className={`p-4 rounded-2xl border flex items-start gap-4 transition-all hover:scale-[1.02] ${tip.type === 'action' ? 'bg-amber-50 border-amber-100 dark:bg-amber-900/10 dark:border-amber-800' : 'bg-slate-50 border-slate-100 dark:bg-slate-900/50 dark:border-slate-800'}`}>
                                        <div className="mt-1">{tip.icon}</div>
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-relaxed">{tip.text}</p>
                                    </div>
                                ))}
                                {getTaxTips().length === 0 && (
                                    <p className="text-xs text-slate-400 font-medium italic text-center py-4">Your current tax plan is already optimized!</p>
                                )}
                            </div>
                        </div>

                        <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8 pb-3 border-b border-white/10 inline-block">
                                <Target className="inline-block mr-2 text-blue-400" size={18} />
                                Investment Advice
                            </h3>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recommended Actions</span>
                                    <span className="px-2 py-1 bg-blue-600 rounded text-[8px] font-black uppercase tracking-tighter">Priority</span>
                                </div>
                                <div className="space-y-3">
                                    <button onClick={handleExportPdf} disabled={isGeneratingPdf} className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                                        {isGeneratingPdf ? <Sparkles className="animate-spin" size={14} /> : <FileText size={14} />}
                                        Get Detailed Report (PDF)
                                    </button>
                                    <button onClick={handleSaveAudit} className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20">
                                        <Save size={14} /> Save to Cloud History
                                    </button>
                                </div>
                                <p className="text-[9px] text-slate-500 font-medium italic text-center">Based on AY 2026-27 Finance Act Provisions</p>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Breakdown Table */}
                    <div className="bg-white dark:bg-slate-800/50 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
                        <h3 className={sectionHeaderClasses}>Detailed Tax Breakdown (AY 2026-27)</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-slate-700">
                                        <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Particulars</th>
                                        <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Old Regime</th>
                                        <th className="py-4 text-[10px] font-black text-blue-600 uppercase tracking-widest text-right">New Regime</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                    <tr className="border-b border-slate-50 dark:border-slate-800/50">
                                        <td className="py-4">Taxable Income</td>
                                        <td className="py-4 text-right">₹{result.oldBreakdown.taxableIncome.toLocaleString('en-IN')}</td>
                                        <td className="py-4 text-right text-blue-600">₹{result.newBreakdown.taxableIncome.toLocaleString('en-IN')}</td>
                                    </tr>
                                    <tr className="border-b border-slate-50 dark:border-slate-800/50">
                                        <td className="py-4">Slab Tax</td>
                                        <td className="py-4 text-right">₹{result.oldBreakdown.slabTax.toLocaleString('en-IN')}</td>
                                        <td className="py-4 text-right">₹{result.newBreakdown.slabTax.toLocaleString('en-IN')}</td>
                                    </tr>
                                    <tr className="border-b border-slate-50 dark:border-slate-800/50">
                                        <td className="py-4">Rebate u/s 87A</td>
                                        <td className="py-4 text-right text-emerald-600">-₹{result.oldBreakdown.rebate87A.toLocaleString('en-IN')}</td>
                                        <td className="py-4 text-right text-emerald-600">-₹{result.newBreakdown.rebate87A.toLocaleString('en-IN')}</td>
                                    </tr>
                                    <tr className="border-b border-slate-50 dark:border-slate-800/50">
                                        <td className="py-4">Surcharge</td>
                                        <td className="py-4 text-right">₹{result.oldBreakdown.surcharge.toLocaleString('en-IN')}</td>
                                        <td className="py-4 text-right">₹{result.newBreakdown.surcharge.toLocaleString('en-IN')}</td>
                                    </tr>
                                    <tr className="border-b border-slate-50 dark:border-slate-800/50 text-emerald-600">
                                        <td className="py-4">Marginal Relief</td>
                                        <td className="py-4 text-right">-₹{result.oldBreakdown.marginalRelief.toLocaleString('en-IN')}</td>
                                        <td className="py-4 text-right">-₹{result.newBreakdown.marginalRelief.toLocaleString('en-IN')}</td>
                                    </tr>
                                    <tr className="border-b border-slate-50 dark:border-slate-800/50">
                                        <td className="py-4">Health & Education Cess (4%)</td>
                                        <td className="py-4 text-right">₹{result.oldBreakdown.cess.toLocaleString('en-IN')}</td>
                                        <td className="py-4 text-right">₹{result.newBreakdown.cess.toLocaleString('en-IN')}</td>
                                    </tr>
                                    <tr className="bg-slate-50 dark:bg-slate-900/50">
                                        <td className="py-4 text-slate-900 dark:text-white font-black">Final Tax Liability</td>
                                        <td className="py-4 text-right font-black">₹{result.oldBreakdown.total.toLocaleString('en-IN')}</td>
                                        <td className="py-4 text-right font-black text-blue-600">₹{result.newBreakdown.total.toLocaleString('en-IN')}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Blog / Article Section */}
            <div className="pt-20 border-t border-slate-100 dark:border-slate-800">
                <article className="prose prose-slate dark:prose-invert max-w-none">
                    <div className="bg-white dark:bg-slate-800/50 p-10 md:p-20 rounded-[4rem] border-2 border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden">
                        {/* Ambient Glows */}
                        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>

                        {/* SEO Friendly Heading */}
                        <header className="mb-20 text-center relative z-10">
                            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-[11px] font-black uppercase tracking-[0.4em] mb-10 shadow-sm">
                                <FileText size={16} /> Elite Tax Strategy • AY 2026-27
                            </div>
                            <h2 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-[1.1] mb-10">
                                The Ultimate Guide to <span className="text-blue-600">Tax Logic</span> for AY 2026-27: Decode, Save, and Prosper
                            </h2>
                            <p className="text-2xl text-slate-500 dark:text-slate-400 font-bold max-w-4xl mx-auto leading-relaxed">
                                Beyond the numbers lies a strategy. Discover how the latest Finance Act changes impact your wallet and how to navigate the New vs. Old regime dilemma like a pro.
                            </p>
                        </header>

                        {/* Article Content */}
                        <div className="space-y-16 text-slate-700 dark:text-slate-300 leading-[2] relative z-10 text-lg">
                            {/* Intro Hook Section */}
                            <section className="relative">
                                <div className="absolute -left-8 top-0 w-2 h-full bg-blue-600 rounded-full opacity-20"></div>
                                <p className="text-3xl font-black text-slate-900 dark:text-white mb-8 italic tracking-tight leading-tight">
                                    "Is it just me, or does every February feel like a high-stakes puzzle where the rules keep changing just as you’re about to win?"
                                </p>
                                <p className="mb-8 font-medium">
                                    Picture this: You’ve worked hard all year, finally landed that long-awaited promotion, or perhaps your business finally hit that sweet spot of profitability. You’re ready to celebrate. But then, a notification pings on your phone—it's a tax update. Suddenly, that feeling of accomplishment is replaced by a familiar, nagging anxiety. <em>"How much of this hard-earned money am I actually going to keep?"</em>
                                </p>
                                <p className="mb-8 font-medium">
                                    We’ve all been there. The "Tax Season" stress isn't just about the payment itself; it's about the overwhelming complexity. It feels like you need a Ph.D. in Finance just to figure out which "Regime" is your friend and which one is a silent profit-eater. But here’s the good news: For <strong>Assessment Year (AY) 2026-27</strong>, the landscape has shifted in ways that could actually put more money back in your pocket—if you know how to play the game.
                                </p>
                                <p className="font-medium">
                                    In this deep-dive, we’re stripping away the robotic jargon and the dry, legislative language. We’re going to look at the <strong>Income Tax Calculation Logic</strong> through a human lens. Whether you're a salaried professional, a freelancer, or a seasoned business owner, this guide is your roadmap to financial clarity. Let’s demystify the slabs, embrace the rebates, and find your "Tax Zen."
                                </p>
                            </section>

                            {/* Section 1: The Great Regime Debate */}
                            <section>
                                <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-8 tracking-tight flex items-center gap-4">
                                    <span className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-blue-600/20">01</span>
                                    The New vs. Old Regime: A Battle of Philosophies
                                </h3>
                                <p className="mb-6 font-medium">
                                    First things first, let’s talk about the elephant in the room: The choice between the Old and New Tax Regimes. For AY 2026-27, the government has made its preference clear—the <strong>New Tax Regime</strong> is the "Default" choice. But "Default" doesn't always mean "Best" for everyone.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
                                    <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800">
                                        <h4 className="text-xl font-black text-slate-900 dark:text-white mb-4">The Old Regime</h4>
                                        <p className="text-sm font-bold text-slate-500 mb-4">The "Saver's Path"</p>
                                        <ul className="space-y-3 text-sm font-medium">
                                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div> Allows 80C, 80D, HRA deductions</li>
                                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div> Best for home loan borrowers</li>
                                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div> Higher tax rates, more deductions</li>
                                        </ul>
                                    </div>
                                    <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-600/20">
                                        <h4 className="text-xl font-black mb-4">The New Regime</h4>
                                        <p className="text-sm font-bold opacity-80 mb-4">The "Simple Path"</p>
                                        <ul className="space-y-3 text-sm font-medium">
                                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-white rounded-full"></div> Lower tax rates across all slabs</li>
                                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-white rounded-full"></div> Standard Deduction of ₹75,000</li>
                                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-white rounded-full"></div> No need to track 80C investments</li>
                                        </ul>
                                    </div>
                                </div>
                                <p className="font-medium">
                                    Think of it like this: The Old Regime is for the meticulous planner who loves tracking every insurance premium and PPF contribution. The New Regime is for the person who wants simplicity—lower taxes upfront without the paperwork headache. For AY 2026-27, the New Regime has been further sweetened with more favorable slabs.
                                </p>
                            </section>

                            {/* Section 2: Decoding the Slabs */}
                            <section>
                                <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-8 tracking-tight flex items-center gap-4">
                                    <span className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-blue-600/20">02</span>
                                    The AY 2026-27 Slabs: Where Does Your Income Land?
                                </h3>
                                <p className="mb-8 font-medium">
                                    Numbers can be boring, but not when they represent your savings. The New Tax Regime slabs for AY 2026-27 are designed to keep more money in the hands of the middle class. Here’s the breakdown that matters:
                                </p>
                                <div className="overflow-hidden rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800 mb-10">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-900 text-white">
                                            <tr>
                                                <th className="p-6 font-black uppercase tracking-widest text-xs">Income Range</th>
                                                <th className="p-6 font-black uppercase tracking-widest text-xs text-right">Tax Rate</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-slate-900 font-bold text-slate-700 dark:text-slate-300">
                                            <tr className="border-b border-slate-50 dark:border-slate-800"><td className="p-6">Up to ₹3,00,000</td><td className="p-6 text-right text-emerald-600">NIL</td></tr>
                                            <tr className="border-b border-slate-50 dark:border-slate-800"><td className="p-6">₹3,00,001 - ₹7,00,000</td><td className="p-6 text-right">5%</td></tr>
                                            <tr className="border-b border-slate-50 dark:border-slate-800"><td className="p-6">₹7,00,001 - ₹10,00,000</td><td className="p-6 text-right">10%</td></tr>
                                            <tr className="border-b border-slate-50 dark:border-slate-800"><td className="p-6">₹10,00,001 - ₹12,00,000</td><td className="p-6 text-right">15%</td></tr>
                                            <tr className="border-b border-slate-50 dark:border-slate-800"><td className="p-6">₹12,00,001 - ₹15,00,000</td><td className="p-6 text-right">20%</td></tr>
                                            <tr><td className="p-6">Above ₹15,00,000</td><td className="p-6 text-right text-blue-600">30%</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p className="font-medium italic">
                                    Pro Tip: Remember the ₹75,000 Standard Deduction! If your salary is ₹7,75,000, your "Taxable Income" is actually ₹7,00,000, which puts you right in the <strong>Zero Tax Zone</strong> thanks to the Rebate u/s 87A.
                                </p>
                            </section>

                            {/* Section 3: The Magic of Rebate 87A */}
                            <section>
                                <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-8 tracking-tight flex items-center gap-4">
                                    <span className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-blue-600/20">03</span>
                                    Rebate u/s 87A: The "Superpower" for Incomes up to 7 Lakhs
                                </h3>
                                <p className="mb-6 font-medium">
                                    This is where the magic happens. The government doesn't just want to tax you; they want to protect you if you're in a certain income bracket. Under the New Regime, if your taxable income is ₹7,00,000 or less, your tax liability is <strong>zero</strong>.
                                </p>
                                <p className="mb-6 font-medium">
                                    But what happens if you earn ₹7,00,001? Do you suddenly pay thousands in tax?
                                </p>
                                <p className="mb-8 font-medium">
                                    Enter <strong>Marginal Relief</strong>. This is the "Safety Net" that ensures that the tax you pay is never more than the extra income you earned over ₹7 Lakhs. For example, if you earn ₹7,10,000, your tax won't be ₹26,000; it will be capped to avoid making you poorer for earning more. It’s a sophisticated piece of logic designed to be fair to you.
                                </p>
                            </section>

                            {/* Section 4: Capital Gains - The Silent Wealth Builder */}
                            <section>
                                <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-8 tracking-tight flex items-center gap-4">
                                    <span className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-blue-600/20">04</span>
                                    Investing for the Future: Capital Gains in AY 2026-27
                                </h3>
                                <p className="mb-8 font-medium">
                                    For the wealth-builders out there, the rules for Capital Gains have seen a significant overhaul. The distinction between Long-Term (LTCG) and Short-Term (STCG) is more crucial than ever.
                                </p>
                                <div className="space-y-6">
                                    <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                                        <h5 className="font-black text-slate-900 dark:text-white mb-2 uppercase tracking-widest text-xs">Short-Term Capital Gains (STCG)</h5>
                                        <p className="text-sm font-medium">Listed equity shares and units of equity-oriented funds are now taxed at a flat <strong>20%</strong> if you sell within a year. Other assets? They get added to your slab rate. Patience truly is a virtue here.</p>
                                    </div>
                                    <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                                        <h5 className="font-black text-slate-900 dark:text-white mb-2 uppercase tracking-widest text-xs">Long-Term Capital Gains (LTCG)</h5>
                                        <p className="text-sm font-medium">Held for more than a year? Most financial assets now attract a <strong>12.5%</strong> tax rate. The best part? You get an exemption on the first <strong>₹1.25 Lakhs</strong> of gains every year. It’s the government’s way of saying "Keep Investing!"</p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 5: The "Human" Strategy */}
                            <section>
                                <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-8 tracking-tight flex items-center gap-4">
                                    <span className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-blue-600/20">05</span>
                                    Common Pitfalls: Don't Let These Errors Drain Your Wallet
                                </h3>
                                <p className="mb-8 font-medium">
                                    Even the most seasoned taxpayers make mistakes. For AY 2026-27, the stakes are higher because the system is becoming more automated. Here’s what you need to watch out for:
                                </p>
                                <div className="space-y-6">
                                    <div className="p-8 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-100 dark:border-red-900/30">
                                        <h5 className="font-black text-red-600 mb-2 uppercase tracking-widest text-xs">Mismatch in AIS/TIS</h5>
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">The Income Tax Department knows more about your finances than you might think. Always verify your Annual Information Statement (AIS) before filing. If your bank interest isn't matching, you're inviting a notice.</p>
                                    </div>
                                    <div className="p-8 bg-amber-50 dark:bg-amber-900/10 rounded-3xl border border-amber-100 dark:border-amber-900/30">
                                        <h5 className="font-black text-amber-600 mb-2 uppercase tracking-widest text-xs">Forgetting "Other Income"</h5>
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Got some dividends? A tiny bit of crypto gain? A small consulting gig? Don't leave them out. The "Other Sources" section is the most common place for omissions.</p>
                                    </div>
                                    <div className="p-8 bg-blue-50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-900/30">
                                        <h5 className="font-black text-blue-600 mb-2 uppercase tracking-widest text-xs">Regime Selection Deadlines</h5>
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">For business owners, once you choose a regime, switching back isn't always easy. For salaried individuals, you have the flexibility every year, but your employer needs to know your choice early to deduct TDS correctly.</p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 6: Deep Dive into Deductions (Old Regime) */}
                            <section>
                                <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-8 tracking-tight flex items-center gap-4">
                                    <span className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-blue-600/20">06</span>
                                    The "Old Regime" Survival Guide: Maximize Your Chapter VI-A
                                </h3>
                                <p className="mb-8 font-medium">
                                    If you've crunched the numbers and realized the Old Regime is still your champion (perhaps due to a heavy home loan or high HRA), then you must leave no stone unturned. Here is the ultimate deduction checklist:
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                    <div className="space-y-4">
                                        <h6 className="font-black text-blue-600 text-xs uppercase tracking-widest">Section 80C (Limit: 1.5L)</h6>
                                        <ul className="text-sm font-medium space-y-2 text-slate-500">
                                            <li>• EPF/PPF Contributions</li>
                                            <li>• ELSS Mutual Funds (The growth engine)</li>
                                            <li>• Life Insurance Premiums</li>
                                            <li>• Children's Tuition Fees</li>
                                            <li>• Principal component of Home Loan</li>
                                        </ul>
                                    </div>
                                    <div className="space-y-4">
                                        <h6 className="font-black text-emerald-600 text-xs uppercase tracking-widest">Section 80D (Health is Wealth)</h6>
                                        <ul className="text-sm font-medium space-y-2 text-slate-500">
                                            <li>• Self & Family: Up to ₹25,000</li>
                                            <li>• Parents (Senior): Up to ₹50,000</li>
                                            <li>• Preventive Health Checkup: ₹5,000</li>
                                        </ul>
                                    </div>
                                </div>
                                <p className="font-medium">
                                    The secret to the Old Regime is <strong>Section 80CCD(1B)</strong>—the additional ₹50,000 for NPS. Most people stop at 1.5 Lakhs for 80C, but this extra cushion can be the difference between a high tax bracket and a low one.
                                </p>
                            </section>

                            {/* Section 7: FAQs for the Modern Taxpayer */}
                            <section>
                                <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-8 tracking-tight flex items-center gap-4">
                                    <span className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-blue-600/20">07</span>
                                    Frequently Asked Questions: Quick Answers
                                </h3>
                                <div className="space-y-8">
                                    <div className="border-b border-slate-100 dark:border-slate-800 pb-6">
                                        <h6 className="font-black text-slate-900 dark:text-white mb-3">Q: Can I change my tax regime after filing the return?</h6>
                                        <p className="text-sm font-medium text-slate-500">A: Generally, for salaried individuals, the choice made at the time of filing the original return is final for that year. For those with business income, the choice is more restrictive. Always decide <em>before</em> you click submit!</p>
                                    </div>
                                    <div className="border-b border-slate-100 dark:border-slate-800 pb-6">
                                        <h6 className="font-black text-slate-900 dark:text-white mb-3">Q: Is the Standard Deduction available in the Old Regime?</h6>
                                        <p className="text-sm font-medium text-slate-500">A: Yes! For AY 2026-27, the Standard Deduction of ₹75,000 is available for both regimes. It's a flat deduction from your gross salary—no receipts required.</p>
                                    </div>
                                    <div className="border-b border-slate-100 dark:border-slate-800 pb-6">
                                        <h6 className="font-black text-slate-900 dark:text-white mb-3">Q: How is Agriculture Income taxed?</h6>
                                        <p className="text-sm font-medium text-slate-500">A: Agriculture income itself is exempt, but it is used for "Rate Purposes." This means it could push your other taxable income into a higher tax bracket. It’s called the "Indirect Way of Taxing" and our calculator handles it perfectly.</p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 8: The Human Roadmap to 2027 */}
                            <section>
                                <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-8 tracking-tight flex items-center gap-4">
                                    <span className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-blue-600/20">08</span>
                                    Your 12-Month Tax Strategy: A Month-by-Month Guide
                                </h3>
                                <p className="mb-8 font-medium">
                                    Tax planning isn't a "one-day" event in March. It’s a year-long journey. To truly master your finances for AY 2026-27, follow this simple, human roadmap:
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                                        <p className="text-[10px] font-black text-blue-600 uppercase mb-2">April - June</p>
                                        <h6 className="font-bold text-slate-900 dark:text-white mb-2 text-sm">The Setup Phase</h6>
                                        <p className="text-xs text-slate-500 leading-relaxed">Declare your regime to your employer. Start a small monthly SIP in an ELSS fund if you're in the Old Regime. Simplicity is key.</p>
                                    </div>
                                    <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                                        <p className="text-[10px] font-black text-blue-600 uppercase mb-2">July - September</p>
                                        <h6 className="font-bold text-slate-900 dark:text-white mb-2 text-sm">The Review Phase</h6>
                                        <p className="text-xs text-slate-500 leading-relaxed">Check your AIS/26AS for any early TDS mismatches. Ensure your advance tax is paid if you have business or capital gains income.</p>
                                    </div>
                                    <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                                        <p className="text-[10px] font-black text-blue-600 uppercase mb-2">October - March</p>
                                        <h6 className="font-bold text-slate-900 dark:text-white mb-2 text-sm">The Optimization Phase</h6>
                                        <p className="text-xs text-slate-500 leading-relaxed">Finalize your 80C/80D investments. If you have extra cash, put it into NPS for that extra 50k cushion. Breathe easy!</p>
                                    </div>
                                </div>
                            </section>

                            {/* Conclusion */}
                            <section className="pt-12 border-t-4 border-slate-100 dark:border-slate-800">
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight italic">Your Financial Destiny is in Your Hands</h3>
                                <p className="mb-8 font-medium">
                                    Taxation doesn't have to be a monster hiding under your bed. When you understand the logic—the <em>why</em> behind the <em>what</em>—it becomes just another tool in your financial toolkit. AY 2026-27 is about rewarding growth and simplifying the lives of honest taxpayers.
                                </p>
                                <p className="mb-8 font-medium">
                                    Use the <strong>VKCalc.in</strong> tools to stay ahead of the curve. Whether it's our advanced Tax Engine or our PDF reporting suite, we're here to ensure you're never left in the dark. Because at the end of the day, it's not just about how much you earn; it's about how much you keep and how wisely you grow it.
                                </p>
                                <div className="p-10 bg-blue-600 rounded-[3rem] text-white text-center shadow-2xl shadow-blue-600/40">
                                    <Sparkles className="mx-auto mb-6 w-12 h-12" />
                                    <h4 className="text-2xl font-black mb-4">Ready to optimize your taxes?</h4>
                                    <p className="font-bold opacity-90 mb-8">Scroll back up and use our elite calculator to see your savings instantly!</p>
                                    <button onClick={() => pageTopRef.current?.scrollIntoView({ behavior: 'smooth' })} className="px-10 py-4 bg-white text-blue-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all">
                                        Back to Calculator
                                    </button>
                                </div>
                            </section>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
}

