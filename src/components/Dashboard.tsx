import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TrendingUp, Award, Clock, PiggyBank, Bell, AlertTriangle, ArrowUpRight, DollarSign } from 'lucide-react';
import { Investment } from '../types';

interface DashboardProps {
  investments: Investment[];
}

const getTenureYears = (inv: Investment): number => {
  if (!inv.startDate) return 1.0;
  const start = new Date(inv.startDate);
  const end = inv.maturityDate ? new Date(inv.maturityDate) : (inv.reviewDate ? new Date(inv.reviewDate) : null);
  if (!end || isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 1.0;
  }
  const diffTime = end.getTime() - start.getTime();
  const years = diffTime / (1000 * 60 * 60 * 24 * 365.25);
  return Math.max(0.1, years);
};

export default function Dashboard({ investments }: DashboardProps) {
  // Compute individual asset durations and find the maximum (longest) asset period
  const maxTenure = useMemo(() => {
    if (investments.length === 0) return 1.0;
    const tenures = investments.map(getTenureYears);
    return Math.max(...tenures);
  }, [investments]);

  // Compute portfolio aggregates with tenure-aligned compounding
  const stats = useMemo(() => {
    let totalPrincipal = 0;
    let expectedFutureValue = 0;
    let activeCount = 0;
    let stockMutualFundsValue = 0;
    
    investments.forEach((inv) => {
      totalPrincipal += inv.principal;
      
      const r = inv.rate / 100;
      const tenureYears = getTenureYears(inv);
      let futureVal = inv.principal;

      if (inv.type === 'RD' || inv.type === 'Mutual Fund') {
        const monthlyContrib = inv.monthlyContribution || 0;
        const monthlyRate = r / 12;
        const totalMonths = Math.round(tenureYears * 12);
        
        // Compound initial principal and inject periodic monthly contributions up to maturity
        futureVal = inv.principal * Math.pow(1 + monthlyRate, totalMonths);
        for (let m = 1; m <= totalMonths; m++) {
          futureVal = (futureVal + monthlyContrib) * (1 + monthlyRate);
        }
      } else {
        // Standard compound interest based on compounding frequency
        let n = 1; // yearly
        if (inv.compoundingFrequency === 'monthly') n = 12;
        else if (inv.compoundingFrequency === 'quarterly') n = 4;
        else if (inv.compoundingFrequency === 'half-yearly') n = 2;

        futureVal = inv.principal * Math.pow(1 + r / n, n * tenureYears);
      }

      expectedFutureValue += futureVal;
      if (inv.status === 'active') activeCount++;
      if (inv.type === 'Stock' || inv.type === 'Mutual Fund') {
        stockMutualFundsValue += inv.principal;
      }
    });

    const profit = Math.max(0, expectedFutureValue - totalPrincipal);

    return {
      totalPrincipal,
      expectedFutureValue,
      profit,
      activeCount,
      stockValueRate: totalPrincipal > 0 ? (stockMutualFundsValue / totalPrincipal) * 100 : 0,
    };
  }, [investments]);

  // Prep allocation pie chart
  const allocationData = useMemo(() => {
    const counts: Record<string, number> = {};
    investments.forEach((inv) => {
      counts[inv.type] = (counts[inv.type] || 0) + inv.principal;
    });

    return Object.entries(counts).map(([type, amount]) => ({
      name: type,
      value: amount,
    }));
  }, [investments]);

  // Color map for investments
  const COLORS: Record<string, string> = {
    FD: '#6366f1', // Indigo
    RD: '#0ea5e9', // Sky
    Stock: '#10b981', // Emerald
    'Mutual Fund': '#ec4899', // Pink
    Gold: '#f59e0b', // Amber
    'Real Estate': '#a855f7', // Purple
    Other: '#64748b', // Slate
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Maturing soon or upcoming milestones, sorted from first maturing (earliest) to last maturing (latest)
  const upcomingMilestones = useMemo(() => {
    return [...investments]
      .filter((inv) => (inv.maturityDate || inv.reviewDate) && inv.status === 'active')
      .sort((a, b) => {
        const dateA = a.maturityDate || a.reviewDate || '';
        const dateB = b.maturityDate || b.reviewDate || '';
        return dateA.localeCompare(dateB);
      });
  }, [investments]);

  const growthRate = useMemo(() => {
    return stats.totalPrincipal > 0
      ? ((stats.expectedFutureValue - stats.totalPrincipal) / stats.totalPrincipal) * 105
      : 0;
  }, [stats]);

  return (
    <div className="space-y-6" id="dashboard-financial-suite">
      
      {/* Dynamic Bento Aggregates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        
        {/* Total portfolio Net Worth style card (Gradient & Glow) */}
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 rounded-3xl p-4 sm:p-6 border border-indigo-500/30 shadow-2xl relative overflow-hidden group md:col-span-2">
          {/* Subtle logo vector outline in background */}
          <div className="absolute -bottom-6 -right-6 text-white/5 opacity-10 select-none pointer-events-none group-hover:scale-110 transition duration-500">
            <svg width="140" height="140" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 16.5c0 .38-.21.71-.53.88l-7.97 4.44c-.31.17-.66.17-.97 0l-7.97-4.44c-.31-.17-.53-.5-.53-.88v-9c0-.38.21-.71.53-.88l7.97-4.44c.31-.17.66-.17.97 0l7.97 4.44c.31.17.53.5.53.88v9z"/>
            </svg>
          </div>
          
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
            Estimated Portfolio Value ({maxTenure % 1 === 0 ? maxTenure.toFixed(0) : maxTenure.toFixed(1)}-Yr)
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-1.5 tracking-tight">
            {formatCurrency(stats.expectedFutureValue)}
          </h2>
          
          <div className="flex items-center gap-2 mt-4 text-emerald-400 font-bold text-sm">
            <TrendingUp className="w-4.5 h-4.5" />
            <span>↑ {growthRate.toFixed(1)}% Yield</span>
            <span className="text-xs text-slate-550 font-normal">Est. profit: +{formatCurrency(stats.profit)}</span>
          </div>
        </div>

        {/* Total portfolio principal input */}
        <div className="bg-gradient-to-tr from-emerald-950/40 via-slate-900 to-slate-950/90 rounded-3xl p-4 sm:p-6 border border-emerald-500/20 hover:border-emerald-500/40 transition duration-300 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-8 -top-8 w-16 h-16 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Principal Invested</p>
            <p className="text-2xl font-black text-emerald-450 tracking-tight mt-1.5">{formatCurrency(stats.totalPrincipal)}</p>
          </div>
          <p className="text-[10px] text-slate-500 mt-3 flex items-center gap-1">
            <PiggyBank className="w-3.5 h-3.5 text-emerald-400" />
            Sum of initial allocations
          </p>
        </div>

        {/* Active Accounts counter */}
        <div className="bg-gradient-to-tr from-sky-950/40 via-slate-900 to-slate-950/90 rounded-3xl p-4 sm:p-6 border border-sky-500/20 hover:border-sky-500/40 transition duration-300 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-8 -top-8 w-16 h-16 rounded-full bg-sky-500/10 blur-xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Asset Holdings</p>
              <span className="w-2.5 h-2.5 bg-sky-400 rounded-full animate-pulse shadow shadow-sky-400/50"></span>
            </div>
            <p className="text-2xl font-black text-sky-400 tracking-tight mt-1.5">{stats.activeCount} Active</p>
          </div>
          <p className="text-[10px] text-slate-500 mt-3 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            Earning dynamic yield Reminders
          </p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Bento: Asset Allocation Pie */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 sm:p-6 rounded-3xl lg:col-span-8 flex flex-col justify-between shadow-xl">
          <div>
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <span className="p-1.5 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg text-white text-xs select-none shadow">📊</span>
              Asset Mix & Capital Allocation
            </h3>
            <p className="text-xs text-slate-450 mt-1">Diversification ratios sorted by capital footprint</p>
          </div>

          {allocationData.length === 0 ? (
            <div className="py-20 text-center text-slate-500 text-xs">
              Add some investments to construct your asset footprint.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mt-6">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={allocationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {allocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#64748b'} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                      itemStyle={{ color: '#fff', fontSize: 11 }}
                      formatter={(v: number) => [formatCurrency(v), 'Cap footprint']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Custom descriptive legend panel */}
              <div className="space-y-2.5">
                {allocationData.map((item, idx) => {
                  const percentage = stats.totalPrincipal > 0 ? (item.value / stats.totalPrincipal) * 100 : 0;
                  return (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-850/40 border border-slate-800/80 hover:bg-slate-850/60 transition duration-200">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[item.name] || '#64748b' }} />
                        <span className="text-xs font-semibold text-slate-350">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-white font-bold">{formatCurrency(item.value)}</span>
                        <span className="text-[10px] text-slate-500 block">({percentage.toFixed(0)}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Bento: Milestone warnings and Actions */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 sm:p-6 rounded-3xl lg:col-span-4 flex flex-col justify-between shadow-xl">
          <div>
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <span className="p-1.5 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg text-white text-xs select-none shadow">🔔</span>
              Strategic Agenda
            </h3>
            <p className="text-xs text-slate-450 mt-1">Calendar milestones queued for action</p>
          </div>

          {upcomingMilestones.length === 0 ? (
            <div className="py-14 text-center text-slate-500 text-xs">
              No upcoming dates for maturity or reviews in active queue.
            </div>
          ) : (
            <div className="space-y-3 mt-6">
              {upcomingMilestones.map((inv, idx) => (
                <div key={idx} className="p-3 bg-slate-850/50 rounded-2xl border border-slate-800 flex items-start gap-3 hover:border-slate-700 transition animate-in fade-in slide-in-from-bottom duration-300">
                  <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 mt-0.5 text-sm select-none">
                    {inv.type === 'FD' || inv.type === 'Gold' ? '📅' : '🔍'}
                  </span>
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-xs font-bold text-slate-200 truncate">{inv.name}</p>
                      <span 
                        className="px-1.5 py-0.5 text-[8px] font-extrabold rounded-md shrink-0 uppercase tracking-widest leading-none whitespace-nowrap" 
                        style={{ 
                          backgroundColor: `${COLORS[inv.type] || '#64748b'}15`, 
                          border: `1px solid ${COLORS[inv.type] || '#64748b'}30`, 
                          color: COLORS[inv.type] || '#fff' 
                        }}
                      >
                        {inv.type}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-450 font-medium">
                      {inv.maturityDate ? `Maturity: ${inv.maturityDate}` : `Review: ${inv.reviewDate}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 p-4 bg-indigo-950/20 rounded-2xl border border-indigo-500/10 text-xs text-slate-400 italic">
            💡 "Review Tesla holding if it drops below ₹13,000. Consider shifting MF dividend to growth option by Q4."
          </div>
        </div>

      </div>
    </div>
  );
}
