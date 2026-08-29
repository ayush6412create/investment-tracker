import {
  ReturnCalculatorInput,
  ReturnCalculatorOutput,
  EMICalculatorInput,
  EMICalculatorOutput,
  Investment,
} from '../types';

export interface AssetProjections {
  totalInvested: number;
  maturityValue: number;
  estimatedProfit: number;
  currentValue: number;
  currentProfit: number;
  monthsElapsed: number;
  totalMonths: number;
}

/**
 * Helper to parse a date string in local timezone securely without timezone/DST shifts.
 */
export function parseLocalDate(dateStr: string): Date {
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  return new Date(dateStr);
}

/**
 * Standard Bank Method: Compounded for full periods (e.g. quarters),
 * and simple interest applied to the accumulated value for the remaining residue period.
 */
export function calculateStandardFDReturns(
  principal: number,
  r: number, // decimal interest rate
  startD: Date,
  endD: Date,
  n: number // compounding periods per year
): number {
  if (endD <= startD) {
    return principal;
  }

  const monthsPerPeriod = 12 / n;

  // Track the date stepping through full compounding periods
  let periods = 0;
  const tempD = new Date(startD.getFullYear(), startD.getMonth(), startD.getDate());

  while (true) {
    const nextPeriod = new Date(tempD.getFullYear(), tempD.getMonth(), tempD.getDate());
    nextPeriod.setMonth(nextPeriod.getMonth() + monthsPerPeriod);
    if (nextPeriod <= endD) {
      periods++;
      tempD.setFullYear(nextPeriod.getFullYear());
      tempD.setMonth(nextPeriod.getMonth());
      tempD.setDate(nextPeriod.getDate());
    } else {
      break;
    }
  }

  // Value compounded up to the last full period
  const compoundedAmount = principal * Math.pow(1 + r / n, periods);

  // Residue period calculation
  const residueMs = endD.getTime() - tempD.getTime();
  const residueDays = Math.max(0, Math.round(residueMs / (1000 * 60 * 60 * 24)));

  const yearsDiff = endD.getFullYear() - tempD.getFullYear();
  const monthsDiff = endD.getMonth() - tempD.getMonth();
  const daysDiff = endD.getDate() - tempD.getDate();

  let tResidue = 0;
  if (daysDiff === 0) {
    const residualMonths = yearsDiff * 12 + monthsDiff;
    tResidue = residualMonths / 12;
  } else {
    tResidue = residueDays / 365;
  }

  // Simple interest for the residue period on the compounded base
  return compoundedAmount * (1 + r * tResidue);
}

/**
 * Calculations for individual recorded assets, predicting precise maturity value and investment net profits based on compounding properties.
 */
