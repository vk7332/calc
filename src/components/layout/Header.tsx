import { useState } from 'react';
import { Search, ChevronDown, Home as HomeIcon, FileText, BookOpen, Scale, Gavel, FileSignature, Briefcase, Landmark, TrendingUp, CreditCard, Zap, Sparkles } from 'lucide-react';

interface HeaderProps {
  onNavigate: (page: 'home' | 'contact') => void;
  onMenuClick?: (menu: string) => void;
}

export default function Header({ onNavigate, onMenuClick }: HeaderProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const menuItems = [
    { label: 'Home', action: () => onNavigate('home') },
    {
      label: 'Calculators',
      megaMenu: [
        {
          title: 'EMI & Loans',
          icon: <CreditCard className="w-4 h-4" />,
          links: ['Home Loan EMI', 'Personal Loan EMI', 'Loan Eligibility']
        },
        {
          title: 'Investments',
          icon: <TrendingUp className="w-4 h-4" />,
          links: ['SIP Calculator', 'Lumpsum Calc', 'PPF & NPS']
        },
        {
          title: 'Business/GST',
          icon: <Briefcase className="w-4 h-4" />,
          links: ['GST Calculator', 'Break-Even Point', 'Profit Margin']
        }
      ]
    },
    {
      label: 'Tax Forms',
      megaMenu: [
        {
          title: 'Special Cases',
          icon: <Landmark className="w-4 h-4" />,
          links: ['Form 10-IEA: Determination of tax in certain special cases']
        },
        {
          title: 'Exemptions & Reliefs',
          icon: <Scale className="w-4 h-4" />,
          links: ['Form 10CCC: Tax Exemptions and Reliefs', 'Form 10CCD: Tax Exemptions and Reliefs (Pension)']
        },
        {
          title: 'TDS Forms',
          icon: <FileSignature className="w-4 h-4" />,
          links: ['Form 12G: Deduction of tax at source', 'Form 12H: Deduction of tax at source (interest)']
        }
      ]
    },
    {
      label: 'Tax Books',
      megaMenu: [
        {
          title: 'Core Taxation Books',
          icon: <BookOpen className="w-4 h-4" />,
          links: ['Income Tax Act, 1961', 'Income Tax Rules, 1962', 'Finance Act Amendments', 'Taxation of Various Income Sources']
        },
        {
          title: 'Special Topics',
          icon: <Sparkles className="w-4 h-4" />,
          links: ['Deductions Under Chapter VI-A', 'Allowances & Exemptions', 'Advance Pricing Agreement', 'International Taxation']
        }
      ]
    },
    {
      label: 'Income Tax Rules & Law',
      megaMenu: [
        {
          title: 'Sections & Rules',
          icon: <Gavel className="w-4 h-4" />,
          links: ['Section 10: Income Not Chargeable to Tax', 'Section 80C-80U: Deductions', 'Section 139: Filing of Returns']
        },
        {
          title: 'Penalties & Prosecution',
          icon: <Zap className="w-4 h-4" />,
          links: ['Section 270: Penalty for Tax Evasion', 'Section 271: Penalties for Discrepancies', 'Section 276: Criminal Prosecution']
        },
        {
          title: 'Procedural Rules',
          icon: <FileText className="w-4 h-4" />,
          links: ['Rule 11: Income Computation', 'Rule 31: Audit Requirements', 'Rule 114: E-filing Procedures']
        }
      ]
    },
    { label: 'GST' },
    { label: 'Blog' },
    { label: 'About' },
    { label: 'Contact', action: () => onNavigate('contact') }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] w-full transition-all duration-300 shadow-lg">
      {/* Top Search Bar */}
      <div className="bg-blue-600 dark:bg-slate-900 border-b border-blue-500 dark:border-slate-800 px-6 py-3 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center group cursor-pointer overflow-hidden relative">
              <span className="text-blue-600 font-black text-xl italic group-hover:scale-110 transition-transform">VK</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-black text-white leading-none mb-1 tracking-tight">VKCalc.in</div>
              <div className="text-[9px] text-blue-200 font-bold uppercase tracking-[0.2em]">Tax Practitioner</div>
            </div>
          </div>
          
          <div className="relative w-full max-w-xl group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300 group-focus-within:text-white transition-colors" />
            <input
              type="text"
              placeholder="Search financial tools, tax rules, or laws..."
              className="w-full bg-blue-700/50 dark:bg-slate-800 border border-blue-500/50 dark:border-slate-700 rounded-xl py-2 pl-11 pr-4 text-sm text-white placeholder-blue-300 focus:ring-4 focus:ring-white/10 focus:border-white transition-all outline-none"
            />
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => onNavigate('home')}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              title="Home"
            >
              <HomeIcon size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-white/95 dark:bg-slate-900/95 border-b border-gray-200 dark:border-slate-800 px-6 backdrop-blur-md">
        <nav className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          {menuItems.map((item, i) => (
            <div
              key={i}
              onMouseEnter={() => item.megaMenu && setActiveMenu(item.label)}
              onMouseLeave={() => setActiveMenu(null)}
              className="relative"
            >
              <button
                onClick={item.action}
                className={`px-4 py-4 text-[11px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 border-b-2 ${activeMenu === item.label ? 'text-blue-600 border-blue-600' : 'text-slate-500 border-transparent hover:text-blue-600'}`}
              >
                {item.label}
                {item.megaMenu && <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${activeMenu === item.label ? 'rotate-180' : ''}`} />}
              </button>

              {/* Mega Menu Dropdown */}
              {item.megaMenu && activeMenu === item.label && (
                <div className="fixed left-1/2 -translate-x-1/2 top-[108px] w-screen max-w-5xl bg-white dark:bg-slate-900 shadow-2xl border-x border-b border-slate-100 dark:border-slate-800 rounded-b-3xl p-8 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-300 z-[110]">
                  <div className="grid grid-cols-3 gap-10">
                    {item.megaMenu.map((section, idx) => (
                      <div key={idx} className="space-y-4">
                        <div className="flex items-center gap-3 pb-3 border-b border-slate-50 dark:border-slate-800">
                          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                            {section.icon}
                          </div>
                          <h3 className="font-bold text-[10px] text-slate-800 dark:text-white uppercase tracking-widest">{section.title}</h3>
                        </div>
                        <ul className="space-y-2">
                          {section.links.map((link, linkIdx) => (
                            <li key={linkIdx}>
                              <a
                                href="#"
                                className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors block font-medium flex items-center gap-2 group"
                              >
                                <span className="w-1 h-1 rounded-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                {link}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
}
