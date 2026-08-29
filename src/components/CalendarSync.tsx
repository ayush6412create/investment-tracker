import React from 'react';
import { Calendar, CheckCircle, RefreshCw, LogOut, AlertTriangle } from 'lucide-react';
import { GoogleCalendarConfig } from '../types';
import { User as FirebaseUser } from 'firebase/auth';

interface CalendarSyncProps {
  config: GoogleCalendarConfig;
  onConnect: () => void;
  onDisconnect: () => void;
  onSyncAll: () => void;
  isSyncing: boolean;
  currentUser: FirebaseUser | null;
}

export default function CalendarSync({
  config,
  onConnect,
  onDisconnect,
  onSyncAll,
  isSyncing,
  currentUser,
}: CalendarSyncProps) {
  const isConnected = !!config.accessToken && !!config.expiresAt && config.expiresAt > Date.now();

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden" id="google-calendar-sync-panel">
      {/* Small top glowing background */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-400" />
          Google Calendar Sync
        </h2>
        {isConnected ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-3.5 h-3.5" />
            Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            Not Synced
          </span>
        )}
      </div>

      <p className="text-xs text-slate-300 mb-6 leading-relaxed">
        Sync maturity dates (FD / RD / Mutual Funds) and check-up reviews directly to your personal Google Calendar as automatic reminders.
      </p>

      {isConnected ? (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 flex items-center gap-3">
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={currentUser.displayName || 'Google User'}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full border border-slate-750"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center font-bold text-slate-950 text-sm">
                {(currentUser?.displayName || 'G')[0]}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">
                {currentUser?.displayName || 'Google Account'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {currentUser?.email || 'Connected'}
              </p>
              <p className="text-[9px] text-emerald-450 font-bold mt-1">
                Synced & Authenticated
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onSyncAll}
              disabled={isSyncing}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-extrabold text-xs transition-all duration-300 cursor-pointer shadow-lg shadow-emerald-500/10"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync All to Calendar'}
            </button>

            <button
              onClick={onDisconnect}
              className="p-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-rose-450 transition-all cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-200 space-y-1.5 leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              Calendar Sync Required
            </div>
            <p className="text-[11px] text-slate-400">
              Authenticate via OAuth below to seamlessly connect your investment dates and maturity checkpoints to Google Calendar.
            </p>
          </div>

          <button
            onClick={onConnect}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs transition duration-300 cursor-pointer shadow-lg shadow-white/5 active:scale-[0.98]"
          >
            <svg className="w-4 h-4 mr-1 shrink-0" viewBox="0 0 24 24" fill="none">
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
            Sign in with Google
          </button>
        </div>
      )}
    </div>
  );
}
