import { useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { HistorySidebar } from '@/components/layout/HistorySidebar';
import CalculatorGrid from '@/components/Ui/CalculatorGrid';
import Footer from '@/components/layout/Footer';
import AuditPortal from '@/pages/AuditPortal';
import InterestPortal from '@/pages/InterestPortal';
import { ClientDatabase } from './components/layout/ClientDatabase';
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
  const { user, signOut } = useAuth();
  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <div onDoubleClick={toggleTheme} className={`flex h-screen ${isDark ? 'dark bg-slate-900' : 'bg-slate-50'}`}>
      {/* Auth Modal */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      {/* AI Assistant Modal */}
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

      {/* Sidebar */}
      <Sidebar onNavigate={setCurrentView} />

      <div className="flex-1 flex flex-col overflow-hidden">
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

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Dashboard / Grid View */}
            {currentView === 'home' && (
              <CalculatorGrid isDark={isDark} onNavigate={setCurrentView} />
            )}

            {/* Income Tax Calculator */}
            {currentView === 'income-tax' && <AuditPortal />}

            {/* Interest Calculator */}
            {currentView === 'interest-calc' && <InterestPortal />}

            {/* Loan Calculator */}
            {currentView === 'loan-calc' && <LoanPortal />}

            {/* Client Database View */}
            {currentView === 'database' && (
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Client Audit Database</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Manage and re-export saved tax reports</p>
                  </div>
                </div>
                <ClientDatabase />
              </div>
            )}

            {/* Settings Page */}
            {currentView === 'settings' && <SettingsPage />}

            {/* Analytics Route */}
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

        {/* Footer */}
        <Footer />
      </div>

      {/* History Sidebar */}
      <HistorySidebar />
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