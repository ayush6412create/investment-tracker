import React, { useState, useEffect } from 'react';
import { PlusCircle, HelpCircle, AlertCircle, Percent, IndianRupee, Calendar as CalendarIcon, Tag, Check } from 'lucide-react';
import { Investment, InvestmentType } from '../types';

interface InvestmentFormProps {
  onSave: (investment: Omit<Investment, 'id'> & { id?: string }) => void;
  editingInvestment: Investment | null;
  onCancel: () => void;
}

export default function InvestmentForm({
  onSave,
  editingInvestment,
  onCancel,
}: InvestmentFormProps) {
  const [type, setType] = useState<InvestmentType>('FD');
  const [name, setName] = useState('');
  const [principal, setPrincipal] = useState<number | ''>('');
  const [rate, setRate] = useState<number | ''>('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [maturityDate, setMaturityDate] = useState('');
  const [reviewDate, setReviewDate] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState<number | ''>('');
  const [compoundingFrequency, setCompoundingFrequency] = useState<Investment['compoundingFrequency']>('quarterly');
  const [status, setStatus] = useState<Investment['status']>('active');
  const [notes, setNotes] = useState('');

  // Hydrate fields if editing
  useEffect(() => {
    if (editingInvestment) {
      setType(editingInvestment.type);
      setName(editingInvestment.name);
      setPrincipal(editingInvestment.principal);
      setRate(editingInvestment.rate);
      setStartDate(editingInvestment.startDate);
      setMaturityDate(editingInvestment.maturityDate || '');
      setReviewDate(editingInvestment.reviewDate || '');
      setMonthlyContribution(editingInvestment.monthlyContribution ?? '');
      setCompoundingFrequency(editingInvestment.compoundingFrequency);
      setStatus(editingInvestment.status);
      setNotes(editingInvestment.notes);
    } else {
      // Reset form defaults
      setName('');
      setPrincipal('');
      setRate('');
      setStartDate(new Date().toISOString().split('T')[0]);
      setMaturityDate('');
      setReviewDate('');
      setMonthlyContribution('');
      setCompoundingFrequency('quarterly');
      setStatus('active');
      setNotes('');
    }
  }, [editingInvestment]);

  // Adjust default compounding & requirements based on investment type
  useEffect(() => {
    if (!editingInvestment) {
      if (type === 'Stock' || type === 'Mutual Fund') {
        setCompoundingFrequency('yearly');
      } else if (type === 'FD' || type === 'RD') {
        setCompoundingFrequency('quarterly');
      }
    }
  }, [type, editingInvestment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !principal || rate === '') return;

    onSave({
      id: editingInvestment?.id,
      type,
      name,
      principal: Number(principal),
      rate: Number(rate),
      startDate,
      maturityDate: maturityDate ? maturityDate : undefined,
      reviewDate: reviewDate ? reviewDate : undefined,
      monthlyContribution: monthlyContribution !== '' ? Number(monthlyContribution) : undefined,
      compoundingFrequency,
      status,
      notes,
    });
  };

  const getAccentColor = () => {
    switch (type) {
      case 'FD': return 'border-indigo-500/50 focus:border-indigo-400';
      case 'RD': return 'border-sky-500/50 focus:border-sky-400';
      case 'Stock': return 'border-emerald-500/50 focus:border-emerald-400';
      case 'Mutual Fund': return 'border-pink-500/50 focus:border-pink-400';
      case 'Gold': return 'border-amber-500/50 focus:border-amber-400';
      case 'Real Estate': return 'border-purple-500/50 focus:border-purple-400';
      default: return 'border-slate-500/50 focus:border-slate-400';
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden" id="investment-add-edit-form">
      {/* Visual background gradient glow based on selection */}
      <div className={`absolute -right-20 -top-20 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-500
        ${type === 'FD' ? 'bg-indigo-500' : ''}
        ${type === 'RD' ? 'bg-sky-500' : ''}
        ${type === 'Stock' ? 'bg-emerald-500' : ''}
        ${type === 'Mutual Fund' ? 'bg-pink-500' : ''}
        ${type === 'Gold' ? 'bg-amber-500' : ''}
        ${type === 'Real Estate' ? 'bg-purple-500' : ''}
        ${type === 'Other' ? 'bg-slate-500' : ''}
      `} />

      <h3 className="text-lg font-bold text-white mb-5">
        {editingInvestment ? '✏️ Edit Investment' : '🎯 Track New Investment'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Investment Type Picker */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Category</label>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
            {(['FD', 'RD', 'Stock', 'Mutual Fund', 'Gold', 'Real Estate', 'Other'] as InvestmentType[]).map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setType(t)}
                className={`py-1.5 px-1 rounded-xl text-xs font-medium border text-center transition cursor-pointer
                  ${type === t 
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-md shadow-emerald-500/10' 
                    : 'bg-slate-850 hover:bg-slate-800 border-slate-750 text-slate-300'
                  }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Investment Name & Principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Investment Name</label>
            <input
              type="text"
              required
              placeholder="e.g. HDFC Fixed Deposit, Tesla Stock"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-2 bg-slate-850 border rounded-xl text-white text-sm focus:outline-none transition ${getAccentColor()}`}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Initial Invested Capital (₹)
            </label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
              <input
                type="number"
                required
                min="1"
                placeholder="0.00"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value !== '' ? Number(e.target.value) : '')}
                className={`w-full pl-9 pr-4 py-2 bg-slate-850 border rounded-xl text-white text-sm focus:outline-none transition ${getAccentColor()}`}
              />
            </div>
          </div>
        </div>

        {/* Growth/Return rate & Monthly SIP/RD if applicable */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Annual Interest / Return Rate (%)
            </label>
            <div className="relative">
              <Percent className="absolute right-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
              <input
                type="number"
                required
                step="0.01"
                min="0"
                max="100"
                placeholder="e.g. 7.10, 12.0"
                value={rate}
                onChange={(e) => setRate(e.target.value !== '' ? Number(e.target.value) : '')}
                className={`w-full pl-4 pr-9 py-2 bg-slate-850 border rounded-xl text-white text-sm focus:outline-none transition ${getAccentColor()}`}
              />
            </div>
          </div>

          {(type === 'RD' || type === 'Mutual Fund') ? (
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Monthly Deposit / SIP Contribution (₹)
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="number"
                  placeholder="e.g. 500"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value !== '' ? Number(e.target.value) : '')}
                  className={`w-full pl-9 pr-4 py-2 bg-slate-850 border rounded-xl text-white text-sm focus:outline-none transition ${getAccentColor()}`}
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Compounding Freq.</label>
              <select
                value={compoundingFrequency}
                onChange={(e) => setCompoundingFrequency(e.target.value as any)}
                className={`w-full px-4 py-2 bg-slate-900 border rounded-xl text-white text-sm focus:outline-none transition cursor-pointer ${getAccentColor()}`}
              >
                <option value="monthly" className="bg-slate-900 text-white font-medium py-2">Monthly</option>
                <option value="quarterly" className="bg-slate-900 text-white font-medium py-2">Quarterly (Standard)</option>
                <option value="half-yearly" className="bg-slate-900 text-white font-medium py-2">Half Yearly</option>
                <option value="yearly" className="bg-slate-900 text-white font-medium py-2">Yearly (Annual)</option>
              </select>
            </div>
          )}
        </div>

        {/* Dates selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Start Date</label>
            <div className="relative">
              <CalendarIcon className="absolute right-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`w-full pl-4 pr-9 py-2 bg-slate-850 border rounded-xl text-white text-sm focus:outline-none transition ${getAccentColor()}`}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1">
              Maturity Date
              <span className="text-[10px] text-slate-500">(Optional)</span>
            </label>
            <div className="relative">
              <CalendarIcon className="absolute right-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="date"
                value={maturityDate}
                onChange={(e) => setMaturityDate(e.target.value)}
                className={`w-full pl-4 pr-9 py-2 bg-slate-850 border rounded-xl text-white text-sm focus:outline-none transition ${getAccentColor()}`}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1">
              Review Date
              <span className="text-[10px] text-slate-500">(Stocks, Funds checkup)</span>
            </label>
            <div className="relative">
              <CalendarIcon className="absolute right-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="date"
                value={reviewDate}
                onChange={(e) => setReviewDate(e.target.value)}
                className={`w-full pl-4 pr-9 py-2 bg-slate-850 border rounded-xl text-white text-sm focus:outline-none transition ${getAccentColor()}`}
              />
            </div>
          </div>
        </div>

        {/* Notes and Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Interactive Notes / Comments</label>
            <input
              type="text"
              placeholder="e.g. Lock-in 3 years. Exit load applies if withdrawn early."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 bg-slate-850 border border-slate-750 focus:border-slate-600 rounded-xl text-slate-100 text-sm focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Investment Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className={`w-full px-4 py-2 bg-slate-900 border rounded-xl text-white text-sm focus:outline-none transition cursor-pointer ${getAccentColor()}`}
            >
              <option value="active" className="bg-slate-900 text-white font-medium py-2">Active (Earning)</option>
              <option value="matured" className="bg-slate-900 text-white font-medium py-2">Matured</option>
              <option value="reviewed" className="bg-slate-900 text-white font-medium py-2">Reviewed</option>
            </select>
          </div>
        </div>

        {/* Submit controls */}
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-850">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-slate-750 hover:bg-slate-850 rounded-xl text-slate-300 text-xs font-semibold transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5 shadow-lg shadow-emerald-500/15 transition"
          >
            <Check className="w-4 h-4" />
            {editingInvestment ? 'Save Changes' : 'Record Asset'}
          </button>
        </div>
      </form>
    </div>
  );
}
