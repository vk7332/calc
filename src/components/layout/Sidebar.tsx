import { useState } from 'react';
import { ChevronDown, ChevronRight, Calculator, CreditCard, TrendingUp, Shield, Briefcase } from 'lucide-react';

interface SidebarProps {
  onNavigate: (page: string) => void;
}

interface Category {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: string[];
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['tax-salary']);

  const categories: Category[] = [
    {
      id: 'tax-salary',
      title: 'Tax & Salary',
      icon: <Calculator className="w-5 h-5" />,
      items: ['Income Tax Calc', 'HRA Exemption', 'Advance Tax', 'Gratuity Calculator', 'Bonus Calculator', 'TDS Calculator']
    },
    {
      id: 'emi-loans',
      title: 'EMI & Loans',
      icon: <CreditCard className="w-5 h-5" />,
      items: ['Home Loan EMI', 'Personal Loan EMI', 'Car Loan EMI', 'Education Loan', 'Provident Fund']
    },
    {
      id: 'investments',
      title: 'Investments',
      icon: <TrendingUp className="w-5 h-5" />,
      items: ['SIP Calculator', 'Lumpsum', 'PPF Calculator', 'NPS Calculator', 'FD Calculator', 'RD Calculator', 'CAGR Calculator', 'Goal Planning']
    },
    {
      id: 'insurance',
      title: 'Insurance & Protection',
      icon: <Shield className="w-5 h-5" />,
      items: ['Health Insurance', 'Term Insurance']
    },
    {
      id: 'gst-business',
      title: 'GST & Business',
      icon: <Briefcase className="w-5 h-5" />,
      items: ['GST Calculator', 'Break-Even Point']
    }
  ];

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-navy-dark border-r border-gray-200 dark:border-gray-800 overflow-y-auto overflow-x-hidden transition-colors duration-300 z-40">
      <div className="flex flex-col min-h-full">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 mb-6 flex-shrink-0 bg-white/80 dark:bg-navy-dark/80 backdrop-blur-md sticky top-0 z-10">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-2xl font-bold text-navy-dark dark:text-white hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/20">
              <span className="text-white text-sm italic">VK</span>
            </div>
            VKCalc.in
          </button>
          <p className="text-[10px] text-amber-600 dark:text-amber-500 font-bold mt-1 uppercase tracking-[0.2em]">Tax Calculator</p>
        </div>

        <div className="px-4 pb-6 flex-1">
          <h3 className="px-4 mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
            TOOL CATEGORIES
          </h3>

          <div className="space-y-1">
            {categories.map((category) => {
              const isExpanded = expandedCategories.includes(category.id);

              return (
                <div key={category.id} className="mb-2">
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${isExpanded
                        ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`${isExpanded ? 'text-amber-600 dark:text-amber-400' : 'text-gray-400 dark:text-gray-500'}`}>
                        {category.icon}
                      </div>
                      <span className="font-bold text-sm tracking-tight">{category.title}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="mt-1 ml-4 space-y-1 border-l-2 border-amber-100 dark:border-amber-900/30 animate-in slide-in-from-left-2 duration-300">
                      {category.items.map((item) => (
                        <button
                          key={item}
                          className="w-full text-left px-8 py-2.5 rounded-r-xl text-xs font-bold transition-all duration-200 text-gray-500 dark:text-gray-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50/50 dark:hover:bg-amber-900/10"
                        >
                          {item}
                        </button>
                      ))}

                      {/* AdSense Placeholder after category items */}
                      <div className="mx-2 my-6 p-3 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20 group/ad cursor-pointer hover:border-amber-500/30 transition-colors">
                        <div className="text-[9px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-tighter mb-1.5 group-hover/ad:text-amber-500 transition-colors">Advertisement</div>
                        <div className="h-20 bg-white dark:bg-gray-800/50 rounded-lg flex items-center justify-center text-[10px] text-gray-300 dark:text-gray-700 font-bold border border-gray-100 dark:border-gray-800">
                          300 × 250
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4 mt-auto sticky bottom-0 bg-white dark:bg-navy-dark border-t border-gray-100 dark:border-gray-800">
          <div className="rounded-2xl bg-blue-50 dark:bg-navy-glow/30 p-4 border border-blue-100 dark:border-blue-900/20 group cursor-pointer hover:border-amber-500/30 transition-colors">
            <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tighter mb-2">SPONSORED</p>
            <div className="h-24 bg-white dark:bg-gray-900/50 rounded-xl flex items-center justify-center text-gray-300 dark:text-gray-700 text-[10px] font-bold border-2 border-dashed border-gray-200 dark:border-gray-800 group-hover:border-amber-500/30 transition-colors">
              AD SPACE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
