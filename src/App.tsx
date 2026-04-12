import { useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { HistorySidebar } from '@/components/layout/HistorySidebar';
import CalculatorGrid from '@/components/Ui/CalculatorGrid';
import Footer from '@/components/layout/Footer';
import AuditPortal from '@/pages/AuditPortal';
import InterestPortal from '@/pages/InterestPortal';
import { ClientDatabase } from './components/layout/ClientDatabase';
import FeedbackPage from './pages/FeedbackPage';
import HelpPage from './pages/HelpPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CourtFeesCalculator from './pages/CourtFeesCalculator';
import TotalTaxSaved from './pages/dashboard/TotalTaxSaved';
import { LoanPortal } from './pages/LoanPortal';
import { TaxAnalytics } from './components/layout/TaxAnalytics';
import { SettingsPage } from './pages/SettingsPage';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { HistoryProvider } from '@/context/HistoryContext';
import AuthModal from '@/components/AuthModal';
import AiAssistant from '@/components/AiAssistant';
import { LogOut, MessageCircle, Sun, Moon } from 'lucide-react';

function AppContent() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [isDark, setIsDark] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [isRightSidebarHovered, setIsRightSidebarHovered] = useState(false);
  const { user, signOut } = useAuth();
  const toggleTheme = () => setIsDark(prev => !prev);

  const rightSidebarExpanded = isRightSidebarOpen || isRightSidebarHovered;

  return (
    <div
      className={`relative min-h-screen w-full transition-colors duration-500 ${isDark ? 'dark bg-slate-900' : 'bg-slate-50'}`}
    >
      {/* Dark Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed bottom-8 right-8 z-[100] w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {isDark ? (
          <Sun className="text-amber-500 w-6 h-6 group-hover:rotate-45 transition-transform duration-500" />
        ) : (
          <Moon className="text-blue-600 w-6 h-6 group-hover:-rotate-12 transition-transform duration-500" />
        )}
      </button>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {showAI && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[200] backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-2xl h-[80vh] mx-4 overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 relative">
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-0 z-10">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Tax Assistant</h2>
              <button
                onClick={() => setShowAI(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-red-500 hover:text-white text-gray-500 dark:text-gray-400 transition-all shadow-sm"
                title="Close Assistant"
              >
                ✕
              </button>
            </div>
            <div className="h-[calc(80vh-88px)] overflow-y-auto">
              <AiAssistant onContactTrigger={() => { setShowAI(false); setCurrentView('contact'); }} />
            </div>
          </div>
        </div>
      )}

      {/* Three-column flex layout with collapsible sidebars */}
      <div className="flex min-h-screen w-full pt-[108px] pb-12 overflow-x-hidden">
        {/* Left Sidebar (collapsible) */}
        <aside
          className={`flex-shrink-0 transition-all duration-300 ${isLeftSidebarOpen ? 'w-64' : 'w-16'} h-[calc(100vh-108px)] z-40 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-gray-800 fixed left-0 top-[108px] overflow-y-auto shadow-sm`}
        >
          <button
            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-50 border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 shadow-sm"
            onClick={() => setIsLeftSidebarOpen(open => !open)}
            title={isLeftSidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            <span className="text-gray-500 font-bold">{isLeftSidebarOpen ? '❮' : '❯'}</span>
          </button>
          <Sidebar onNavigate={setCurrentView} collapsed={!isLeftSidebarOpen} />
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
          {/* Header */}
          <Header onNavigate={setCurrentView} />

          {/* Auth Bar - with responsive margins */}
          <div
            className="bg-blue-50/50 dark:bg-gray-800/50 border-b border-blue-100 dark:border-gray-700 px-6 py-2 backdrop-blur-sm sticky top-[108px] z-30 transition-all duration-300"
            style={{
              marginLeft: isLeftSidebarOpen ? '16rem' : '4rem',
              marginRight: rightSidebarExpanded ? '20rem' : '4rem'
            }}
          >
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowAI(true)}
                  className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  <MessageCircle size={16} />
                  AI Assistant
                </button>
              </div>
              <div className="flex items-center gap-4">
                {user ? (
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {user.email}
                    </span>
                    <button
                      onClick={signOut}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 text-sm font-bold transition-colors border border-red-200 dark:border-red-800"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAuth(true)}
                    className="px-6 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold transition-all shadow-md hover:shadow-lg active:scale-95"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>

          <main
            className="flex-1 p-4 md:p-8 transition-all duration-300"
            style={{
              marginLeft: isLeftSidebarOpen ? '16rem' : '4rem',
              marginRight: rightSidebarExpanded ? '20rem' : '4rem'
            }}
          >
            <div
              className="max-w-6xl w-full mx-auto"
              style={{
                minWidth: 320,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {/* Dashboard / Grid View */}
              {currentView === 'home' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <CalculatorGrid isDark={isDark} onNavigate={setCurrentView} />
                </div>
              )}
              {currentView === 'income-tax' && <div className="animate-in fade-in duration-500"><AuditPortal /></div>}
              {currentView === 'court-fees' && <div className="animate-in fade-in duration-500"><CourtFeesCalculator /></div>}
              {currentView === 'interest-calc' && <div className="animate-in fade-in duration-500"><InterestPortal /></div>}
              {currentView === 'loan-calc' && <div className="animate-in fade-in duration-500"><LoanPortal /></div>}
              {currentView === 'database' && (
                <div className="space-y-10 animate-in fade-in duration-500">
                  <div className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl">
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight mb-2">Tax Gap Intelligence</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-8">Admin Insight: Visualizing the delta between Old and New Regimes across your practice.</p>
                    <div className="h-64 flex items-end gap-4 px-4 border-b border-slate-100 dark:border-slate-700">
                      {[45, 78, 32, 90, 56, 82, 40].map((val, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                          <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-t-xl relative overflow-hidden" style={{ height: '100%' }}>
                            <div className="absolute bottom-0 left-0 w-full bg-blue-600 rounded-t-xl transition-all duration-1000 group-hover:bg-blue-500" style={{ height: `${val}%` }}></div>
                            <div className="absolute bottom-0 left-0 w-full bg-emerald-400/40 rounded-t-xl" style={{ height: `${val * 0.7}%` }}></div>
                          </div>
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Batch {i + 1}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center gap-8 mt-6">
                      <div className="flex items-center gap-2"><span className="w-3 h-3 bg-blue-600 rounded-full"></span><span className="text-[10px] font-black text-slate-500">OLD TAX</span></div>
                      <div className="flex items-center gap-2"><span className="w-3 h-3 bg-emerald-400 rounded-full"></span><span className="text-[10px] font-black text-slate-500">NEW TAX</span></div>
                    </div>
                  </div>
                  <TotalTaxSaved />
                  <div className="flex justify-between items-end">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Client Audit Database</h2>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">Manage and re-export saved tax reports</p>
                    </div>
                  </div>
                  <ClientDatabase />
                </div>
              )}
              {currentView === 'settings' && <div className="animate-in fade-in duration-500"><SettingsPage /></div>}
              {currentView === 'feedback' && <div className="animate-in fade-in duration-500"><FeedbackPage /></div>}
              {currentView === 'help' && <div className="animate-in fade-in duration-500"><HelpPage /></div>}
              {currentView === 'about' && <div className="animate-in fade-in duration-500"><AboutPage /></div>}
              {currentView === 'contact' && <div className="animate-in fade-in duration-500"><ContactPage /></div>}
              {currentView === 'analytics' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Practice Analytics</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Insights based on your saved audit history</p>
                  </div>
                  <TaxAnalytics />
                </div>
              )}
            </div>
          </main>

          {/* Footer - truly full width spanning sidebar gaps */}
          <div className="w-full relative z-20">
            <Footer onNavigate={setCurrentView} />
          </div>
        </div>

        {/* Right Sidebar (collapsible) */}
        <aside
          onMouseEnter={() => setIsRightSidebarHovered(true)}
          onMouseLeave={() => setIsRightSidebarHovered(false)}
          className={`flex-shrink-0 transition-all duration-300 ${rightSidebarExpanded ? 'w-80' : 'w-16'} h-[calc(100vh-108px)] z-40 bg-white dark:bg-slate-900 border-l border-gray-200 dark:border-gray-800 fixed right-0 top-[108px] overflow-y-auto shadow-sm`}
        >
          <button
            className="absolute top-2 left-2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-50 border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 shadow-sm"
            onClick={() => setIsRightSidebarOpen(open => !open)}
            title={isRightSidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            <span className="text-gray-500 font-bold">{rightSidebarExpanded ? '❯' : '❮'}</span>
          </button>
          <HistorySidebar collapsed={!rightSidebarExpanded} onNavigate={setCurrentView} />
        </aside>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <HistoryProvider>
        <AppContent />
      </HistoryProvider>
    </AuthProvider>
  );
}

export default App;