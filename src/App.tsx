import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Layers, 
  Calendar as CalendarIcon, 
  Calculator, 
  RefreshCw, 
  TrendingUp, 
  User, 
  Sparkles,
  CreditCard,
  Settings,
  HelpCircle,
  BookOpen
} from 'lucide-react';

import { Investment, GoogleCalendarConfig } from './types';
import Dashboard from './components/Dashboard';
import InvestmentList from './components/InvestmentList';
import InvestmentForm from './components/InvestmentForm';
import CalendarView from './components/CalendarView';
import Calculators from './components/Calculators';
import CalendarSync from './components/CalendarSync';
import KnowledgeHub from './components/KnowledgeHub';
import { syncMaturityEvent, syncReviewEvent } from './utils/calendarService';
import { initAuth, googleSignIn, logout as firebaseLogout } from './utils/firebaseAuth';
import { User as FirebaseUser } from 'firebase/auth';
import { testFirestoreConnection, fetchUserInvestments, saveUserInvestment, deleteUserInvestment } from './utils/firebaseDb';

// Default initial seed data so the user loads into a highly visually satisfying dashboard
const INITIAL_SEED_INVESTMENTS: Investment[] = [
  {
    id: 'seed-fd-1',
    type: 'FD',
    name: 'HDFC Fixed Deposit - Safekeeping',
    principal: 15000,
    rate: 7.25,
    startDate: '2025-01-20',
    maturityDate: '2026-07-20',
    compoundingFrequency: 'quarterly',
    status: 'active',
    notes: 'Locked in for 1.5 years. Earns high interest rate. Redeem or reinvest into mutual funds upon maturity.'
  },
  {
    id: 'seed-sip-1',
    type: 'Mutual Fund',
    name: 'Vanguard Index Fund S&P 500',
    principal: 8500,
    rate: 10.5,
    startDate: '2024-06-15',
    reviewDate: '2026-06-30',
    monthlyContribution: 350,
    compoundingFrequency: 'monthly',
    status: 'active',
    notes: 'Compounding growth, moderate risk. Review performance semi-annually.'
  },
  {
    id: 'seed-stock-1',
    type: 'Stock',
    name: 'Tesla Inc. (TSLA) Equity Growth',
    principal: 6000,
    rate: 14.8,
    startDate: '2024-03-10',
    reviewDate: '2026-07-25',
    compoundingFrequency: 'yearly',
    status: 'active',
    notes: 'Bought at low average. Keep eye on quarterly balance sheet. Adjust weight if auto targets met.'
  },
  {
    id: 'seed-gold-1',
    type: 'Gold',
    name: 'Sovereign Bullion Reserve',
    principal: 4500,
    rate: 6.1,
    startDate: '2023-11-05',
    maturityDate: '2026-08-10',
    compoundingFrequency: 'yearly',
    status: 'active',
    notes: 'Tax-free sovereign interest bond. Safe capital hedge.'
  }
];

