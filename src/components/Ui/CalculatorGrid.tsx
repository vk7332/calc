import { Calculator, Home, CreditCard, GraduationCap, PiggyBank, TrendingUp, Percent, DollarSign, Shield, FileText, Tag, Scale, Gavel, FileSignature, Users, Landmark, Zap, ArrowRight, Sparkles } from 'lucide-react';

interface CalculatorGridProps {
    isDark: boolean;
    onNavigate: (page: string) => void; // Add this line
}

const CalculatorGrid: React.FC<CalculatorGridProps> = ({ isDark, onNavigate }) => {
    const sections = [
        {
            id: 'tax-salary',
            title: 'Tax & Salary',
            description: 'Salary, deductions, and regime comparisons',
            icon: <Calculator className="w-5 h-5" />,

            cards: [
                { icon: <Calculator className="w-6 h-6" />, title: 'Income Tax Calc', description: 'Calculate income tax obligation for AY 2024-25', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' },
                { icon: <Home className="w-6 h-6" />, title: 'HRA Exemption', description: 'Calculate your HRA allowance and benefits', color: 'bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400' },
                { icon: <DollarSign className="w-6 h-6" />, title: 'Advance Tax', description: 'Calculate advance tax for payments', color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' },
                { icon: <PiggyBank className="w-6 h-6" />, title: 'Gratuity Calculator', description: 'Calculate your gratuity payment', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' },
                { icon: <Tag className="w-6 h-6" />, title: 'Bonus Calculator', description: 'Calculate statutory bonus as per law', color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' },
                { icon: <Percent className="w-6 h-6" />, title: 'TDS Calculator', description: 'Tax Deducted at Source calculator', color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' }
            ]
        },
        {
            id: 'emi-loans',
            title: 'EMI & Loans',
            description: 'Loan EMIs and repayment planning',
            icon: <CreditCard className="w-5 h-5" />,
            cards: [
                { icon: <Home className="w-6 h-6" />, title: 'Home Loan EMI', description: 'EMI calculator for home loans', color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' },
                { icon: <CreditCard className="w-6 h-6" />, title: 'Personal Loan EMI', description: 'Calculate EMI rates and tenure options', color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' },
                { icon: <CreditCard className="w-6 h-6" />, title: 'Car Loan EMI', description: 'Plan your vehicle purchase', color: 'bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400' },
                { icon: <GraduationCap className="w-6 h-6" />, title: 'Education Loan', description: 'Calculate education loan EMI', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' },
                { icon: <PiggyBank className="w-6 h-6" />, title: 'Provident Fund', description: 'PF maturity and withdrawal calculator', color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' }
            ]
        },

        {
            id: 'interest-calc',
            title: 'Interest Calculators',
            description: 'SIP, PPF, NPS and investment projections',
            icon: <TrendingUp className="w-5 h-5" />,
            cards: [
                { icon: <TrendingUp className="w-6 h-6" />, title: 'SIP Calculator', description: 'Systematic Investment Plan for 10-30 years', color: 'bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400' },
                { icon: <DollarSign className="w-6 h-6" />, title: 'Lumpsum', description: 'Calculate returns on one-time investment', color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' },
                { icon: <PiggyBank className="w-6 h-6" />, title: 'PPF Calculator', description: 'Public Provident Fund investments', color: 'bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400' },
                { icon: <TrendingUp className="w-6 h-6" />, title: 'NPS Calculator', description: 'National Pension Scheme returns', color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' },
                { icon: <DollarSign className="w-6 h-6" />, title: 'Sukanya Samriddhi', description: 'Girl child savings scheme calculator', color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' },
                { icon: <Calculator className="w-6 h-6" />, title: 'FD Calculator', description: 'Fixed Deposit Maturity Amount', color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' },
                { icon: <PiggyBank className="w-6 h-6" />, title: 'CAGR Calculator', description: 'Compound Annual Growth Rate', color: 'bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400' },
                { icon: <TrendingUp className="w-6 h-6" />, title: 'Goal Planning', description: 'Plan investments for future goals', color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' }
            ]
        },
        {
            id: 'insurance',
            title: 'Insurance & Protection',
            description: 'Protect your family and assets',
            icon: <Shield className="w-5 h-5" />,
            cards: [
                { icon: <Shield className="w-6 h-6" />, title: 'Health Insurance', description: 'Compare premiums and find best coverage', color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' },
                { icon: <Shield className="w-6 h-6" />, title: 'Term Insurance', description: 'Calculate adequate life cover needed', color: 'bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400' }
            ]
        },
        {
            id: 'gst-business',
            title: 'GST & Business',
            icon: <FileText className="w-5 h-5" />,
            cards: [
                { icon: <Percent className="w-6 h-6" />, title: 'GST Calculator', description: 'Quickly calculate GST & prices', color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' },
                { icon: <TrendingUp className="w-6 h-6" />, title: 'Break-Even Point', description: 'Calculate business profitability threshold', color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' }
            ]
        }
    ];


    return (
        <main className="max-w-7xl mx-auto px-6 py-12">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-blue-50/50 dark:bg-navy-dark/50 border border-blue-100 dark:border-navy-glow p-8 md:p-12 mb-12">
                <div className="relative z-10 max-w-4xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold mb-6 border border-amber-200 dark:border-amber-800">
                        <span className="animate-pulse">🇮🇳</span> BUILT FOR INDIAN TAXPAYERS - AY 2026-27
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-navy-dark dark:text-white leading-[1.1]">
                        Smart <span className="text-amber-500">Financial Tools</span><br />
                        for Every Indian
                    </h1>

                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl leading-relaxed">
                        60+ calculators for Income Tax, SIP, Loans, GST, Court Fees and more —
                        built with precision by <span className="font-semibold text-amber-600 dark:text-amber-500">VK Tax</span> professionals.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <button className="px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold transition-all duration-300 shadow-lg shadow-amber-500/25 flex items-center gap-2 group">
                            Explore All Tools <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="px-8 py-4 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold border border-gray-200 dark:border-gray-700 hover:border-amber-500 dark:hover:border-amber-500 transition-all duration-300">
                            Talk to an Expert
                        </button>
                    </div>
                </div>
            </div>


            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {[
                    { label: 'Financial Tools', value: '25+', color: 'text-amber-600' },
                    { label: 'Tool Categories', value: '8', color: 'text-amber-600' },
                    { label: 'Free to Use', value: '100%', color: 'text-amber-600' },
                    { label: 'Updated', value: 'AY 25-26', color: 'text-amber-600' }
                ].map((stat, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 text-center hover:shadow-md transition-shadow">
                        <div className={`text-2xl md:text-3xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
                        <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">{stat.label}</div>
                    </div>
                ))}
            </div>


            {/* Advertisement Section */}
            <div className="mb-12 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-100 dark:bg-navy-glow text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest rounded-full border border-blue-200 dark:border-blue-800 z-10">
                    ADVERTISEMENT
                </div>
                <div className="w-full h-[120px] bg-white dark:bg-gray-800/30 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-2 group cursor-pointer hover:border-blue-400 transition-colors">
                    <div className="text-xl font-bold text-gray-400 dark:text-gray-600 group-hover:text-blue-400 transition-colors">728 × 90</div>
                    <div className="text-[10px] font-medium text-gray-400 dark:text-gray-600 uppercase tracking-tighter">SPACE FOR ADSENSE (728x90 LEADERBOARD)</div>
                </div>
            </div>


            {/* Court Fees Calculator Banner */}
            <div className="mb-16 relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative overflow-hidden rounded-[2.5rem] bg-[#1a0b2e] border border-white/10 p-8 md:p-12">
                    {/* Grid Background Effect */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold mb-6 backdrop-blur-sm">
                                <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
                                <span className="uppercase tracking-wider">New Tool • Legal Ginni™</span>
                            </div>

                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                Court Fees <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Calculator</span>
                            </h2>

                            <p className="text-lg text-white/70 mb-8 max-w-xl leading-relaxed">
                                Calculate court fees instantly for any case — civil suits, writ petitions, matrimonial matters, appeals & more. Built by <span className="text-white font-semibold">VK Tax & Law Chamber®</span> (M.Com, LLB).
                            </p>

                            <div className="flex flex-wrap gap-3">
                                {[
                                    { icon: <Gavel className="w-3.5 h-3.5" />, label: 'Civil Suit' },
                                    { icon: <FileSignature className="w-3.5 h-3.5" />, label: 'Writ Petition' },
                                    { icon: <Users className="w-3.5 h-3.5" />, label: 'Matrimonial' },
                                    { icon: <Landmark className="w-3.5 h-3.5" />, label: 'High Court' },
                                    { icon: <Zap className="w-3.5 h-3.5" />, label: 'Execution' },
                                    { icon: <TrendingUp className="w-3.5 h-3.5" />, label: 'Appeals' }
                                ].map((tag, i) => (
                                    <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm hover:bg-white/10 transition-colors cursor-default">
                                        {tag.icon}
                                        {tag.label}
                                    </div>
                                ))}
                            </div>
                        </div>


                        <div className="flex flex-col items-center gap-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-purple-500 rounded-full blur-2xl opacity-40 animate-pulse"></div>
                                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-white/20 flex items-center justify-center backdrop-blur-md">
                                    <Scale className="w-16 h-16 md:w-20 md:h-20 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)] animate-bounce-slow" />
                                </div>
                            </div>

                            <div className="text-center">
                                <button className="px-10 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold transition-all duration-300 shadow-xl shadow-purple-900/40 flex items-center gap-2 group mb-3">
                                    Calculate Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <div className="text-xs text-white/40 font-medium">Free • Instant • Powered by Legal Ginni™</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Categories Header */}
            <div className="mb-10">
                <div className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-[0.2em] mb-2">COMPLETE TOOL LIBRARY</div>
                <h2 className="text-3xl font-bold text-navy-dark dark:text-white flex items-baseline gap-2">
                    7 Categories <span className="text-gray-300 dark:text-gray-700 font-light">•</span> 60+ Financial Calculators
                </h2>
            </div>

            // Inside the sections.map function in Vipcalc.tsx

            {sections.map((section) => (
                <div
                    key={section.id}
                    // FIX: This uses the destructured element and enables navigation
                    onClick={() => onNavigate(section.id)}
                    className={`group cursor-pointer p-6 rounded-3xl border transition-all ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                        } hover:border-blue-500 hover:shadow-md`}
                >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors ${isDark ? 'bg-slate-700 text-blue-400 group-hover:bg-blue-900/30' : 'bg-slate-50 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600'
                        }`}>
                        {section.icon}
                    </div>
                    <h3 className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        {section.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        {section.description}
                    </p>
                </div>
            ))}

            {sections.map((section) => (
                <div key={section.id} className="mb-16">
                    <section className="mb-10">
                        <div className="flex items-center justify-between mb-8 group cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-amber-600 shadow-sm group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                                    {section.icon}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-navy-dark dark:text-white group-hover:text-amber-600 transition-colors">
                                        {section.title}
                                    </h2>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Core tax tools, deductions & salary breakdowns — AY 2026-27</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 group-hover:text-amber-600 transition-colors">
                                {section.cards.length} Tools <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 items-stretch">
                            {section.cards.map((card, index) => (
                                <button
                                    key={index}
                                    className="p-6 rounded-2xl bg-white dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/50 hover:border-amber-500/50 dark:hover:border-amber-500/50 transition-all duration-500 text-left group hover:shadow-xl hover:shadow-amber-500/5"
                                >
                                    <div className={`w-14 h-14 rounded-2xl ${card.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm`}>
                                        {card.icon}
                                    </div>
                                    <h3 className="text-lg font-bold mb-2 text-navy-dark dark:text-white group-hover:text-amber-600 transition-colors">
                                        {card.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                                        {card.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-amber-600 dark:text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                            USE TOOL <ArrowRight className="w-3.5 h-3.5" />
                                        </span>
                                        <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover:bg-amber-500 group-hover:text-white transition-all">
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>


                    {/* AdSense Placeholder after each section */}
                    <div className="relative group">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gray-100 dark:bg-navy-glow/50 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] rounded-full border border-gray-200 dark:border-gray-800 z-10 transition-colors group-hover:border-amber-500 group-hover:text-amber-500">
                            SPONSORED CONTENT
                        </div>
                        <div className="w-full h-[140px] bg-white/50 dark:bg-gray-800/20 rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center gap-3 group cursor-pointer hover:border-amber-500/50 transition-all duration-300">
                            <div className="text-sm font-bold text-gray-400 dark:text-gray-600 group-hover:text-amber-600 transition-colors">Advertisement Space ({section.title})</div>
                            <div className="text-[10px] font-medium text-gray-300 dark:text-gray-700 uppercase tracking-widest px-4 py-1.5 rounded-lg border border-gray-100 dark:border-gray-800">Leaderboard 728 × 90</div>
                        </div>
                    </div>
                </div>
            ))}
        </main>
    );
}

export default CalculatorGrid;