import { useState } from 'react';
import { Search, ChevronDown, FileText, BookOpen, Scale, Gavel, FileSignature, Briefcase, Landmark, TrendingUp, CreditCard, Zap, Sparkles } from 'lucide-react';

interface HeaderProps {
  onNavigate: (page: 'home' | 'contact') => void;
}

export default function Header({ onNavigate }: HeaderProps) {
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
    <header className="sticky top-0 z-50 w-full transition-colors duration-300 shadow-sm">
      {/* Top Search Bar */}
      <div className="bg-blue-50 dark:bg-navy-glow/50 border-b border-blue-100 dark:border-blue-900/30 px-6 py-2 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-center">
          <div className="relative w-full max-w-2xl group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
            <input
              type="text"
              placeholder="Ask Calc Ginni... (e.g., Income Tax, GST, or TDS)"
              className="w-full bg-white dark:bg-gray-800/80 border border-blue-200 dark:border-blue-900/50 rounded-xl py-2.5 pl-11 pr-4 text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white/90 dark:bg-gray-900/90 border-b border-gray-100 dark:border-gray-800 px-8 py-4 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-amber-500 rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center group cursor-pointer overflow-hidden relative">
              <span className="text-white font-bold text-xl italic group-hover:scale-110 transition-transform">VK</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </div>
            <div>
              <div className="text-sm font-bold text-navy-dark dark:text-white leading-none mb-1">VKCalc.in</div>
              <div className="text-[9px] text-amber-600 dark:text-amber-500 font-bold uppercase tracking-[0.2em]">Income Tax Practitioner</div>
            </div>
          </div>

          <nav className="flex-1 flex items-center justify-center gap-10">
            {menuItems.slice(0, 5).map((item, i) => (
              <button
                key={i}
                onClick={item.action}
                className="font-bold text-xs uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-500 transition-all relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 group-hover:w-full transition-all duration-300"></span>
              </button>
            ))}
          </nav>

          <button className="px-6 py-2.5 bg-amber-500 text-white hover:bg-amber-600 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-lg shadow-amber-500/25 active:scale-95">
            Get Started
          </button>
        </div>
      </div>

      {/* Navigation & Mega Menu Bar */}
      <div className="bg-navy-dark dark:bg-black border-b border-amber-500/30 px-8 relative">
        <nav className="max-w-7xl mx-auto flex items-center justify-center gap-1">
          {menuItems.map((item, i) => (
            <div
              key={i}
              onMouseEnter={() => item.megaMenu && setActiveMenu(item.label)}
              onMouseLeave={() => setActiveMenu(null)}
              className="relative py-3.5 px-4"
            >
              <button
                onClick={item.action}
                className={`text-[10px] font-bold uppercase tracking-[0.15em] transition-all flex items-center gap-2 ${activeMenu === item.label ? 'text-amber-400 scale-105' : 'text-gray-400 hover:text-amber-400'
                  }`}
              >
                {item.label}
                {item.megaMenu && <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${activeMenu === item.label ? 'rotate-180' : ''}`} />}
              </button>

              {/* Mega Menu Dropdown */}
              {item.megaMenu && activeMenu === item.label && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-[calc(100vw-280px)] max-w-6xl bg-white dark:bg-gray-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border-t-2 border-amber-500 rounded-b-[2.5rem] p-10 animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-300 z-50">
                  <div className="grid grid-cols-3 gap-12">
                    {item.megaMenu.map((section, idx) => (
                      <div key={idx} className="space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
                          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 shadow-sm">
                            {section.icon}
                          </div>
                          <h3 className="font-bold text-xs text-navy-dark dark:text-white uppercase tracking-[0.2em]">{section.title}</h3>
                        </div>
                        <ul className="space-y-3">
                          {section.links.map((link, linkIdx) => (
                            <li key={linkIdx}>
                              <a
                                href="#"
                                className="text-[11px] text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors block font-bold leading-relaxed group flex items-center gap-2"
                              >
                                <span className="w-1 h-1 rounded-full bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
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
          <div className="h-4 w-px bg-white/10 mx-4"></div>
          <button className="px-5 py-1.5 bg-amber-500 text-white rounded-full font-bold text-[9px] uppercase tracking-[0.2em] hover:bg-white hover:text-amber-600 transition-all shadow-lg shadow-amber-500/20 active:scale-95">
            File ITR
          </button>
        </nav>
      </div>
    </header>
  );
}
