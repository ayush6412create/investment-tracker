import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Bell, MessageSquare, AlertCircle, FileText, Sparkles } from 'lucide-react';
import { Investment } from '../types';

interface CalendarViewProps {
  investments: Investment[];
  onSelectInvestment?: (investment: Investment) => void;
  hideMilestoneNavigator?: boolean;
}

export default function CalendarView({
  investments,
  onSelectInvestment,
  hideMilestoneNavigator,
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [selectedDay, setSelectedDay] = useState<number | null>(() => {
    return new Date().getDate();
  });

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    setSelectedDay(null);
  };

  // Helper to get formatted date string (YYYY-MM-DD)
  const formatDateString = (day: number) => {
    const yyyy = currentYear;
    const mm = String(currentMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Gather all alerts matching a selected date
  const selectedDateStr = selectedDay ? formatDateString(selectedDay) : '';
  const dayAlerts = investments.flatMap((inv) => {
    const matches: Array<{ type: 'MATURITY' | 'REVIEW'; asset: Investment }> = [];
    if (inv.maturityDate === selectedDateStr) {
      matches.push({ type: 'MATURITY', asset: inv });
    }
    if (inv.reviewDate === selectedDateStr) {
      matches.push({ type: 'REVIEW', asset: inv });
    }
    return matches;
  });

  // Check if a day has any events
  const getDayEvents = (day: number) => {
    const dStr = formatDateString(day);
    return investments.flatMap((inv) => {
      const results = [];
      if (inv.maturityDate === dStr) results.push({ type: 'FD/RD Maturity', color: 'bg-indigo-400' });
      if (inv.reviewDate === dStr) results.push({ type: 'Review Action', color: 'bg-amber-400' });
      return results;
    });
  };

  // Compile all chronological milestones
  const allMilestones = React.useMemo(() => {
    const list: Array<{
      id: string;
      type: 'MATURITY' | 'REVIEW';
      date: string;
      assetName: string;
      assetType: string;
    }> = [];

    investments.forEach((inv) => {
      if (inv.maturityDate) {
        list.push({
          id: `${inv.id}-maturity`,
          type: 'MATURITY',
          date: inv.maturityDate,
          assetName: inv.name,
          assetType: inv.type,
        });
      }
      if (inv.reviewDate) {
        list.push({
          id: `${inv.id}-review`,
          type: 'REVIEW',
          date: inv.reviewDate,
          assetName: inv.name,
          assetType: inv.type,
        });
      }
    });

    // Sort chronologically by date
    return list.sort((a, b) => a.date.localeCompare(b.date));
  }, [investments]);

  // Jump calendar to specific milestone date
  const handleJumpToMilestone = (dateStr: string) => {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const yyyy = parseInt(parts[0], 10);
      const mm = parseInt(parts[1], 10) - 1;
      const dd = parseInt(parts[2], 10);
      setCurrentDate(new Date(yyyy, mm, 1));
      setSelectedDay(dd);
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden" id="interactive-calendar-workspace">
      {/* Decorative top ambient color glows */}
      <div className="absolute top-0 left-1/4 w-96 h-24 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-24 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Calendar Grid */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            {/* Calendar Header Controls */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-md font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-450 via-sky-400 to-indigo-400 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                  Investment Schedule
                </h3>
                <p className="text-xs text-slate-450">Track maturities and strategic reviews in real-time</p>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrevMonth}
                  className="p-1.5 hover:bg-slate-850 text-slate-300 rounded-lg transition border border-slate-800 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-white px-3 py-1 bg-slate-850 rounded-lg min-w-28 text-center select-none border border-slate-800">
                  {months[currentMonth]} {currentYear}
                </span>
                <button
                  onClick={handleNextMonth}
                  className="p-1.5 hover:bg-slate-850 text-slate-300 rounded-lg transition border border-slate-800 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Weekdays names */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 select-none">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Pad leading days of previous month */}
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`p-${i}`} className="aspect-square bg-slate-900/10 rounded-xl" />
              ))}

              {/* In-Month days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const hasSelected = selectedDay === day;
                const events = getDayEvents(day);
                const dStr = formatDateString(day);
                const systemToday = new Date();
                const isToday = currentYear === systemToday.getFullYear() && currentMonth === systemToday.getMonth() && day === systemToday.getDate();

                // Colors derived from events on that specific calendar cell
                const dayHasMaturity = events.some(e => e.type === 'FD/RD Maturity');
                const dayHasReview = events.some(e => e.type === 'Review Action');

                let dayStyles = 'bg-slate-850/40 border-slate-850 hover:bg-slate-800 hover:border-slate-750 text-slate-200';
                if (hasSelected) {
                  dayStyles = 'bg-gradient-to-br from-emerald-400 to-teal-500 border-emerald-400 text-slate-950 font-black shadow-lg shadow-emerald-500/20';
                } else if (isToday) {
                  dayStyles = 'bg-slate-800 border-emerald-500 text-white font-bold ring-2 ring-emerald-500/30';
                } else if (dayHasMaturity && dayHasReview) {
                  dayStyles = 'bg-purple-950/50 border-purple-500/50 text-purple-200 font-bold hover:bg-purple-900/50 hover:border-purple-400';
                } else if (dayHasMaturity) {
                  dayStyles = 'bg-indigo-950/50 border-indigo-500/50 text-indigo-200 font-bold hover:bg-indigo-900/50 hover:border-indigo-400';
                } else if (dayHasReview) {
                  dayStyles = 'bg-amber-950/50 border-amber-500/50 text-amber-200 font-bold hover:bg-amber-900/50 hover:border-amber-400';
                }

                return (
                  <button
                    type="button"
                    key={`day-${day}`}
                    onClick={() => setSelectedDay(day)}
                    className={`aspect-square rounded-xl p-1.5 flex flex-col justify-between text-left transition relative border cursor-pointer group ${dayStyles}`}
                  >
                    <span className="text-xs">{day}</span>

                    {/* Micro color dots for tracked indicators */}
                    <div className="flex gap-1 flex-wrap self-end">
                      {events.map((ev, idx) => (
                        <span
                          key={idx}
                          className={`w-1.5 h-1.5 rounded-full ${hasSelected ? 'bg-slate-950' : ev.color}`}
                          title={ev.type}
                        />
                      ))}
                    </div>

                    {/* Tiny background highlight for today */}
                    {isToday && !hasSelected && (
                      <span className="absolute top-1 right-1 px-1 py-[1px] bg-emerald-500/15 text-emerald-400 text-[8px] rounded uppercase font-bold tracking-wider">
                        Today
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* New Milestone Navigator list row */}
          {!hideMilestoneNavigator && (
            <div className="mt-8 border-t border-slate-800/80 pt-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Milestone roadmap Navigator
              </h4>
              {allMilestones.length === 0 ? (
                <p className="text-[11px] text-slate-555 italic">Record assets with maturity/review dates to map them here.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-32 overflow-y-auto pr-1">
                  {allMilestones.map((m) => {
                    const parts = m.date.split('-');
                    const isCurrentMonthEvents = parseInt(parts[0], 10) === currentYear && (parseInt(parts[1], 10) - 1) === currentMonth;
                    const isSelectedDayFocused = selectedDay === parseInt(parts[2], 10) && isCurrentMonthEvents;

                    return (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => handleJumpToMilestone(m.date)}
                        className={`p-2 rounded-xl text-left border text-xs transition-all duration-300 flex items-center justify-between cursor-pointer
                          ${isSelectedDayFocused
                            ? 'bg-emerald-950/20 border-emerald-500 text-white shadow shadow-emerald-500/10'
                            : m.type === 'MATURITY'
                              ? 'bg-indigo-950/10 hover:bg-indigo-950/20 border-indigo-500/20 hover:border-indigo-500/40 text-slate-300'
                              : 'bg-amber-950/10 hover:bg-amber-950/20 border-amber-500/20 hover:border-amber-500/40 text-slate-300'
                          }`}
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-bold truncate text-slate-100">{m.assetName}</p>
                          <p className="text-[10px] text-slate-455 block truncate">
                            {m.assetType} • {m.date}
                          </p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0 uppercase tracking-wider
                          ${m.type === 'MATURITY' 
                            ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20' 
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/20'}`}>
                          {m.type === 'MATURITY' ? 'Matures' : 'Review'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Day inspect alert cards & Notes panel */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full bg-slate-850/40 border border-slate-800 p-4 sm:p-6 rounded-3xl">
          <div>
            <h4 className="text-sm font-semibold text-slate-350 border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>Timeline Insights</span>
              {selectedDay ? (
                <span className="text-xs text-white bg-slate-800 py-1 px-2.5 rounded-lg border border-slate-700">
                  {selectedDateStr}
                </span>
              ) : null}
            </h4>

            {dayAlerts.length === 0 ? (
              <div className="py-20 text-center text-slate-500 text-xs">
                <Bell className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                <p>No investment actions or maturities on this day.</p>
                <p className="text-[10px] text-slate-600 mt-1">Tap another day to check alerts.</p>
              </div>
            ) : (
              <div className="space-y-4 mt-4">
                {dayAlerts.map((alert, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border relative overflow-hidden transition-all duration-300
                      ${alert.type === 'MATURITY' 
                        ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-200' 
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider
                        ${alert.type === 'MATURITY' ? 'bg-indigo-500/20' : 'bg-amber-500/20'}`}>
                        {alert.type === 'MATURITY' ? '💸 Matures' : '🔍 Review Alert'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">{alert.asset.type}</span>
                    </div>

                    <h5 className="text-sm font-semibold text-white mb-1.5">{alert.asset.name}</h5>
                    <p className="text-xs text-slate-400 mb-2">
                      Principal: <strong className="text-white font-medium">₹{alert.asset.principal}</strong> at <strong className="text-emerald-400 font-semibold">{alert.asset.rate}%</strong> rate
                    </p>

                    {alert.asset.notes && (
                      <div className="mt-2.5 border-t border-slate-800/60 pt-2 text-xs text-slate-350 flex items-start gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-500" />
                        <span className="italic">"{alert.asset.notes}"</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800/60 text-[10px] text-slate-500 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Legend: <span className="text-indigo-400 font-medium">● Maturity Alert</span> | <span className="text-amber-400 font-medium">● Review Action</span></span>
          </div>
        </div>

      </div>
    </div>
  );
}
