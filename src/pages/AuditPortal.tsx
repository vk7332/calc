import { useState, useMemo } from 'react';
import { performTaxAudit, calculateNetWorthAt60 } from '@/engines/AuditEngine';
import { AuditResult } from '@/types/client';
import { useHistory } from '@/context/HistoryContext';
import { Calculator, Save, TrendingDown, CheckCircle2, FileText } from 'lucide-react';
import { calculateTaxITR2 } from '@/engines/TaxEngine';
import { calculateEMI } from '@/engines/LoanEngine';
import { calculateGstPenalties, PenaltyResult } from '@/engines/GstPenaltyEngine';
import { exportTaxReport } from '@/utils/pdfGenerator';
import { useSettings } from '@/context/SettingsContext';

export default function AuditPortal() {
    const { addRecord } = useHistory();
    const [basicSalary, setBasicSalary] = useState<number>(0);
    const [hra, setHra] = useState<number>(0);
    const [specialAllowance, setSpecialAllowance] = useState<number>(0);
    const [deductions, setDeductions] = useState<number>(0);
    // --- INSERT AFTER const [deductions, setDeductions] = useState<number>(0); ---
    const [age, setAge] = useState<number>(30);
    const [currentSavings, setCurrentSavings] = useState<number>(0);
    const [monthlySip, setMonthlySip] = useState<number>(10000);
    const [clientName, setClientName] = useState<string>('');
    const [result, setResult] = useState<AuditResult | null>(null);
    const [stcg, setStcg] = useState<number>(0);
    const [ltcg, setLtcg] = useState<number>(0);
    const [casualIncome, setCasualIncome] = useState<number>(0);
    const [loanAmount, setLoanAmount] = useState<number>(0);
    const [loanTenure, setLoanTenure] = useState<number>(1);
    const [interestRate, setInterestRate] = useState<number>(8.5);
    const [dueDate, setDueDate] = useState<string>('');
    const [filingDate, setFilingDate] = useState<string>('');
    const [penaltyResult, setPenaltyResult] = useState<PenaltyResult | null>(null);
    const { settings, toggleComparison } = useSettings();

    const emiResult = useMemo(() => calculateEMI(loanAmount, interestRate, loanTenure), [loanAmount, interestRate, loanTenure]);
    const totalCapitalGains = stcg + ltcg;
    const projection = useMemo(() => calculateNetWorthAt60(age, currentSavings, monthlySip), [age, currentSavings, monthlySip]);
    const finalNetWorth = projection[projection.length - 1]?.balance || 0;
    const annualIncome = basicSalary + hra + specialAllowance + casualIncome + totalCapitalGains;

    const handleCalculate = () => {
        const annualIncome = basicSalary + hra + specialAllowance + casualIncome;
        const oldAudit = performTaxAudit(annualIncome, deductions);

        const res = calculateTaxITR2(
            basicSalary + hra + specialAllowance,
            casualIncome,
            deductions,
            settings
        );

        console.log('Baseline Audit:', oldAudit);
        setResult(res);
    };

    const handleSaveAudit = async () => {
        if (!result) return;

        try {
            // Generate PDF data
            const pdfData = await exportTaxReport(result, clientName || 'Quick Client', settings);

            // Save to history with full details
            await addRecord({
                name: clientName || "Quick Client",
                pan: "",
                assessmentYear: "2026-27",
                taxRegime: result.recommendedRegime,
                totalIncome: result.totalIncome,
                taxLiability: result.recommendedRegime === 'new' ? result.newTax : result.oldTax,
                incomeDetails: {
                    basicSalary,
                    hra,
                    specialAllowance,
                    casualIncome,
                    stcg,
                    ltcg,
                    totalCapitalGains
                },
                deductions: {
                    deductions,
                    standardDeduction: settings.standardDeduction
                },
                auditReport: result,
                pdfData
            });

            toggleComparison(true);
            alert("Audit saved to cloud database!");
        } catch (error) {
            console.error('Error saving audit:', error);
            alert("Failed to save audit. Please try again.");
        }
    };

    const handlePenaltyCalc = () => {
        if (dueDate && filingDate) {
            const res = calculateGstPenalties(annualIncome, dueDate, filingDate, false);
            setPenaltyResult(res);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Input Section */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Calculator className="text-blue-600" /> Strategic Tax Audit Portal
                </h2>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Basic Salary (₹)</label>
                    <input
                        type="number"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2"
                        value={basicSalary}
                        onChange={(e) => setBasicSalary(parseFloat(e.target.value) || 0)}
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">HRA</label>
                    <input
                        type="number"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                        value={hra}
                        onChange={(e) => setHra(parseFloat(e.target.value) || 0)}
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Special Allowance</label>
                    <input
                        type="number"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                        value={specialAllowance}
                        onChange={(e) => setSpecialAllowance(parseFloat(e.target.value) || 0)}
                    />
                </div>


                {/* --- ADD THESE INSIDE THE INPUT GRID --- */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Current Age</label>
                    <input
                        type="number"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                        value={age}
                        onChange={(e) => setAge(Number(e.target.value))}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Current Savings (₹)</label>
                    <input
                        type="number"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                        value={currentSavings}
                        onChange={(e) => setCurrentSavings(Number(e.target.value))}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Monthly SIP (₹)</label>
                    <input
                        type="number"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                        value={monthlySip}
                        onChange={(e) => setMonthlySip(Number(e.target.value))}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Client Name</label>
                        <input
                            type="text"
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter name..."
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Annual Income (₹)</label>
                        <input
                            type="number"
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                            readOnly
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Total Deductions (₹)</label>
                        <input
                            type="number"
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                            value={deductions}
                            onChange={(e) => setDeductions(Number(e.target.value))}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-red-500 uppercase mb-1">Online Gaming/Casual Income</label>
                    <input
                        type="number"
                        className="w-full p-3 bg-red-50 border border-red-100 rounded-xl focus:ring-2 focus:ring-red-500"
                        placeholder="Enter winnings..."
                        onChange={(e) => setCasualIncome(Number(e.target.value))}
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Short Term Capital Gain (STCG)</label>
                    <input
                        type="number"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                        onChange={(e) => setStcg(Number(e.target.value))}
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Long Term Capital Gain (LTCG)</label>
                    <input
                        type="number"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                        onChange={(e) => setLtcg(Number(e.target.value))}
                    />
                </div>

                <button
                    onClick={handleCalculate}
                    className="mt-6 w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                >
                    Perform Audit Analysis
                </button>
            </div>

            {/* Results Section */}
            {result && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Comparison Card */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Regime Comparison</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                                <span className="font-medium text-slate-600">Old Regime Tax</span>
                                <span className="font-bold text-slate-800">₹{result.oldTax.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                <span className="font-medium text-blue-700">New Regime Tax</span>
                                <span className="font-bold text-blue-800">₹{result.newTax.toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <TrendingDown className="text-emerald-600" />
                                <div>
                                    <p className="text-[10px] font-bold text-emerald-600 uppercase">Potential Savings</p>
                                    <p className="text-lg font-bold text-emerald-700">₹{result.savings.toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-emerald-600 uppercase">Recommendation</p>
                                <p className="text-sm font-bold text-emerald-700 uppercase">{result.recommendedRegime} Regime</p>
                            </div>
                            <div className="text-sm text-slate-700">
                                <p>Total Capital Gains: ₹{totalCapitalGains.toLocaleString('en-IN')}</p>
                                <p>Your EMI: ₹{emiResult.monthlyEmi.toLocaleString('en-IN')} / month</p>
                            </div>
                        </div>
                    </div>

                    {/* --- RETIREMENT CHART BLOCK START --- */}
                    <div className="mt-8 bg-slate-900 p-8 rounded-3xl text-white shadow-2xl overflow-hidden relative col-span-full">
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold mb-1">Wealth Projection at Age 60</h3>
                            <p className="text-slate-400 text-sm mb-8">12% Expected Annual Growth</p>

                            <div className="flex items-end gap-2 h-40 mb-6">
                                {projection.filter((_, i) => i % 5 === 0).map((point, idx) => (
                                    <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                                        <div
                                            className="w-full bg-blue-500 rounded-t-md transition-all duration-1000"
                                            style={{ height: `${(point.balance / finalNetWorth) * 100}%` }}
                                        ></div>
                                        <span className="text-[10px] text-slate-500 font-mono">{point.age}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between items-center bg-white/5 p-6 rounded-2xl border border-white/10">
                                <div>
                                    <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">Retirement Corpus</p>
                                    <p className="text-3xl font-bold text-white">₹{(finalNetWorth / 10000000).toFixed(2)} Cr</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-slate-400">Monthly SIP: ₹{monthlySip.toLocaleString('en-IN')}</p>
                                    <p className="text-[10px] text-slate-400">Target Age: 60 Years</p>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full"></div>
                    </div>
                    {/* --- RETIREMENT CHART BLOCK END --- */}

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Loan Amount (₹)</label>
                        <input
                            type="number"
                            className="w-full bg-transparent text-lg font-bold outline-none"
                            onChange={(e) => setLoanAmount(Number(e.target.value))}
                        />
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Loan Tenure (Years)</label>
                        <input
                            type="number"
                            className="w-full bg-transparent text-lg font-bold outline-none"
                            onChange={(e) => setLoanTenure(Number(e.target.value))}
                        />
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Interest Rate (%)</label>
                        <input
                            type="number"
                            className="w-full bg-transparent text-lg font-bold outline-none"
                            onChange={(e) => setInterestRate(Number(e.target.value))}
                        />
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Due Date</label>
                        <input
                            type="date"
                            className="w-full bg-transparent text-lg font-bold outline-none"
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Filing Date</label>
                        <input
                            type="date"
                            className="w-full bg-transparent text-lg font-bold outline-none"
                            onChange={(e) => setFilingDate(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handlePenaltyCalc}
                        className="col-span-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-100"
                    >
                        Calculate GST Filing Penalties
                    </button>

                    {penaltyResult && penaltyResult.daysDelayed > 0 && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-2xl">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-red-600 font-bold text-xs uppercase">Late Filing Warning</span>
                                <span className="bg-red-600 text-white text-[10px] px-2 py-1 rounded-full">
                                    {penaltyResult.daysDelayed} Days Delay
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase">Interest (18%)</p>
                                    <p className="font-bold text-slate-800">₹{penaltyResult.interest}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase">Late Fee</p>
                                    <p className="font-bold text-slate-800">₹{penaltyResult.lateFee}</p>
                                </div>
                            </div>
                        </div>
                    )}


                    {/* Action Card */}
                    <div className="bg-slate-900 p-6 rounded-3xl shadow-xl flex flex-col justify-between text-white">
                        <div>
                            <CheckCircle2 className="text-blue-400 mb-4" size={32} />
                            <h3 className="text-xl font-bold mb-2">Ready to File?</h3>
                            <p className="text-slate-400 text-sm">You can save this audit to your client history for future reference or generate a professional PDF report for the assessee.</p>
                        </div>
                        <div className="space-y-3">
                            <button
                                onClick={handleSaveAudit}
                                className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-all border border-white/10"
                            >
                                <Save size={18} /> Save to Client History
                            </button>

                            <button
                                onClick={() => {
                                    if (result) {
                                        exportTaxReport(result, clientName, settings);
                                    } else {
                                        alert("Please calculate the tax first!");
                                    }
                                }}
                                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition-all"
                            >
                                <FileText size={14} /> Export to PDF
                            </button>

                            <button
                                onClick={handleSaveAudit}
                                className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition-all"
                            >
                                <Save size={18} /> Save to Client History
                            </button>

                        </div>

                        {/* ... rest of your results display ... */}
                    </div>
                </div>
            )}

            {/* Placeholder for additional sections */}
        </div>
    );
}
