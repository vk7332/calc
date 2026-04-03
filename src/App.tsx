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
import TotalTaxSaved from './components/Dashboard/TotalTaxSaved';
import { LoanPortal } from './pages/LoanPortal';
import { TaxAnalytics } from './components/layout/TaxAnalytics';
import { SettingsPage } from './pages/SettingsPage';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { HistoryProvider } from '@/context/HistoryContext';
import AuthModal from '@/components/AuthModal';
import AiAssistant from '@/components/AiAssistant';
import { LogOut, MessageCircle } from 'lucide-react';

function AppContent() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [isDark, setIsDark] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const { user, signOut } = useAuth();
  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <div
      onDoubleClick={toggleTheme}
      className={`relative min-h-screen w-full ${isDark ? 'dark bg-slate-900' : 'bg-slate-50'}`}
    >
      {/* DEBUG BANNER - REMOVE IN PRODUCTION */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999, background: '#f59e42', color: '#222', padding: '6px', fontWeight: 'bold', textAlign: 'center' }}>
        DEBUG: currentView = {currentView}
      </div>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {showAI && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-2xl h-[80vh] mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Tax Assistant</h2>
              <button
                onClick={() => setShowAI(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            <AiAssistant />
          </div>
        </div>
      )}

      {/* Three-column flex layout with collapsible sidebars */}
      <div className="flex h-full w-full">
        {/* Left Sidebar (collapsible) */}
        <div className={`flex-shrink-0 transition-all duration-300 ${isLeftSidebarOpen ? 'w-64' : 'w-12'} h-full z-10 bg-white border-r border-gray-200 fixed left-0 top-24`} style={{ height: 'calc(100vh - 96px)' }}>
          <button
            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
            onClick={() => setIsLeftSidebarOpen(open => !open)}
            title={isLeftSidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            <span className="text-gray-500">{isLeftSidebarOpen ? '<' : '>'}</span>
          </button>
          <Sidebar onNavigate={setCurrentView} collapsed={!isLeftSidebarOpen} />
        </div>

        {/* Main Content (center, scrollable) */}
        <div className="flex-1 flex flex-col min-w-0 ml-0" style={{ marginLeft: isLeftSidebarOpen ? 256 : 48, marginRight: isRightSidebarOpen ? 320 : 48, transition: 'margin 0.3s' }}>
          {/* Header */}
          <Header onNavigate={setCurrentView} />

          {/* Auth Bar */}
          <div className="bg-blue-50 dark:bg-gray-800 border-b border-blue-100 dark:border-gray-700 px-6 py-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowAI(true)}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  <MessageCircle size={16} />
                  AI Assistant
                </button>
              </div>
              <div className="flex items-center gap-4">
                {user ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Welcome, {user.email}
                    </span>
                    <button
                      onClick={signOut}
                      className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAuth(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>

          <main className="flex-1 p-2 md:p-4">
            <div
              className="max-w-5xl w-full mx-auto"
              style={{
                minWidth: 320,
                transform: 'scale(0.88)',
                transformOrigin: 'top center',
                transition: 'transform 0.3s',
              }}
            >
              {/* Dashboard / Grid View */}
              {currentView === 'home' && (
                <>
                  <div style={{ color: 'red', fontWeight: 'bold' }}>TEST: Main Content Loaded</div>
                  <CalculatorGrid isDark={isDark} onNavigate={setCurrentView} />
                </>
              )}
              {currentView === 'income-tax' && <AuditPortal />}
              {currentView === 'interest-calc' && <InterestPortal />}
              {currentView === 'loan-calc' && <LoanPortal />}
              {currentView === 'database' && (
                <div className="space-y-6">
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
              {currentView === 'settings' && <SettingsPage />}
              {currentView === 'feedback' && <FeedbackPage />}
              {currentView === 'help' && <HelpPage />}
              {currentView === 'about' && <AboutPage />}
              {currentView === 'analytics' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Practice Analytics</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Insights based on your saved audit history</p>
                  </div>
                  <TaxAnalytics />
                </div>
              )}
            </div>
          </main>
          <div className="max-w-5xl w-full mx-auto"><Footer /></div>
        </div>

        {/* Right Sidebar (collapsible) */}
        <div className={`flex-shrink-0 transition-all duration-300 ${isRightSidebarOpen ? 'w-80' : 'w-12'} h-full z-10 bg-white border-l border-gray-200 fixed right-0 top-24`} style={{ height: 'calc(100vh - 96px)' }}>
          <button
            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
            onClick={() => setIsRightSidebarOpen(open => !open)}
            title={isRightSidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            <span className="text-gray-500">{isRightSidebarOpen ? '>' : '<'}</span>
          </button>
          <HistorySidebar collapsed={!isRightSidebarOpen} />
        </div>
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