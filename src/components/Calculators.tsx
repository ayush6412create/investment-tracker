import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Percent, IndianRupee, Calendar, TrendingUp, Compass, ArrowRightLeft } from 'lucide-react';
import { calculateReturns, calculateEMI } from '../utils/calculations';

export default function Calculators() {
  const [activeTab, setActiveTab] = useState<'RETURNS' | 'EMI'>('RETURNS');

  // Return Calculator state
  const [calcType, setCalcType] = useState<'LumpSum' | 'SIP'>('SIP');
  const [principal, setPrincipal] = useState<number>(10000);
  const [rate, setRate] = useState<number>(12);
  const [tenureYears, setTenureYears] = useState<number>(10);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(500);
  const [compoundingFrequency, setCompoundingFrequency] = useState<'monthly' | 'quarterly' | 'half-yearly' | 'yearly'>('quarterly');

  // EMI Calculator state
  const [emiPrincipal, setEmiPrincipal] = useState<number>(150000);
  const [emiRate, setEmiRate] = useState<number>(8.5);
  const [emiTenureMonths, setEmiTenureMonths] = useState<number>(180); // 15 years

  // Calculate return estimations
  const returnResult = useMemo(() => {
    return calculateReturns({
      principal,
      rate,
      tenureYears,
      type: calcType,
      monthlyContribution,
      compoundingFrequency: calcType === 'LumpSum' ? compoundingFrequency : 'yearly',
    });
  }, [principal, rate, tenureYears, calcType, monthlyContribution, compoundingFrequency]);

  // Calculate EMI estimations
  const emiResult = useMemo(() => {
    return calculateEMI({
      principal: emiPrincipal,
      rate: emiRate,
      tenureMonths: emiTenureMonths,
    });
  }, [emiPrincipal, emiRate, emiTenureMonths]);

  const COLORS = ['#10b981', '#f43f5e', '#3b82f6'];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl" id="calculators-main-workspace">
      {/* Selector Pill Headers */}
      <div className="flex bg-slate-950/60 p-1.5 rounded-2xl border border-slate-850/80 max-w-lg mb-8">
        <button
          onClick={() => setActiveTab('RETURNS')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer flex items-center justify-center gap-2.5
            ${activeTab === 'RETURNS' 
              ? 'bg-indigo-650 text-white shadow-lg shadow-indigo-500/20' 
              : 'text-slate-400 hover:text-slate-200'
            }`}
        >
          <TrendingUp className="w-4 h-4" />
          Compound Returns
        </button>
        <button
          onClick={() => setActiveTab('EMI')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer flex items-center justify-center gap-2.5
            ${activeTab === 'EMI' 
              ? 'bg-indigo-650 text-white shadow-lg shadow-indigo-500/20' 
              : 'text-slate-400 hover:text-slate-200'
            }`}
        >
          <Compass className="w-4 h-4" />
          Loan EMI
        </button>
      </div>

      {activeTab === 'RETURNS' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Left side */}
          <div className="lg:col-span-5 space-y-5">
            {/* LumpSum or SIP selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">Investment Type</label>
              <div className="flex bg-slate-850 p-1.5 rounded-xl border border-slate-800">
                <button
                  onClick={() => setCalcType('SIP')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition cursor-pointer
                    ${calcType === 'SIP' ? 'bg-emerald-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Monthly SIP (Recurring)
                </button>
                <button
                  onClick={() => setCalcType('LumpSum')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition cursor-pointer
                    ${calcType === 'LumpSum' ? 'bg-emerald-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Lumpsum (One-Time)
                </button>
              </div>
            </div>

            {/* Principal Amount */}
            <div>
              <div className="flex items-center justify-between mb-1.5 gap-2">
                <label className="text-xs font-semibold text-slate-400">
                  {calcType === 'SIP' ? 'Initial Investment (₹)' : 'Lumpsum Amount (₹)'}
                </label>
                <div className="flex items-center bg-slate-950/40 border border-slate-800 focus-within:border-emerald-500 rounded-xl px-2 py-1 transition-all">
                  <span className="text-xs text-slate-500 mr-1 font-bold">₹</span>
                  <input
                    type="number"
                    value={principal === 0 ? '' : principal}
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : Number(e.target.value);
                      setPrincipal(val);
                    }}
                    className="w-24 bg-transparent border-none text-right font-black text-xs text-white focus:outline-none p-0 outline-none"
                    placeholder="0"
                  />
                </div>
              </div>
              <input
                type="range"
                min="500"
                max="500000"
                step="500"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Monthly SIP contribution if active */}
            {calcType === 'SIP' && (
              <div>
                <div className="flex items-center justify-between mb-1.5 gap-2">
                  <label className="text-xs font-semibold text-slate-400">Monthly Contribution (₹)</label>
                  <div className="flex items-center bg-slate-950/40 border border-slate-800 focus-within:border-emerald-500 rounded-xl px-2 py-1 transition-all">
                    <span className="text-xs text-emerald-400/80 mr-1 font-bold">₹</span>
                    <input
                      type="number"
                      value={monthlyContribution === 0 ? '' : monthlyContribution}
                      onChange={(e) => {
                        const val = e.target.value === '' ? 0 : Number(e.target.value);
                        setMonthlyContribution(val);
                      }}
                      className="w-20 bg-transparent border-none text-right font-black text-xs text-emerald-400 focus:outline-none p-0 outline-none"
                      placeholder="0"
                    />
                    <span className="text-[10px] text-slate-500 ml-1 font-bold">/mo</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="50"
                  max="20000"
                  step="50"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            )}

            {/* LumpSum Compounding Frequency Selection */}
            {calcType === 'LumpSum' && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Compounding Frequency</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-850 p-1 rounded-xl border border-slate-800">
                  {(['monthly', 'quarterly', 'half-yearly', 'yearly'] as const).map((freq) => (
                    <button
                      key={freq}
                      onClick={() => setCompoundingFrequency(freq)}
                      className={`py-1.5 px-1 rounded-lg text-[10px] uppercase font-bold transition cursor-pointer text-center
                        ${compoundingFrequency === freq 
                          ? 'bg-emerald-500 text-slate-950 font-extrabold' 
                          : 'text-slate-400 hover:text-slate-250 hover:bg-slate-800/40'}`}
                    >
                      {freq.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Expected annual yield rate */}
            <div>
              <div className="flex items-center justify-between mb-1.5 gap-2">
                <label className="text-xs font-semibold text-slate-400">Expected Annual Returns Rate (%)</label>
                <div className="flex items-center bg-slate-950/40 border border-slate-800 focus-within:border-emerald-500 rounded-xl px-2 py-1 transition-all">
                  <input
                    type="number"
                    step="0.1"
                    value={rate === 0 ? '' : rate}
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : Number(e.target.value);
                      setRate(val);
                    }}
                    className="w-14 bg-transparent border-none text-right font-black text-xs text-emerald-400 focus:outline-none p-0 outline-none"
                    placeholder="0"
                  />
                  <span className="text-[10px] text-slate-500 ml-1 font-bold">% p.a.</span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Tenure duration */}
            <div>
              <div className="flex items-center justify-between mb-1.5 gap-2">
                <label className="text-xs font-semibold text-slate-400">Investment Period (Tenure)</label>
                <div className="flex items-center bg-slate-950/40 border border-slate-800 focus-within:border-emerald-500 rounded-xl px-2 py-1 transition-all">
                  <input
                    type="number"
                    value={tenureYears === 0 ? '' : tenureYears}
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : Number(e.target.value);
                      setTenureYears(val);
                    }}
                    className="w-12 bg-transparent border-none text-right font-black text-xs text-white focus:outline-none p-0 outline-none"
                    placeholder="0"
                  />
                  <span className="text-[10px] text-slate-500 ml-1 font-bold">Years</span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="40"
                step="1"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Outputs & Chart Right side */}
          <div className="lg:col-span-7 space-y-6">
            {/* High level aggregates */}
            <div className="grid grid-cols-3 gap-3.5">
              <div className="bg-slate-850/50 p-4 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1">Total Invested</p>
                <p className="text-lg font-bold text-slate-300">{formatCurrency(returnResult.investedAmount)}</p>
              </div>

              <div className="bg-slate-850/50 p-4 rounded-xl border border-slate-800 animate-pulse">
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1">Return Interest</p>
                <p className="text-lg font-bold text-emerald-400">+{formatCurrency(returnResult.estimatedReturns)}</p>
              </div>

              <div className="bg-slate-850/50 p-4 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1">Maturity Value</p>
                <p className="text-lg font-bold text-white">{formatCurrency(returnResult.totalValue)}</p>
              </div>
            </div>

            {/* Growth Over Time Chart */}
            <div className="h-64 sm:h-72 w-full">
              <p className="text-xs font-semibold text-slate-400 mb-3">Compounded Asset Valuation Over Time</p>
              <ResponsiveContainer width="100%" height="90%">
                <AreaChart data={returnResult.yearlyBreakdown} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="year" stroke="#64748b" style={{ fontSize: 11 }} />
                  <YAxis 
                    stroke="#64748b" 
                    style={{ fontSize: 11 }} 
                    tickFormatter={(v) => `₹${v >= 1000 ? (v / 1000) + 'k' : v}`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                    labelStyle={{ color: '#94a3b8', fontSize: 11, fontWeight: 'bold' }}
                    itemStyle={{ fontSize: 12, color: '#f1f5f9' }}
                    formatter={(value: number) => [formatCurrency(value), '']}
                  />
                  <Area type="monotone" name="Invested Capital" dataKey="invested" stroke="#3b82f6" fillOpacity={1} fill="url(#colorInvested)" />
                  <Area type="monotone" name="Future Net Value" dataKey="total" stroke="#10b981" fillOpacity={1} fill="url(#colorTotal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* EMI Controls */}
          <div className="lg:col-span-5 space-y-5">
            {/* Principal Amount */}
            <div>
              <div className="flex items-center justify-between mb-1.5 gap-2">
                <label className="text-xs font-semibold text-slate-400">Loan Principal Amount (₹)</label>
                <div className="flex items-center bg-slate-950/40 border border-slate-800 focus-within:border-indigo-550 rounded-xl px-2 py-1 transition-all">
                  <span className="text-xs text-slate-500 mr-1 font-bold">₹</span>
                  <input
                    type="number"
                    value={emiPrincipal === 0 ? '' : emiPrincipal}
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : Number(e.target.value);
                      setEmiPrincipal(val);
                    }}
                    className="w-24 bg-transparent border-none text-right font-black text-xs text-white focus:outline-none p-0 outline-none"
                    placeholder="0"
                  />
                </div>
              </div>
              <input
                type="range"
                min="5000"
                max="2000000"
                step="5000"
                value={emiPrincipal}
                onChange={(e) => setEmiPrincipal(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Interest Rate */}
            <div>
              <div className="flex items-center justify-between mb-1.5 gap-2">
                <label className="text-xs font-semibold text-slate-400">Interest rate (%)</label>
                <div className="flex items-center bg-slate-950/40 border border-slate-800 focus-within:border-indigo-550 rounded-xl px-2 py-1 transition-all">
                  <input
                    type="number"
                    step="0.05"
                    value={emiRate === 0 ? '' : emiRate}
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : Number(e.target.value);
                      setEmiRate(val);
                    }}
                    className="w-14 bg-transparent border-none text-right font-black text-xs text-emerald-400 focus:outline-none p-0 outline-none"
                    placeholder="0"
                  />
                  <span className="text-[10px] text-slate-500 ml-1 font-bold">% p.a.</span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="0.05"
                value={emiRate}
                onChange={(e) => setEmiRate(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Tenure months */}
            <div>
              <div className="flex items-center justify-between mb-1.5 gap-2">
                <label className="text-xs font-semibold text-slate-400">Loan Term / Tenure</label>
                <div className="flex items-center bg-slate-950/40 border border-slate-800 focus-within:border-indigo-550 rounded-xl px-2 py-1 transition-all">
                  <input
                    type="number"
                    value={emiTenureMonths === 0 ? '' : emiTenureMonths}
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : Number(e.target.value);
                      setEmiTenureMonths(val);
                    }}
                    className="w-12 bg-transparent border-none text-right font-black text-xs text-white focus:outline-none p-0 outline-none"
                    placeholder="0"
                  />
                  <span className="text-[10px] text-slate-500 ml-1 font-bold">Mo</span>
                  <span className="text-[10px] text-indigo-400 font-semibold ml-1">
                    ({emiTenureMonths ? Math.floor(emiTenureMonths / 12) : 0} yrs)
                  </span>
                </div>
              </div>
              <input
                type="range"
                min="12"
                max="360"
                step="6"
                value={emiTenureMonths}
                onChange={(e) => setEmiTenureMonths(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Amortization quick stats */}
            <div className="bg-slate-850/40 border border-slate-800 rounded-xl p-4.5 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Breakdown Summary</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-450">Monthly Payment (EMI)</span>
                  <span className="font-semibold text-emerald-400 break-all">{formatCurrency(emiResult.monthlyEMI)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-450">Principal Borrowed</span>
                  <span className="font-semibold text-white break-all">{formatCurrency(emiPrincipal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-450">Loan Interest Liability</span>
                  <span className="font-semibold text-rose-400 break-all">{formatCurrency(emiResult.totalInterest)}</span>
                </div>
                <div className="flex justify-between pt-1.5 border-t border-slate-800/80">
                  <span className="text-slate-400 font-medium">Total Cost of Credit</span>
                  <span className="font-bold text-white break-all">{formatCurrency(emiResult.totalPayment)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pie Chart display of principal vs interest ratios */}
          <div className="lg:col-span-7 flex flex-col justify-center items-center space-y-4">
            <p className="text-xs font-semibold text-slate-400 text-center select-none">
              Liability Ratios (Principal vs interest)
            </p>
            
            <div className="h-60 sm:h-64 w-full flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Borrowed Principal', value: emiPrincipal },
                      { name: 'Total Interest Payable', value: emiResult.totalInterest },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#f43f5e" />
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                    itemStyle={{ fontSize: 12, color: '#f1f5f9' }}
                    formatter={(value: number) => [formatCurrency(value), '']}
                  />
                  <Legend 
                    align="center"
                    verticalAlign="bottom"
                    iconSize={10}
                    formatter={(value) => <span className="text-xs text-slate-350">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