export default function App() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'ASSETS' | 'CALENDAR' | 'CALCULATORS' | 'LEARN'>('DASHBOARD');
  
  // Managing Add/Edit state
  const [showForm, setShowForm] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);

  // Google Calendar Integration State
  const [calendarConfig, setCalendarConfig] = useState<GoogleCalendarConfig>({
    clientId: '',
    accessToken: null,
    expiresAt: null
  });
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [isSyncingId, setIsSyncingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string, type: 'success' | 'info' | 'error' } | null>(null);

  // Local-to-cloud sync and loader helper
  const syncUserInvestmentsOnLogin = async (user: FirebaseUser, currentLocal: Investment[]) => {
    try {
      const cloudInvestments = await fetchUserInvestments(user.uid);
      if (cloudInvestments.length > 0) {
        setInvestments(cloudInvestments);
        localStorage.setItem('investment_tracker_data', JSON.stringify(cloudInvestments));
        showToast(`Hi ${user.displayName || 'Investor'}, loaded your dashboard from Google account!`, 'success');
      } else if (currentLocal.length > 0) {
        showToast('Saving current offline achievements to Google Cloud...', 'info');
        for (const inv of currentLocal) {
          await saveUserInvestment(user.uid, inv);
        }
        showToast(`Synced ${currentLocal.length} investments to your Google account!`, 'success');
      }
    } catch (err) {
      console.error('Error syncing investments on login:', err);
    }
  };

  // Load from local storage or set seeds and setup auth listener
  useEffect(() => {
    testFirestoreConnection();

    const saved = localStorage.getItem('investment_tracker_data');
    let initialInvestments: Investment[] = [];
    if (saved) {
      try {
        initialInvestments = JSON.parse(saved);
        setInvestments(initialInvestments);
      } catch (e) {
        initialInvestments = INITIAL_SEED_INVESTMENTS;
        setInvestments(INITIAL_SEED_INVESTMENTS);
      }
    } else {
      initialInvestments = INITIAL_SEED_INVESTMENTS;
      setInvestments(INITIAL_SEED_INVESTMENTS);
      localStorage.setItem('investment_tracker_data', JSON.stringify(INITIAL_SEED_INVESTMENTS));
    }

    const unsubscribe = initAuth(
      async (user, token) => {
        setCurrentUser(user);
        setCalendarConfig(prev => ({
          ...prev,
          accessToken: token,
          expiresAt: Date.now() + 3500 * 1000,
        }));
        await syncUserInvestmentsOnLogin(user, initialInvestments);
      },
      () => {
        setCurrentUser(null);
        setCalendarConfig(prev => ({
          ...prev,
          accessToken: null,
          expiresAt: null,
        }));
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Save changes helper
  const saveToLocal = (newInvestments: Investment[]) => {
    setInvestments(newInvestments);
    localStorage.setItem('investment_tracker_data', JSON.stringify(newInvestments));
  };

  // Toast notifier
  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleGoogleConnect = async () => {
    try {
      const result = await googleSignIn();
      if (result) {
        setCurrentUser(result.user);
        setCalendarConfig(prev => ({
          ...prev,
          accessToken: result.accessToken,
          expiresAt: Date.now() + 3500 * 1000,
        }));
        showToast('Successfully authenticated and synced Google Account!', 'success');
        await syncUserInvestmentsOnLogin(result.user, investments);
      }
    } catch (err: any) {
      console.error(err);
      showToast(err?.message || 'Failed to sync Google Account.', 'error');
    }
  };

  const handleGoogleDisconnect = async () => {
    try {
      await firebaseLogout();
      setCurrentUser(null);
      setCalendarConfig(prev => ({
        ...prev,
        accessToken: null,
        expiresAt: null,
      }));
      showToast('Successfully disconnected Google account.', 'info');
    } catch (err: any) {
      console.error(err);
      showToast('Error during disconnect', 'error');
    }
  };

  // Adding / Editing save logic
  const handleSaveInvestment = async (formData: Omit<Investment, 'id'> & { id?: string }) => {
    let updatedInv: Investment;
    let nextInvestments: Investment[];

    if (formData.id) {
      // Edit mode
      const current = investments.find(inv => inv.id === formData.id);
      updatedInv = { ...current, ...formData } as Investment;
      nextInvestments = investments.map(inv => inv.id === formData.id ? updatedInv : inv);
    } else {
      // Create mode
      updatedInv = {
        ...formData,
        id: `inv-${Date.now()}`
      } as Investment;
      nextInvestments = [...investments, updatedInv];
    }

    setInvestments(nextInvestments);
    localStorage.setItem('investment_tracker_data', JSON.stringify(nextInvestments));

    if (currentUser) {
      try {
        await saveUserInvestment(currentUser.uid, updatedInv);
      } catch (err) {
        console.error('Error writing to Firestore:', err);
        showToast('Saved locally, but error syncing with cloud.', 'error');
      }
    }

    showToast(formData.id ? `Successfully updated ${formData.name}` : `Successfully added ${formData.name}`);
    setShowForm(false);
    setEditingInvestment(null);
  };

  const handleDeleteInvestment = async (id: string) => {
    const nextInvestments = investments.filter(inv => inv.id !== id);
    setInvestments(nextInvestments);
    localStorage.setItem('investment_tracker_data', JSON.stringify(nextInvestments));

    if (currentUser) {
      try {
        await deleteUserInvestment(currentUser.uid, id);
      } catch (err) {
        console.error('Error deleting from Firestore:', err);
        showToast('Deleted locally, but error syncing with cloud.', 'error');
      }
    }

    showToast('Investment tracking deleted', 'info');
  };

  // Sync a single investment to Google Calendar
  const handleSyncOneInvestment = async (investment: Investment) => {
    const token = calendarConfig.accessToken;
    if (!token || (calendarConfig.expiresAt && Date.now() > calendarConfig.expiresAt)) {
      showToast('OAuth Access token expired. Please connect again.', 'error');
      return;
    }

    setIsSyncingId(investment.id);
    try {
      let updatedInv = { ...investment };
      
      // Sync maturity date
      if (investment.maturityDate) {
        const eventId = await syncMaturityEvent(investment, token);
        updatedInv.googleEventId = eventId;
      }
      
      // Sync review date
      if (investment.reviewDate) {
        const reviewEventId = await syncReviewEvent(investment, token);
        updatedInv.reviewGoogleEventId = reviewEventId;
      }

      const updatedList = investments.map(inv => inv.id === investment.id ? updatedInv : inv);
      setInvestments(updatedList);
      localStorage.setItem('investment_tracker_data', JSON.stringify(updatedList));

      if (currentUser) {
        await saveUserInvestment(currentUser.uid, updatedInv);
      }

      showToast(`Synced "${investment.name}" successfully with Google Calendar!`);
    } catch (err: any) {
      console.error(err);
      showToast(err?.message || 'Sync failed. Check API permissions.', 'error');
    } finally {
      setIsSyncingId(null);
    }
  };

  // Bulk Sync All investments to Google Calendar
  const handleSyncAllInvestments = async () => {
    const token = calendarConfig.accessToken;
    if (!token || (calendarConfig.expiresAt && Date.now() > calendarConfig.expiresAt)) {
      showToast('Google credentials expired. Please reconnect.', 'error');
      return;
    }

    setIsSyncingAll(true);
    let successCount = 0;
    let failedCount = 0;
    const tempInvestments = [...investments];

    for (let i = 0; i < tempInvestments.length; i++) {
      const inv = tempInvestments[i];
      if (inv.maturityDate || inv.reviewDate) {
        try {
          let updatedInv = { ...inv };
          if (inv.maturityDate) {
            updatedInv.googleEventId = await syncMaturityEvent(inv, token);
          }
          if (inv.reviewDate) {
            updatedInv.reviewGoogleEventId = await syncReviewEvent(inv, token);
          }
          tempInvestments[i] = updatedInv;
          
          if (currentUser) {
            await saveUserInvestment(currentUser.uid, updatedInv);
          }
          
          successCount++;
        } catch (e) {
          failedCount++;
        }
      }
    }

    setInvestments(tempInvestments);
    localStorage.setItem('investment_tracker_data', JSON.stringify(tempInvestments));

    if (failedCount > 0) {
      showToast(`Synced ${successCount} assets. ${failedCount} elements failed. check client origins.`, 'info');
    } else {
      showToast(`Successfully synced ${successCount} assets to Google Calendar!`);
    }
    setIsSyncingAll(false);
  };

  const isGoogleConnected = !!calendarConfig.accessToken && 
                             !!calendarConfig.expiresAt && 
                             calendarConfig.expiresAt > Date.now();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-400">
      
      {/* Toast Notification HUD */}
      {toastMessage && (
        <div className={`fixed top-5 right-5 z-50 p-4.5 rounded-2xl shadow-2xl border text-xs font-semibold max-w-sm flex items-center gap-2.5 animate-bounce
          ${toastMessage.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : ''}
          ${toastMessage.type === 'info' ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : ''}
          ${toastMessage.type === 'error' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : ''}
        `}>
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Main Header */}
      <header className="border-b border-slate-850 bg-slate-900/50 backdrop-blur sticky top-0 z-40 px-4 py-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Logo & Headline */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-black text-xl select-none">
              Σ
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 leading-none flex flex-wrap items-center gap-2">
                InvesTrack Pro
                <span className="text-[10px] select-none font-black tracking-widest px-2.5 py-1 rounded-full bg-gradient-to-r from-indigo-500/20 to-pink-500/20 hover:from-indigo-500/30 hover:to-pink-500/30 text-indigo-200 border border-indigo-500/30 shadow-sm shadow-indigo-500/10 transition-all duration-300">
                  AYUSH SINGH
                </span>
              </h1>
              <p className="text-[10px] text-slate-400 mt-1.5">Unified asset tracking & calendar automations</p>
            </div>
          </div>

          {/* Tab Selection */}
          <nav className="flex items-center gap-1 sm:gap-1.5 bg-slate-950/70 p-1 sm:p-1.5 rounded-2xl border border-slate-800 self-stretch sm:self-center overflow-x-auto w-full sm:w-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <button
              onClick={() => { setActiveTab('DASHBOARD'); setShowForm(false); }}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-extrabold cursor-pointer flex items-center gap-1.5 transition-all duration-300 flex-shrink-0
                ${activeTab === 'DASHBOARD' 
                  ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/20 scale-[1.03]' 
                  : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              Dashboard
            </button>
            <button
              onClick={() => { setActiveTab('ASSETS'); }}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-extrabold cursor-pointer flex items-center gap-1.5 transition-all duration-300 flex-shrink-0
                ${activeTab === 'ASSETS' 
                  ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/20 scale-[1.03]' 
                  : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Layers className="w-3.5 h-3.5" />
              Portfolio
            </button>
            <button
              onClick={() => { setActiveTab('CALENDAR'); setShowForm(false); }}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-extrabold cursor-pointer flex items-center gap-1.5 transition-all duration-300 flex-shrink-0
                ${activeTab === 'CALENDAR' 
                  ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/20 scale-[1.03]' 
                  : 'text-slate-400 hover:text-slate-200'}`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              Calendar
            </button>
            <button
              onClick={() => { setActiveTab('CALCULATORS'); setShowForm(false); }}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-extrabold cursor-pointer flex items-center gap-1.5 transition-all duration-300 flex-shrink-0
                ${activeTab === 'CALCULATORS' 
                  ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/20 scale-[1.03]' 
                  : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Calculator className="w-3.5 h-3.5" />
              Calculators
            </button>
            <button
              onClick={() => { setActiveTab('LEARN'); setShowForm(false); }}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-extrabold cursor-pointer flex items-center gap-1.5 transition-all duration-300 flex-shrink-0
                ${activeTab === 'LEARN' 
                  ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/20 scale-[1.03]' 
                  : 'text-slate-400 hover:text-slate-200'}`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Learn Academy
            </button>
          </nav>

          {/* User Sign In HUD */}
          <div className="flex items-center gap-3 self-center sm:self-auto">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="hidden md:block text-right">
                  <p className="text-[9px] bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400 font-extrabold uppercase tracking-widest leading-none">
                    Investor Connected
                  </p>
                  <p className="text-xs font-black text-white mt-0.5">
                    {currentUser.displayName || 'Google User'}
                  </p>
                </div>
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full border border-emerald-500 shadow-md shadow-emerald-500/20"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 border border-emerald-400 flex items-center justify-center text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/20 select-none">
                    {(currentUser.displayName || 'U')[0].toUpperCase()}
                  </div>
                )}
                <button
                  onClick={handleGoogleDisconnect}
                  className="text-[10px] uppercase font-black text-slate-400 hover:text-rose-400 transition-colors border border-slate-800 hover:border-rose-950/40 px-2.5 py-1.5 rounded-xl bg-slate-900/50 cursor-pointer"
                  title="Sign Out"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleConnect}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-xs transition duration-350 cursor-pointer shadow-md shadow-white/5 active:scale-[0.98]"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 12-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign In
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="flex-grow p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-6">

        {activeTab === 'LEARN' ? (
          <KnowledgeHub />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              
              {showForm ? (
                <InvestmentForm
                  onSave={handleSaveInvestment}
                  editingInvestment={editingInvestment}
                  onCancel={() => { setShowForm(false); setEditingInvestment(null); }}
                />
              ) : null}

              {activeTab === 'DASHBOARD' && (
                <div className="space-y-6">
                  <Dashboard investments={investments} />
                  <CalendarView investments={investments} hideMilestoneNavigator />
                </div>
              )}

              {activeTab === 'ASSETS' && (
                <InvestmentList
                  investments={investments}
                  onEdit={(inv) => { setEditingInvestment(inv); setShowForm(true); }}
                  onDelete={handleDeleteInvestment}
                  onSyncOne={handleSyncOneInvestment}
                  isSyncingId={isSyncingId}
                  onAddClick={() => { setEditingInvestment(null); setShowForm(true); }}
                  isGoogleConnected={isGoogleConnected}
                />
              )}

              {activeTab === 'CALENDAR' && (
                <CalendarView investments={investments} />
              )}

              {activeTab === 'CALCULATORS' && (
                <Calculators />
              )}
            </div>

            {/* Side Panels: Settings, Tutorial / Google auth persistent connector */}
            <div className="lg:col-span-4 space-y-6">
              <CalendarSync
                config={calendarConfig}
                onConnect={handleGoogleConnect}
                onDisconnect={handleGoogleDisconnect}
                onSyncAll={handleSyncAllInvestments}
                isSyncing={isSyncingAll}
                currentUser={currentUser}
              />

              {/* Quick Action Guide / Advice tips based on selection */}
              <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 shadow-lg space-y-4">
                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" />
                  Portfolio Best Practices
                </h3>
                <div className="space-y-3.5 text-xs text-slate-350 leading-relaxed">
                  <p>
                    💡 <strong className="text-white">Emergency Liquidity</strong>: Keep at least 20% of your portfolios in easily redeemable short-term FDs or liquid capital assets.
                  </p>
                  <p>
                    📈 <strong className="text-white">Review Cycles</strong>: Leverage the "Review Alert" date on stocks and mutual funds to periodically checks valuations and re-balance risks.
                  </p>
                  <p>
                    📆 <strong className="text-white">Calendar Automation</strong>: Authenticate securely with Google above to map your investments and review milestones directly to Google Calendar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Visual background atmospheric elements */}
      <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full bg-indigo-500/5 blur-3xl -z-10 pointer-events-none" />
      <div className="fixed top-20 right-0 w-80 h-80 rounded-full bg-emerald-500/5 blur-3xl -z-10 pointer-events-none" />

      {/* Simple styled footer as requested */}
      <footer className="border-t border-slate-900 py-6 text-center text-[10px] text-slate-500 uppercase tracking-widest flex items-center justify-center gap-1.5 bg-slate-950 font-medium">
        <span>Investment Tracker Suite</span>
        <span>•</span>
        <span>{new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}</span>
      </footer>

    </div>
  );
}