export function projectInvestmentReturns(inv: Investment): AssetProjections {
  const principal = inv.principal || 0;
  const rate = inv.rate || 0;
  const start = inv.startDate ? parseLocalDate(inv.startDate) : new Date();
  const today = new Date();
  const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  // Calculate total months and exact years of tenure
  let totalMonths = 12; // default 1 year if nothing else is specified
  let t = 1.0;
  
  if (inv.startDate && (inv.maturityDate || inv.reviewDate)) {
    const startD = parseLocalDate(inv.startDate);
    const endD = parseLocalDate(inv.maturityDate || inv.reviewDate || '');
    
    const startYear = startD.getFullYear();
    const startMonth = startD.getMonth();
    const startDay = startD.getDate();
    
    const endYear = endD.getFullYear();
    const endMonth = endD.getMonth();
    const endDay = endD.getDate();
    
    const yearsDiff = endYear - startYear;
    const monthsDiff = endMonth - startMonth;
    const daysDiff = endDay - startDay;
    
    // If it's a clean month-to-month calendar difference (e.g., 12th to 12th)
    if (startDay === endDay) {
      totalMonths = yearsDiff * 12 + monthsDiff;
      t = totalMonths / 12;
    } else {
      // Calculate exact months as fractional value
      const exactMonths = yearsDiff * 12 + monthsDiff + daysDiff / 30.4375;
      totalMonths = Math.max(1, Math.round(exactMonths));
      
      // Calculate exact fractional years based on days
      const diffTime = endD.getTime() - startD.getTime();
      const diffDays = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)));
      t = diffDays / 365;
    }
  }

  // Calculate elapsed months and elapsed years
  let monthsElapsed = 0;
  let tElapsed = 0;
  if (inv.startDate) {
    const startD = parseLocalDate(inv.startDate);
    const diffTimeElapsed = todayLocal.getTime() - startD.getTime();
    if (diffTimeElapsed > 0) {
      const diffDaysElapsed = Math.round(diffTimeElapsed / (1000 * 60 * 60 * 24));
      
      const startYear = startD.getFullYear();
      const startMonth = startD.getMonth();
      const startDay = startD.getDate();
      
      const todayYear = todayLocal.getFullYear();
      const todayMonth = todayLocal.getMonth();
      const todayDay = todayLocal.getDate();
      
      const yearsDiff = todayYear - startYear;
      const monthsDiff = todayMonth - startMonth;
      const daysDiff = todayDay - startDay;
      
      if (startDay === todayDay) {
        monthsElapsed = Math.min(totalMonths, Math.max(0, yearsDiff * 12 + monthsDiff));
        tElapsed = monthsElapsed / 12;
      } else {
        const exactElapsedMonths = yearsDiff * 12 + monthsDiff + daysDiff / 30.4375;
        monthsElapsed = Math.min(totalMonths, Math.max(0, Math.round(exactElapsedMonths)));
        tElapsed = Math.min(t, diffDaysElapsed / 365);
      }
    }
  }

  const r = rate / 100;

  let totalInvested = principal;
  let maturityValue = 0;
  let currentValue = 0;

  if (inv.type === 'FD') {
    // Fixed Deposits typically compound quarterly or as specified
    let n = 4; // quarterly standard
    if (inv.compoundingFrequency === 'monthly') n = 12;
    if (inv.compoundingFrequency === 'half-yearly') n = 2;
    if (inv.compoundingFrequency === 'yearly') n = 1;

    totalInvested = principal;
    const startD = inv.startDate ? parseLocalDate(inv.startDate) : new Date();
    const endD = inv.maturityDate ? parseLocalDate(inv.maturityDate) : (inv.reviewDate ? parseLocalDate(inv.reviewDate) : startD);

    maturityValue = calculateStandardFDReturns(principal, r, startD, endD, n);
    if (todayLocal > startD) {
      const activeEndD = todayLocal < endD ? todayLocal : endD;
      currentValue = calculateStandardFDReturns(principal, r, startD, activeEndD, n);
    } else {
      currentValue = principal;
    }
  } else if (inv.type === 'RD') {
    // Recurring Deposits with quarterly compounding as standard in Indian banks (IBA guidelines)
    const monthlyContribution = inv.monthlyContribution || 0;
    let sumMaturity = 0;
    let sumCurrent = 0;
    let investedMaturity = 0;
    let investedCurrent = 0;

    for (let k = 1; k <= totalMonths; k++) {
      investedMaturity += monthlyContribution;
      sumMaturity += monthlyContribution * Math.pow(1 + r / 4, k / 3);
    }

    for (let k = 1; k <= monthsElapsed; k++) {
      investedCurrent += monthlyContribution;
      sumCurrent += monthlyContribution * Math.pow(1 + r / 4, k / 3);
    }

    // Include initial principal if present (using quarterly compounding as well)
    if (principal > 0) {
      sumMaturity += principal * Math.pow(1 + r / 4, totalMonths / 3);
      sumCurrent += principal * Math.pow(1 + r / 4, monthsElapsed / 3);
      investedMaturity += principal;
      investedCurrent += principal;
    }

    totalInvested = investedMaturity;
    maturityValue = sumMaturity;
    currentValue = sumCurrent > 0 ? sumCurrent : investedCurrent;
  } else if (inv.type === 'Stock' || inv.type === 'Mutual Fund') {
    // Equities calculated using CAGR-compounded monthly rate: (1 + r)^(1/12) - 1
    const monthlyContribution = inv.monthlyContribution || 0;
    const monthlyRate = Math.pow(1 + r, 1 / 12) - 1;

    if (monthlyContribution > 0) {
      let sumMaturity = principal * Math.pow(1 + r, t);
      let sumCurrent = principal * Math.pow(1 + r, tElapsed);
      let investedMaturity = principal;
      let investedCurrent = principal;

      for (let i = 1; i <= totalMonths; i++) {
        investedMaturity += monthlyContribution;
        sumMaturity += monthlyContribution * Math.pow(1 + monthlyRate, totalMonths - i + 1);
      }

      for (let i = 1; i <= totalMonths; i++) {
        if (i <= monthsElapsed) {
          investedCurrent += monthlyContribution;
          sumCurrent += monthlyContribution * Math.pow(1 + monthlyRate, monthsElapsed - i + 1);
        }
      }

      totalInvested = investedMaturity;
      maturityValue = sumMaturity;
      currentValue = sumCurrent;
    } else {
      totalInvested = principal;
      maturityValue = principal * Math.pow(1 + r, t);
      currentValue = principal * Math.pow(1 + r, tElapsed);
    }
  } else {
    // Gold, Real Estate, and Others typical compounding values
    const monthlyContribution = inv.monthlyContribution || 0;
    if (monthlyContribution > 0) {
      let sumMaturity = principal * Math.pow(1 + r, t);
      let sumCurrent = principal * Math.pow(1 + r, tElapsed);
      let investedMaturity = principal;
      let investedCurrent = principal;
      const monthlyRate = r / 12;

      for (let i = 1; i <= totalMonths; i++) {
        investedMaturity += monthlyContribution;
        sumMaturity += monthlyContribution * Math.pow(1 + monthlyRate, totalMonths - i + 1);
      }

      for (let i = 1; i <= totalMonths; i++) {
        if (i <= monthsElapsed) {
          investedCurrent += monthlyContribution;
          sumCurrent += monthlyContribution * Math.pow(1 + monthlyRate, monthsElapsed - i + 1);
        }
      }

      totalInvested = investedMaturity;
      maturityValue = sumMaturity;
      currentValue = sumCurrent;
    } else {
      totalInvested = principal;
      maturityValue = principal * Math.pow(1 + r, t);
      currentValue = principal * Math.pow(1 + r, tElapsed);
    }
  }

  totalInvested = Math.round(totalInvested);
  maturityValue = Math.round(maturityValue);
  currentValue = Math.round(currentValue);

  const estimatedProfit = Math.max(0, maturityValue - totalInvested);
  const totalCostSoFar = Math.round(principal + (inv.monthlyContribution || 0) * monthsElapsed);
  const currentProfit = Math.max(0, currentValue - totalCostSoFar);

  return {
    totalInvested,
    maturityValue,
    estimatedProfit,
    currentValue,
    currentProfit,
    monthsElapsed,
    totalMonths,
  };
}

