import React, { useState } from 'react';
import { Search, Filter, CalendarCheck, Edit, Trash2, ChevronRight, FileText, Calendar, Plus, MessageSquare } from 'lucide-react';
import { Investment, InvestmentType } from '../types';
import { projectInvestmentReturns } from '../utils/calculations';

interface InvestmentListProps {
  investments: Investment[];
  onEdit: (investment: Investment) => void;
  onDelete: (id: string) => void;
  onSyncOne: (investment: Investment) => void;
  isSyncingId: string | null;
  onAddClick: () => void;
  isGoogleConnected: boolean;
}

export default function InvestmentList({
  investments,
  onEdit,
  onDelete,
  onSyncOne,
  isSyncingId,
  onAddClick,
  isGoogleConnected,
}: InvestmentListProps) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const filtered = investments.filter((inv) => {
    const matchesSearch = inv.name.toLowerCase().includes(search.toLowerCase()) || 
                          inv.notes.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'ALL' || inv.type === filterType;
    const matchesStatus = filterStatus === 'ALL' || inv.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getBadgeStyles = (type: InvestmentType) => {
    switch (type) {
      case 'FD': return 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30';
      case 'RD': return 'bg-sky-500/15 text-sky-400 border border-sky-500/30';
      case 'Stock': return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
      case 'Mutual Fund': return 'bg-pink-500/15 text-pink-400 border border-pink-500/30';
      case 'Gold': return 'bg-amber-500/15 text-amber-400 border border-amber-500/30';
      case 'Real Estate': return 'bg-purple-500/15 text-purple-400 border border-purple-500/30';
      default: return 'bg-slate-500/15 text-slate-400 border border-slate-500/30';
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-4" id="investment-list-root">
      {/* List Header and quick actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Investments Portfolio</h2>
          <p className="text-xs text-slate-400">{filtered.length} recorded assets matching filters</p>
        </div>

        <button
          onClick={onAddClick}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 font-bold text-xs text-slate-950 rounded-xl transition shadow-lg shadow-emerald-500/10 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Asset
        </button>
      </div>

      {/* Grid Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assets or notes..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-800 rounded-2xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-slate-700 transition"
          />
        </div>

        {/* Filter Type */}
        <div className="relative">
          <Filter className="absolute left-3.5 top-3 w-4 h-4 text-slate-505" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-sm text-slate-300 focus:outline-none focus:border-slate-705 transition appearance-none cursor-pointer"
          >
            <option value="ALL" className="bg-slate-900 text-white">All Categories</option>
            <option value="FD" className="bg-slate-900 text-white">Fixed Deposits (FD)</option>
            <option value="RD" className="bg-slate-900 text-white">Recurring Deposits (RD)</option>
            <option value="Stock" className="bg-slate-900 text-white">Stocks</option>
            <option value="Mutual Fund" className="bg-slate-900 text-white">Mutual Funds</option>
            <option value="Gold" className="bg-slate-900 text-white">Gold</option>
            <option value="Real Estate" className="bg-slate-900 text-white">Real Estate</option>
            <option value="Other" className="bg-slate-900 text-white">Other</option>
          </select>
        </div>

        {/* Filter Status */}
        <div className="relative">
          <Filter className="absolute left-3.5 top-3 w-4 h-4 text-slate-505" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-sm text-slate-300 focus:outline-none focus:border-slate-705 transition appearance-none cursor-pointer"
          >
            <option value="ALL" className="bg-slate-900 text-white">All Statuses</option>
            <option value="active" className="bg-slate-900 text-white">Active</option>
            <option value="matured" className="bg-slate-900 text-white">Matured</option>
            <option value="reviewed" className="bg-slate-900 text-white">Reviewed</option>
          </select>
        </div>
      </div>

      {/* Asset Grid list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-3xl">
          <FileText className="w-8 h-8 text-slate-700 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-350">No investments recorded yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Get started by recording your FDs, Stocks, or Mutual funds to build this portfolio tracker!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((inv) => {
            const isSyncingThis = isSyncingId === inv.id;
            const projections = projectInvestmentReturns(inv);
            return (
              <div
                key={inv.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 p-5 rounded-3xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all duration-200 relative overflow-hidden group shadow-lg"
              >
                {/* Lateral Category Color Ribbon */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1.5 
                  ${inv.type === 'FD' ? 'bg-indigo-500' : ''}
                  ${inv.type === 'RD' ? 'bg-sky-500' : ''}
                  ${inv.type === 'Stock' ? 'bg-emerald-500' : ''}
                  ${inv.type === 'Mutual Fund' ? 'bg-pink-500' : ''}
                  ${inv.type === 'Gold' ? 'bg-amber-500' : ''}
                  ${inv.type === 'Real Estate' ? 'bg-purple-500' : ''}
                  ${inv.type === 'Other' ? 'bg-slate-400' : ''}`}
                />

                {/* Left Side: Summary and rates */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 pl-1">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getBadgeStyles(inv.type)}`}>
                        {inv.type}
                      </span>
                      <span className={`inline-block w-2 h-2 rounded-full 
                        ${inv.status === 'active' ? 'bg-emerald-400 shadow-sm shadow-emerald-400/20' : ''}
                        ${inv.status === 'matured' ? 'bg-indigo-400' : ''}
                        ${inv.status === 'reviewed' ? 'bg-amber-400' : ''}`}
                      />
                      <span className="text-[11px] capitalize text-slate-400">{inv.status}</span>
                    </div>

                    <h4 className="text-md font-bold text-white group-hover:text-emerald-400 transition">
                      {inv.name}
                    </h4>

                    {/* Meta Dates indicators */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2.5">
                      <div className="flex items-center gap-1 text-slate-400 text-xs">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>Started: <strong className="text-slate-300 font-medium">{inv.startDate}</strong></span>
                      </div>

                      {inv.maturityDate && (
                        <div className="flex items-center gap-1 text-slate-400 text-xs">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>Matures: <strong className="text-indigo-400 font-medium">{inv.maturityDate}</strong></span>
                        </div>
                      )}

                      {inv.reviewDate && (
                        <div className="flex items-center gap-1 text-slate-400 text-xs">
                          <CalendarCheck className="w-3.5 h-3.5 text-slate-500" />
                          <span>Review: <strong className="text-amber-400 font-medium">{inv.reviewDate}</strong></span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Center Side: Rates & Calculations value with dynamic projections */}
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-y-4 gap-x-6 lg:text-right py-2 lg:py-0 border-y border-slate-850/50 lg:border-none lg:pl-10 flex-grow">
                  <div>
                    <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-0.5">Invested Principal</p>
                    <p className="text-sm font-extrabold text-slate-100">{formatCurrency(inv.principal)}</p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-0.5">Rate of Yield</p>
                    <p className="text-sm font-extrabold text-emerald-400">+{inv.rate}% p.a.</p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase text-slate-505 font-bold tracking-wider mb-0.5">Contribution</p>
                    <p className={`text-sm font-extrabold ${inv.monthlyContribution ? 'text-sky-400' : 'text-slate-500 font-medium'}`}>
                      {inv.monthlyContribution ? `${formatCurrency(inv.monthlyContribution)}/mo` : 'Lump Sum'}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase text-indigo-400 font-bold tracking-wider mb-0.5">Est. Maturity Amount</p>
                    <p className="text-sm font-extrabold text-indigo-300">
                      {formatCurrency(projections.maturityValue)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase text-emerald-400 font-bold tracking-wider mb-0.5">Estimated Profit</p>
                    <p className="text-sm font-black text-emerald-450">
                      +{formatCurrency(projections.estimatedProfit)}
                    </p>
                  </div>
                </div>

                {/* Right Side: Actions & Calendar Sync trigger */}
                <div className="flex items-center justify-end gap-2 shrink-0 self-end lg:self-auto">
                  {/* Google Calendar sync state indicators */}
                  {isGoogleConnected && (inv.maturityDate || inv.reviewDate) && (
                    <button
                      onClick={() => onSyncOne(inv)}
                      disabled={isSyncingThis}
                      className={`p-2 rounded-xl border text-xs font-semibold inline-flex items-center gap-1 transition-all cursor-pointer
                        ${inv.googleEventId || inv.reviewGoogleEventId 
                          ? 'bg-slate-850 text-emerald-400 border-emerald-500/20 hover:bg-slate-800' 
                          : 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-md shadow-emerald-500/10'
                        } disabled:opacity-50`}
                      title={inv.googleEventId || inv.reviewGoogleEventId ? 'Synced (Update Calendar)' : 'Sync to Calendar'}
                    >
                      <CalendarCheck className={`w-4 h-4 ${isSyncingThis ? 'animate-spin' : ''}`} />
                      <span className="hidden sm:inline">
                        {inv.googleEventId || inv.reviewGoogleEventId ? 'Synced' : 'Sync Cal'}
                      </span>
                    </button>
                  )}

                  {/* Edit Button */}
                  <button
                    onClick={() => onEdit(inv)}
                    className="p-2 bg-slate-850 hover:bg-slate-800 border border-slate-755 text-slate-300 hover:text-white rounded-xl transition cursor-pointer"
                    title="Edit asset details"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  {/* Delete Button */}
                  {pendingDeleteId === inv.id ? (
                    <div className="flex items-center gap-1.5 bg-rose-950/20 p-1 border border-rose-500/30 rounded-xl animate-pulse">
                      <button
                        onClick={() => {
                          onDelete(inv.id);
                          setPendingDeleteId(null);
                        }}
                        className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[11px] font-bold transition-all cursor-pointer"
                        title="Confirm deletion"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setPendingDeleteId(null)}
                        className="px-2 py-1.5 bg-slate-800 hover:bg-slate-705 text-slate-300 hover:text-white rounded-lg text-[11px] font-semibold transition-all cursor-pointer"
                        title="Cancel"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setPendingDeleteId(inv.id)}
                      className="p-2 bg-slate-850 hover:bg-slate-800 border border-slate-755 text-slate-400 hover:text-red-400 rounded-xl transition cursor-pointer"
                      title="Delete item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Sticky note display inside element */}
                {inv.notes && (
                  <div className="absolute bottom-1 right-3 opacity-15 hover:opacity-100 transition duration-300 hidden md:flex items-center gap-1 pointer-events-none">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[10px] text-slate-400 max-w-xs truncate">{inv.notes}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