/**
 * Calculate returns for LumpSum, SIP or RD
 */
export function calculateReturns(input: ReturnCalculatorInput): ReturnCalculatorOutput {
  const { principal, rate, tenureYears, type, monthlyContribution = 0, compoundingFrequency = 'yearly' } = input;
  const r = rate / 100;
  const n = tenureYears;

  if (type === 'LumpSum') {
    // Compounding frequency compounding multiplier per year
    let k = 1;
    if (compoundingFrequency === 'monthly') k = 12;
    else if (compoundingFrequency === 'quarterly') k = 4;
    else if (compoundingFrequency === 'half-yearly') k = 2;

    const investedAmount = principal;
    const totalValue = principal * Math.pow(1 + r / k, k * n);
    const estimatedReturns = totalValue - investedAmount;

    const yearlyBreakdown = [];
    for (let t = 1; t <= n; t++) {
      const value = principal * Math.pow(1 + r / k, k * t);
      yearlyBreakdown.push({
        year: t,
        invested: principal,
        interest: Math.round(value - principal),
        total: Math.round(value),
      });
    }

    return {
      investedAmount: Math.round(investedAmount),
      estimatedReturns: Math.round(estimatedReturns),
      totalValue: Math.round(totalValue),
      yearlyBreakdown,
    };
  } else {
    // SIP or RD (Monthly investments)
    const totalMonths = n * 12;
    const mContribution = monthlyContribution;
    const yearlyBreakdown = [];

    if (type === 'RD') {
      let cumulativeInvested = principal;
      for (let year = 1; year <= n; year++) {
        const monthsInYear = year * 12;
        let sumYearValue = 0;
        for (let k = 1; k <= monthsInYear; k++) {
          sumYearValue += mContribution * Math.pow(1 + r / 4, k / 3);
        }
        if (principal > 0) {
          sumYearValue += principal * Math.pow(1 + r / 4, monthsInYear / 3);
        }
        cumulativeInvested = principal + mContribution * monthsInYear;

        yearlyBreakdown.push({
          year,
          invested: Math.round(cumulativeInvested),
          interest: Math.max(0, Math.round(sumYearValue - cumulativeInvested)),
          total: Math.round(sumYearValue),
        });
      }

      const finalInvested = principal + mContribution * totalMonths;
      let finalValue = 0;
      for (let k = 1; k <= totalMonths; k++) {
        finalValue += mContribution * Math.pow(1 + r / 4, k / 3);
      }
      if (principal > 0) {
        finalValue += principal * Math.pow(1 + r / 4, totalMonths / 3);
      }

      return {
        investedAmount: Math.round(finalInvested),
        estimatedReturns: Math.max(0, Math.round(finalValue - finalInvested)),
        totalValue: Math.round(finalValue),
        yearlyBreakdown,
      };
    } else {
      // SIP (Monthly investments) following the CAGR month-by-month compounding
      const monthlyRate = Math.pow(1 + r, 1 / 12) - 1;
      let currentValue = principal;
      let currentInvested = principal;

      for (let year = 1; year <= n; year++) {
        for (let month = 1; month <= 12; month++) {
          currentInvested += mContribution;
          currentValue = (currentValue + mContribution) * (1 + monthlyRate);
        }

        yearlyBreakdown.push({
          year,
          invested: Math.round(currentInvested),
          interest: Math.max(0, Math.round(currentValue - currentInvested)),
          total: Math.round(currentValue),
        });
      }

      return {
        investedAmount: Math.round(currentInvested),
        estimatedReturns: Math.max(0, Math.round(currentValue - currentInvested)),
        totalValue: Math.round(currentValue),
        yearlyBreakdown,
      };
    }
  }
}

/**
 * Calculate Loan EMI and Amortization Schedule
 */
export function calculateEMI(input: EMICalculatorInput): EMICalculatorOutput {
  const { principal, rate, tenureMonths } = input;
  
  // If zero interest, just straight division
  if (rate === 0) {
    const monthlyEMI = principal / tenureMonths;
    const schedule = [];
    let balance = principal;
    for (let m = 1; m <= tenureMonths; m++) {
      let principalPaid = monthlyEMI;
      if (m === tenureMonths) {
        principalPaid = balance;
      }
      balance -= principalPaid;
      schedule.push({
        month: m,
        emi: Math.round(principalPaid),
        principalPaid: Math.round(principalPaid),
        interestPaid: 0,
        remainingBalance: Math.round(Math.max(0, balance)),
      });
    }
    return {
      monthlyEMI: Math.round(monthlyEMI),
      totalInterest: 0,
      totalPayment: Math.round(principal),
      schedule,
    };
  }

  const monthlyRate = rate / 12 / 100;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / 
              (Math.pow(1 + monthlyRate, tenureMonths) - 1);

  const schedule = [];
  let remainingBalance = principal;
  let totalInterestAccumulated = 0;
  let totalPaymentAccumulated = 0;

  for (let m = 1; m <= tenureMonths; m++) {
    const interestPaid = remainingBalance * monthlyRate;
    let principalPaid = emi - interestPaid;

    if (m === tenureMonths) {
      principalPaid = remainingBalance;
    }

    const balanceAfterPayment = remainingBalance - principalPaid;
    const roundedInterest = Math.round(interestPaid);
    const roundedPrincipal = Math.round(principalPaid);
    const roundedEMI = roundedPrincipal + roundedInterest;

    totalInterestAccumulated += roundedInterest;
    totalPaymentAccumulated += roundedEMI;

    schedule.push({
      month: m,
      emi: roundedEMI,
      principalPaid: roundedPrincipal,
      interestPaid: roundedInterest,
      remainingBalance: Math.round(Math.max(0, balanceAfterPayment)),
    });

    remainingBalance = balanceAfterPayment;
  }

  return {
    monthlyEMI: Math.round(emi),
    totalInterest: Math.round(totalInterestAccumulated),
    totalPayment: Math.round(totalPaymentAccumulated),
    schedule,
  };
}
