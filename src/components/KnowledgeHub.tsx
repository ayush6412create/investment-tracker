import React, { useState } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  Percent, 
  Briefcase, 
  ShieldCheck, 
  Droplet, 
  Flame, 
  Quote, 
  HelpCircle, 
  ArrowRight, 
  Check, 
  Info, 
  Coins, 
  Zap, 
  Bookmark,
  ChevronRight,
  BookOpen,
  Layers,
  Search,
  Award,
  BookMarked,
  Calculator,
  RefreshCw,
  Scale
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Quotes Database
const INVESTMENT_QUOTES = [
  {
    text: "The individual investor should act consistently as an investor and not as a speculator.",
    author: "Benjamin Graham",
    title: "Father of Value Investing"
  },
  {
    text: "Rule No. 1: Never lose money. Rule No. 2: Never forget rule No. 1.",
    author: "Warren Buffett",
    title: "The Oracle of Omaha"
  },
  {
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb",
    title: "Timeless Wisdom"
  },
  {
    text: "In investing, what is comfortable is rarely profitable.",
    author: "Robert Arnott",
    title: "Investment Strategist"
  },
  {
    text: "Do not save what is left after spending, but spend what is left after saving.",
    author: "Warren Buffett",
    title: "Fundamental Rule of Wealth"
  },
  {
    text: "Compound interest is the eighth wonder of the world. He who understands it, earns it... he who doesn't... pays it.",
    author: "Albert Einstein",
    title: "Theoretical Physicist (on Magic of Compounding)"
  }
];

// Interactive Quiz Data
const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "A market correction happens and your portfolio drops by 15% in a single week. What is your gut reaction?",
    options: [
      { text: "😱 Panic! Convert everything to cash quickly before it goes to zero.", score: 'conservative' },
      { text: "😐 Calm down, double-check company fundamentals, wait and watch.", score: 'moderate' },
      { text: "🤑 Awesome discount! Inject leftover savings to buy more cheap assets.", score: 'aggressive' }
    ]
  },
  {
    id: 2,
    question: "What is your main financial objective over the next 5-8 years?",
    options: [
      { text: "🛡️ absolute peace of mind. Keeping capital completely safe from any loss.", score: 'conservative' },
      { text: "⚖️ Balanced growth that outpaces inflation without extreme rollercoasters.", score: 'moderate' },
      { text: "🚀 Capital multiplication! I want maximum compound growth and have time to ride out recessions.", score: 'aggressive' }
    ]
  },
  {
    id: 3,
    question: "Select your preferred asset allocation flavor if you had $10,000 to distribute today:",
    options: [
      { text: "🏦 80% FDs & Government bonds, 20% Index Mutual Funds.", score: 'conservative' },
      { text: "📊 50% diversified Mutual Funds, 30% Blue-Chip stocks, 20% RDs/Cash.", score: 'moderate' },
      { text: "🔥 70% Growth Stocks, 20% Sectoral Mutual Funds, 10% Cash reserves.", score: 'aggressive' }
    ]
  }
];

// Expanded Asset Categories with Deep Beginner Explanations
interface AssetCategory {
  id: string;
  name: string;
  emoji: string;
  shortDesc: string;
  accentClass: string;
  bgGradient: string;
  returnStars: number;
  safetyStars: number;
  liquidityLevel: 'Instant (30 Secs)' | 'Medium (1-3 Days)' | 'Low / Locked';
  whatIsIt: string;
  analogy: string;
  howItWorksSteps: string[];
  equation: string;
  mathExample: string;
  myth: string;
  realityCheck: string;
  pros: string[];
  cons: string[];
  funFact: string;
  bestFor: string;
  minCapital: string;
}

const CATEGORIES: AssetCategory[] = [
  {
    id: 'stocks',
    name: 'Stocks (Equities)',
    emoji: '📈',
    shortDesc: 'Own a real slice of the world\'s premium companies & participate directly in their global growth!',
    accentClass: 'text-indigo-400 border-indigo-550/20',
    bgGradient: 'from-indigo-600/10 via-purple-600/5 to-transparent',
    returnStars: 5,
    safetyStars: 1,
    liquidityLevel: 'Instant (30 Secs)',
    whatIsIt: 'When you buy a stock, you aren\'t just looking at blinking symbols on a phone screen; you are purchasing a fractional legal ownership in a real live company. You own a piece of their buildings, intellectual property, and workforce output. If the company performing exceptionally well doubles its sales, your share value increases!',
    analogy: 'Imagine your friend opens a premium Lemonade Stand. Instead of asking you for a loan, they sell you 10% of the booth for $100. If the stand goes on to make a giant franchise with locations across town, your 10% slice is now worth $5,000! However, if the stand serves poor juice and goes out of business, your $100 is completely gone.',
    howItWorksSteps: [
      'An enterprise publically lists its shares via an IPO (Initial Public Offering) to raise expansion cash.',
      'Regular investors purchase these fractional ownership cards on standard public secondary exchanges (NYSE, NSE, FTSE).',
      'Capital Appreciation: As the business generates robust earnings, investor demand increases, forcing share prices to climb.',
      'Dividends: High-performing mature companies distribute direct physical cash royalty checks from their net profits straight to your cash ledger, usually every quarter!'
    ],
    equation: 'Total Gain = (Selling Price - Purchase Price) * Number of Shares + Total Dividends Received',
    mathExample: 'You purchase 10 shares of "AstroTech" at $100 each (Total Invested: $1,000). AstroTech flourishes and the price rises to $145 per share. In addition, they dispatch a dividend yield of $5 per share. If you sell, your portfolio grows to $1,450 (Value) + $50 (Cash Dividends) = $1,500. Your absolute profit is $500—an amazing 50% ROI!',
    myth: 'Stocks are a virtual casino. Trading is purely a gambling slot of luck where 99% of people lose everything.',
    realityCheck: 'Day trading based on rumors or short-term emotions is indeed high-risk speculation. But long-term investing in high-quality, resilient cash-generating global businesses for 10+ years has historically beaten every other asset class in human history!',
    pros: [
      'Compounding returns have no upper limit',
      'Provides direct royalty income (Dividends) paid in cash',
      'Highest liquidity—sell instantly in market hours'
    ],
    cons: [
      'Extremely volatile—can fluctuate up and down on daily news cycles',
      'No safety guarantees—you can lose your principal if the business fails',
      'Requires mental discipline to avoid panic-selling in a crash'
    ],
    bestFor: 'Long-term wealth builders with a 5+ year timeline who can ignore market fluctuations.',
    minCapital: 'Very Low (Cost of 1 share or fraction, e.g. $10)',
    funFact: 'The stock market is a voting machine in the short run (measuring popularity), but a weighing machine in the long run (measuring actual business profits). Over time, profits always win!'
  },
  {
    id: 'fds',
    name: 'Fixed Deposits (FDs)',
    emoji: '🏦',
    shortDesc: 'Guaranteed, iron-clad returns backed by sovereign-protected banks.',
    accentClass: 'text-emerald-400 border-emerald-555/20',
    bgGradient: 'from-emerald-600/10 via-teal-600/5 to-transparent',
    returnStars: 2,
    safetyStars: 5,
    liquidityLevel: 'Low / Locked',
    whatIsIt: 'A Fixed Deposit is a legal contract you sign with a banking institution. You agree to lock away a set amount of cash with them for a fixed timeline (from weeks to multiple years). In exchange, they are legally obligated to repay your principal with a guaranteed, non-fluctuating interest yield.',
    analogy: 'Imagine you rent your room to a quiet, high-credit tenant who signs an airtight lease. They guarantee to pay you exactly $700 every single month, no matter what happens to the stock market or global trade wars. It is predictable, steady, and clean.',
    howItWorksSteps: [
      'You lock a lump sum amount (e.g. $5,000) for a chosen duration (e.g., 1 Year, 3 Years, 5 Years).',
      'You select the payout frequency: Cumulative (interest is re-invested to compound and pay at maturity) or Non-Cumulative (interest hits your checking account monthly/quarterly to live on).',
      'Sovereign Security: Governments heavily insure bank deposits up to high caps (e.g. FDIC up to $250,000, DICGC up to ₹5 Lakhs), meaning even if the bank goes bankrupted, your cash is protected by federal laws!',
      'Premature Withdrawal: If you break the lockbox and withdraw early, the bank allows it but charges a small penalty (lowers your interest by 0.5% - 1.0%)./.'
    ],
    equation: 'Maturity Amount (Cumulative) = P * (1 + r / n)^(n * t)   Where P=Principal, r=Annual Rate, n=Compounding Times, t=Years',
    mathExample: 'You deposit $10,000 into a 1-year bank FD giving a guaranteed 7.00% annual interest rate, compounded quarterly. At the end of the year, you receive exactly $10,718.60 back in your hand. No market swings, no daily checks, 100% promised.',
    myth: 'FDs are 100% safe, so I should deposit all my lifetime income there.',
    realityCheck: 'While they carry nearly zero market risk, FDs carry a massive "Inflation Risk". If inflation averages 6.5% and your FD pays 6%, your money actually loses purchasing power slowly over time! It is a safe haven for security, not high wealth multiplication.',
    pros: [
      'Legally guaranteed returns—absolutely zero volatility, zero market crashes',
      'Insured by government backing, making bank failure risk negligible',
      'Can be used as excellent collateral for securing instant cheap credit loans'
    ],
    cons: [
      'Rarely beats inflation—your money actually buys fewer groceries in 10 years',
      'Lacks immediate liquidity—early breakage penalties apply',
      'Profits are fully taxable based on your regular income tax bracket'
    ],
    bestFor: 'Conservative savers, senior citizens, or parking funds needed for an immediate goal in 1-3 years.',
    minCapital: 'Low (Banks typically start deposits at $100)',
    funFact: 'Historically, the term "deposit" stems from Roman times where citizens paid temple keepers to secure gold, although back then, savers had to pay a fee to store it rather than earning interest!'
  },
  {
    id: 'rds',
    name: 'Recurring Deposits (RDs)',
    emoji: '⏱️',
    shortDesc: 'Build disciplined savings habits scoop-by-scoop monthly.',
    accentClass: 'text-sky-450 border-sky-500/20',
    bgGradient: 'from-sky-600/10 via-cyan-600/5 to-transparent',
    returnStars: 2,
    safetyStars: 5,
    liquidityLevel: 'Low / Locked',
    whatIsIt: 'A Recurring Deposit is a variation of a Fixed Deposit designed for people who want bank safety but do not have a huge pile of money saved up to deposit all at once. Instead, you agree to deposit a fixed small amount (e.g. $100) every single month. The bank locks in a high guaranteed interest rate for all subsequent deposits!',
    analogy: 'Imagine setting up an automated "piggy bank treadmill". Every single payday, a virtual hand takes a single crisp $100 bill and drops it into a locked vault that instantly begins baking compounding interest. You didn\'t have to buy a massive block of gold upfront, you grew your castle brick-by-brick!',
    howItWorksSteps: [
      'Select a fixed monthly savings installment (e.g., $100, $500, or $1,000) and duration (e.g. 1 to 5 years).',
      'Ensure automatic auto-debt is linked on payday so savings happen before you have a chance to spend it!',
      'The bank applies a fixed interest yield structure, but compounds the interest on EACH monthly payment based on how many months it sits inside the vault.',
      'Upon maturity of the tenure, you withdraw the full combined sum of all combined monthly installments plus the compiled compound interest accrued.'
    ],
    equation: 'Advanced compounding calculation summing each installment compounded for its specific remaining duration.',
    mathExample: 'You commit to saving $200 per month in a 1-year RD at a fixed 7% interest rate. Over the year, your total out-of-pocket cash is $2,400. Because your early monthly inputs spent more time compounding, you withdraw a check of exactly $2,492.00 at the end of the year.',
    myth: 'RDs yield less interest rate than FDs, so they are not worth doing.',
    realityCheck: 'RDs give the exact same annual interest rate percentage as FDs! The reason the nominal dollar return looks smaller is because your final month\'s $200 only spent 30 days in the bank to earn interest, whereas your first month\'s $200 spent a full 365 days. It is the king of compounding training wheels!',
    pros: [
      'Outstanding tool for building an ironclad regular savings discipline',
      'Provides identical sovereign bank security and guaranteed returns as FDs',
      'Perfect for beginners—no lump sum required to start earning high interest yields'
    ],
    cons: [
      'Interest rate is locked—if market rates climb next month, your yield stays static',
      'Missed monthly deposits or delayed payments can trigger minor bank fines',
      'Like FDs, they fail to deliver aggressive capital-growing capacity over the long run'
    ],
    bestFor: 'Salaried employees, college students, or anyone wanting to automate their savings habit without market risks.',
    minCapital: 'Extremely Low (Most banks let you start with just $10 a month!)',
    funFact: 'RDs were popularized during the industrial era to help factory workers with monthly wages save for winter fuel and holiday provisions, helping build early household wealth!'
  },
  {
    id: 'mutualfunds',
    name: 'Mutual Funds (MFs)',
    emoji: '🎒',
    shortDesc: 'Pool funds to let professional fund managers deploy diversified capital across hundreds of assets!',
    accentClass: 'text-pink-450 border-pink-500/20',
    bgGradient: 'from-pink-600/10 via-rose-600/5 to-transparent',
    returnStars: 4,
    safetyStars: 3,
    liquidityLevel: 'Medium (1-3 Days)',
    whatIsIt: 'A Mutual Fund is a collective financial vehicle. Instead of you spending hours researching and trying to buy 50 different company stocks or government bonds, you pool your money with millions of other regular investors. A licensed professional (the Fund Manager) uses this massive capital pool to buy a highly diversified basket of up to hundreds of stocks or bonds.',
    analogy: 'Imagine you want a rich, nutritious fruit salad, but you only have $5. You can\'t purchase a whole pineapple, a whole watermelon, a basket of berries, and a carton of grapes for $5. But if 100 friends pool $5 each, you can buy all the fruit, chop it up, and distribute 100 equal, delicious diversified bowls!',
    howItWorksSteps: [
      'Pooled Cash structure: Investors buy fractional units of the fund basket based on the Net Asset Value (NAV).',
      'Active management (fund manager picks individual stocks to beat market) vs Passive management (the fund simply copies an index like the S&P 500 at near-zero cost).',
      'Diversification safety: If one company in the basket of 80 goes bankrupt, the impact on your overall money is barely noticed because the other 79 companies pull the weight.',
      'Expense Ratio: The fund manager deducts a tiny annual processing fee (for Index funds it is typically 0.1% - 0.2%, and up to 1.5% for active stock-picking funds).'
    ],
    equation: 'Portfolio Value = (Number of units owned) * (Current NAV per unit)   Where NAV is Net Asset Value',
    mathExample: 'You start a $100 per month SIP (Systematic Investment Plan) in a Diversified Index Mutual Fund. The current NAV per unit is $25, so you are credited exactly 4 units. Over 5 years of economic growth, the NAV climbs to $45. Your 4 units are now worth 4 * $45 = $180 (an awesome 80% growth!)',
    myth: 'All mutual funds are completely safe from losses because they are diversified.',
    realityCheck: 'Mutual funds are still tied to market performance! If a global recession hits, even the best diversified equity fund will temporarily drop in value. The core difference is, while a single stock can go bankrupt to absolute zero, a diversified fund tracking the top 100 businesses in a country will always recover and grow as the nation\'s economy rebounds.',
    pros: [
      'Instant diversification—never have all your eggs in one fragile basket',
      'Professionally managed—full-time experts handle the complex calculations and trading',
      'SIP system allows automatic, small passive investments that build massive compound wealth'
    ],
    cons: [
      'Subject to market volatility and swings on global economic corrections',
      'The Expense Ratio fee is charged annually regardless of whether the fund makes or loses money',
      'Selling takes 1-3 business days to process and settle back into your bank ledger'
    ],
    bestFor: 'People who want to growth-multiply their savings but don\'t have the time to research individual shares.',
    minCapital: 'Very Low (SIP start options are as low as $5 or $10 a month)',
    funFact: 'The first modern mutual fund was created in Boston in 1924. It survived the Great Depression and is still actively operating and building investor wealth today!'
  },
  {
    id: 'liquidity',
    name: 'Liquidity (Emergency Cash)',
    emoji: '💧',
    shortDesc: 'The physical oxygen of your financial lungs—immediate, stress-free cash for life\'s unpredictabilities.',
    accentClass: 'text-amber-450 border-amber-500/20',
    bgGradient: 'from-amber-600/10 via-orange-600/5 to-transparent',
    returnStars: 1,
    safetyStars: 5,
    liquidityLevel: 'Instant (30 Secs)',
    whatIsIt: 'Liquidity represents cold hard cash, checking accounts, high-yield instant savings, or premium liquid mutual funds that can be spent immediately. This money is NOT meant to generate aggressive compounded growth; its singular role is to act as your primary defense shield against sudden real-world crises.',
    analogy: 'Imagine keeping a pressurized Fire Extinguisher in your kitchen. It doesn\'t look elegant, it takes up space, and it doesn\'t make you any money sitting on the wall. But when grease flares up on the stove, you don\'t want to wait 3 days for a delivery—you need it in exactly 2 seconds! That is liquid cash.',
    howItWorksSteps: [
      'The 6-Month Sentinel: Calculate your absolute baseline survival living expenses (rent, groceries, basic utilities). Park exactly 3 to 6 times that amount in a separate account.',
      'Zero Lock-In: This vault is kept free from stock market fluctuations or long-term banking locks.',
      'Prevents Debt Traps: When a sudden car repair, medical bill, or job layoff hits, you pay for it in cash over the counter instead of putting high-interest credit card debt that drains your wealth.',
      'Opportunistic Reserves: Having liquid ammunition allows you to buy stocks or mutual funds at giant discount prices when markets crash!'
    ],
    equation: 'Emergency Cushion Target = Monthly Baseline Expenses * 6 Months',
    mathExample: 'Your essential living costs are $2,000/month. You build a designated Emergency Cash reservoir of $12,000 in a high-yield liquid savings folder yielding 4%. While inflation eats away 2% net purchasing power, a sudden job restructuring occurs. You enjoy 6 months of zero anxiety to safely locate your next job, without ever being forced to sell your stocks at a loss in a market dip.',
    myth: 'Leaving cash idle in a liquid state is a waste because inflation is eating its value.',
    realityCheck: 'Keeping all your net worth in cash is indeed a slow leak. But keeping ZERO cash in your wallet is an accident waiting to happen! Liquid emergency funds are a form of cheap "insurance premium" that safeguards your long-term aggressive stock investments from being liquidated at a loss.',
    pros: [
      'Provides absolute, stress-free peace of mind and mental health security',
      'Immediate access—no bank reviews, no early withdrawal fines, withdraw in 1 minute',
      'Provides instant cash ammunition to capitalize on golden stock market discount events'
    ],
    cons: [
      'Delivers very minimal or near-zero yields that will lose value to inflation over time',
      'Tempting to spend on lifestyle upgrades or non-emergencies if kept too close at hand',
      'Does not actively build long-term generational wealth'
    ],
    bestFor: 'Absolutely everyone! This is the absolute first brick of any financial house before investing a single dollar elsewhere.',
    minCapital: 'Zero (Any cash saved in a clean envelope or digital locker is valid)',
    funFact: 'Studies show that families with even just a small $505 cash liquid cushion avoid predatory high-interest debt cycles at a rate 82% higher than those without any reserves!'
  }
];

export default function KnowledgeHub() {
  // Navigation: Category selection
  const [selectedCategory, setSelectedCategory] = useState<string>('stocks');
  // Sub Tab inside selected asset
  const [infoTab, setInfoTab] = useState<'overview' | 'how-it-works' | 'math' | 'myths'>('overview');
  // Quotes index
  const [quoteIndex, setQuoteIndex] = useState<number>(0);
  
  // Compounding sandbox state
  const [principal, setPrincipal] = useState<number>(5000);
  const [rate, setRate] = useState<number>(10);
  const [years, setYears] = useState<number>(10);

  // Search keyword inside educational lookup
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Quiz State
  const [quizStep, setQuizStep] = useState<number>(0); // 0 = start, 1-3 = questions, 4 = result
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [activeQuestion, setActiveQuestion] = useState<number>(0);

  // Calculate compounding sandbox metrics
  const compoundValue = principal * Math.pow(1 + rate / 100, years);
  const simpleCapital = principal + (principal * (rate / 100) * years);
  const interestEarned = compoundValue - principal;
  const compoundingDifference = compoundValue - simpleCapital;

  // Next quote trigger
  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % INVESTMENT_QUOTES.length);
  };

  // Profile tool answer selection
  const handleAnswerSelect = (score: string) => {
    const nextAnswers = [...quizAnswers, score];
    setQuizAnswers(nextAnswers);

    if (activeQuestion < 2) {
      setActiveQuestion(prev => prev + 1);
    } else {
      setQuizStep(4); // Show results
    }
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers([]);
    setActiveQuestion(0);
  };

  // Evaluate quiz outcomes
  const getQuizResult = () => {
    const counts = quizAnswers.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const maxType = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, 'moderate');

    if (maxType === 'conservative') {
      return {
        badge: '🛡️ Shielded Guardian (Low Risk / Super Safe)',
        desc: 'You cherish security, guaranteed peace of mind, and capital protection above all! You prefer knowing your money is locked inside iron-clad bank-secured vaults, shielded from the daily rollercoasters of stock tickers. Your best companions are Fixed Deposits, Recurring Deposits, Government Bonds, and solid Liquid Emergency cash.',
        colorClass: 'text-emerald-400 border-emerald-500/35 bg-emerald-500/10',
        tips: [
          'Maintain a neat Emergency Cash vault of 6 months baseline living costs.',
          'Maximize your yields by locking in Recurring Deposits (RDs) when interest rates spike.',
          'Consider allocating a small 10-20% portion to low-cost Equity Index Mutual Funds. Over multiple years, this ensures inflation doesn\'t eat away your guaranteed cash value!'
        ]
      };
    } else if (maxType === 'aggressive') {
      return {
        badge: '🔥 Wealth Gladiator (High Risk / Aggressive Growth)',
        desc: 'You have a legendary risk appetite and are focused intensely on long-term compound multiplier effects! You view short-term market crashes as giant, juicy discount sales to purchase high-growth stocks or specialized mutual funds. You have time on your side and are willing to ride temporary drops for large future prize jars.',
        colorClass: 'text-indigo-400 border-indigo-500/35 bg-indigo-500/10',
        tips: [
          'Keep your compounding working 24/7 by setting up automated monthly Mutual Fund SIPs.',
          'Ensure you NEVER invest cash that you will need for rent within the next 3 years. Doing so protects you from being forced to fire-sell stocks during a temporary market dump.',
          'Maintain a small 15% reserve in ultra-secure fixed deposits or RDs to act as emergency ammunition.'
        ]
      };
    } else {
      return {
        badge: '⚖️ Balanced Strategist (Moderate Risk / Gold Middle)',
        desc: 'You appreciate the best of both worlds! You seek healthy compound interest to growth-multiply your capital, but you also appreciate having a calm, sturdy mattress of guaranteed deposits to catch you if markets slip. You are perfectly suited for a balanced asset mix combining stock index mutual funds with stable FDs/RDs.',
        colorClass: 'text-amber-400 border-amber-500/35 bg-amber-500/10',
        tips: [
          'Set a calendar target structure, e.g. "60% Equity Mutual Funds, 30% FDs, 10% Liquid Cash". Rebalance these ratios once a year.',
          'Leverage Recurring Deposits (RDs) to gradually move idle salary cash into secure guaranteed yield structures.',
          'Utilize low-cost multi-asset mutual funds to automate active risk-balancing seamlessly.'
        ]
      };
    }
  };

  // Keyword term search database for quick dictionary
  const dictionaryTerms = [
    { term: 'Inflation', definition: 'The silent leak where money loses purchasing power over time because items become more expensive. If inflation is 6%, a $10 burger will cost $10.60 next year.' },
    { term: 'Compounding', definition: 'Earning interest on top of previously earned interest. Over time, this creates an exponential snowball effect that multiplies your capital rapidly.' },
    { term: 'Net Asset Value (NAV)', definition: 'The per-unit market price of a Mutual Fund. Equivalent to a stock\'s share price. If a fund holds $1M in assets and has 10k units, NAV is $100.' },
    { term: 'Diversification', definition: 'The golden rule of investing: spreading your capital across various companies, bank FDs, and cash so that single component crash doesn\'t hurt you.' },
    { term: 'Systematic Investment Plan (SIP)', definition: 'An automated feature that invests a set small portion of money (e.g., $50) into a Mutual Fund every single month on paycheck days.' },
    { term: 'Expense Ratio', definition: 'The tiny annual fee charged by mutual funds to pay the salary of the fund manager. It is always calculated as a percentage.' },
    { term: 'Opportunity Cost', definition: 'The potential gains you miss out on by choosing one asset over another. E.g. keeping cash in a drawer has an opportunity cost of 6% interest.' }
  ];

  // Filters terms based on search query
  const filteredTerms = searchQuery.trim() === '' 
    ? [] 
    : dictionaryTerms.filter(t => t.term.toLowerCase().includes(searchQuery.toLowerCase()) || t.definition.toLowerCase().includes(searchQuery.toLowerCase()));

  const selectedAsset = CATEGORIES.find(c => c.id === selectedCategory) || CATEGORIES[0];

  return (
    <div className="space-y-8 pb-12" id="investment-knowledge-hub">
      
      {/* 1. Interactive Header & Welcome Academy */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-indigo-950/20 to-slate-900/90 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-64 h-64 bg-pink-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-indigo-500/25 to-pink-500/15 text-indigo-300 border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            Vibrant Beginners Academy
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight sm:text-5xl">
            Learn Financial Fitness, <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Step-by-Step!</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
            Welcome to the ultimate interactive handbook! High-finance doesn't need to be dry or boring. If you leave your cash idle in a cabinet, the invisible thief called <strong>Inflation</strong> eats its value. Let's explore real-world instruments to safeguard your wealth, using engaging analogies, visual sliders, and playful battle tables!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3">
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-850 space-y-1.5 transition-all hover:border-indigo-500/20">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-lg">🛡️</div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider">Beat Inflation</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">If prices of goods rise by 6% annually, any asset giving under 6% is losing value. Learn to out-climb the monster!</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-850 space-y-1.5 transition-all hover:border-emerald-500/20">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-lg">⏳</div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider">Compound Interest</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">Let your money breed baby money. Over time, those babies grow up and breed more babies, creating massive fortunes automatically!</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-850 space-y-1.5 transition-all hover:border-pink-500/20">
              <div className="w-8 h-8 rounded-xl bg-pink-500/10 flex items-center justify-center text-lg">🧠</div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider">Smart Balance</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">Keep cash handy for medical crises, set safe bank RDs for planned bills, and keep mutual funds for generational growth.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Instant Dictionary Lookup */}
      <div className="bg-slate-900/60 border border-slate-850 rounded-2xl p-5 md:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-sm font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
              <Search className="w-4 h-4 text-indigo-400" />
              Interactive Financial Jargon Decoder
            </h3>
            <p className="text-xs text-slate-400">
              Type any confusing financial term to unlock its crystal-clear beginner meaning instantly (e.g. inflation, compounding, SIP, NAV):
            </p>
          </div>
          
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search jargon words..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-9 text-xs text-slate-250 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {searchQuery.trim() !== '' && (
          <AnimatePresence>
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-slate-950/80 rounded-xl p-4 border border-indigo-500/15 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {filteredTerms.length > 0 ? (
                filteredTerms.map((t, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-slate-850 space-y-1">
                    <h5 className="text-xs font-extrabold text-indigo-400 flex items-center gap-1.5">
                      <Bookmark className="w-3.5 h-3.5 text-pink-400 fill-pink-500/10" />
                      {t.term}
                    </h5>
                    <p className="text-[11px] text-slate-350 leading-relaxed">{t.definition}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-2 text-xs text-slate-500 italic">
                  No direct word match found. Try typing: compounding, inflation, NAV, SIP, expense ratio, or diversification.
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* 3. Wiseman Quotes Panel */}
      <div className="bg-gradient-to-tr from-slate-900 to-indigo-950/40 border border-slate-850 rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 left-0 w-32 h-32 bg-pink-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-400 shrink-0">
            <Quote className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-indigo-400 font-extrabold uppercase tracking-wider">Investor Wisdom Quote</p>
            <AnimatePresence mode="wait">
              <motion.div
                key={quoteIndex}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-1"
              >
                <p className="text-sm md:text-base font-medium italic text-slate-200">
                  "{INVESTMENT_QUOTES[quoteIndex].text}"
                </p>
                <p className="text-xs text-slate-400">
                  — <span className="font-bold text-white">{INVESTMENT_QUOTES[quoteIndex].author}</span>, <span className="text-[10px] text-slate-400 italic">{INVESTMENT_QUOTES[quoteIndex].title}</span>
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <button
          onClick={handleNextQuote}
          className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-800 hover:border-indigo-500/30 hover:bg-slate-850 text-slate-300 hover:text-white transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          Refreshed Quote
        </button>
      </div>

      {/* 4. Core Asset Explorer Tabbed Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Hand Button select deck */}
        <div className="lg:col-span-4 space-y-4">
          {/* Type of Mutual Funds flavor highlight drawer */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/20 border border-slate-900 space-y-4">
            <h4 className="text-xs font-extrabold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-pink-400" />
              Types of Mutual Funds (Quick Guide)
            </h4>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-850 hover:bg-slate-950 transition-colors">
                <div className="flex justify-between items-center">
                  <p className="text-[11px] font-black text-indigo-300">🍦 Equity mutual funds</p>
                  <span className="text-[9px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded px-1">High Growth</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                  These invest your cash primarily into company stock shares. Perfect for multi-year timelines. Exciting ups & downs, massive return power!
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-850 hover:bg-slate-950 transition-colors">
                <div className="flex justify-between items-center">
                  <p className="text-[11px] font-black text-emerald-350">🍨 Debt mutual funds</p>
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded px-1">Very Safe</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                  These buy corporate bonds, bank papers, and cabinet assets. Very steady yields, protected value, absolutely minimal drops.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-850 hover:bg-slate-950 transition-colors">
                <div className="flex justify-between items-center">
                  <p className="text-[11px] font-black text-purple-350">🍧 Hybrid funds</p>
                  <span className="text-[9px] bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded px-1">Balanced</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                  A mixture balance of Equity + Debt (e.g. 60% stocks, 40% stable bonds). Excellent middle-ground to dampen market shocks!
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-850 hover:bg-slate-950 transition-colors">
                <div className="flex justify-between items-center">
                  <p className="text-[11px] font-black text-amber-355">🏆 Index Funds</p>
                  <span className="text-[9px] bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded px-1">Low Expense</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                  Simply copies indexes like S&P 500 or Nifty. No human stock-picker error, and highly cost efficient (near zero fees)!
                </p>
              </div>
            </div>
          </div>

          <h3 className="text-xs font-extrabold text-indigo-400 uppercase tracking-widest pl-2">
            Select Asset Lesson
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setInfoTab('overview'); }}
                  className={`p-3.5 rounded-2xl border text-left transition-all duration-300 flex items-center gap-3.5 cursor-pointer relative overflow-hidden group
                    ${isActive 
                      ? 'bg-slate-900 border-slate-700/60 shadow-xl ring-1 ring-slate-850' 
                      : 'bg-slate-900/40 border-slate-900 hover:bg-slate-900 hover:border-slate-850 hover:scale-[1.01]'}`}
                >
                  <div className="text-3xl">{cat.emoji}</div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-black text-slate-200 group-hover:text-white truncate transition-colors">
                      {cat.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">
                      {cat.shortDesc}
                    </p>
                  </div>
                  {isActive && (
                    <div className="w-1.5 h-8 rounded-full bg-indigo-500 shrink-0 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Hand Lesson Interactive Screen */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Sub Navigation Tabs */}
          <div className="grid grid-cols-2 lg:flex lg:flex-nowrap items-stretch bg-slate-950/60 p-1 rounded-2xl border border-slate-850 gap-1 lg:gap-0">
            <button
              onClick={() => setInfoTab('overview')}
              className={`text-center px-2 py-2.5 rounded-xl text-[10px] xs:text-xs font-bold sm:font-extrabold cursor-pointer transition-all flex items-center justify-center gap-1 sm:gap-1.5 flex-1
                ${infoTab === 'overview' 
                  ? 'bg-slate-900 border border-slate-800 text-white shadow shadow-white/5' 
                  : 'text-slate-400 hover:text-slate-200'}`}
            >
              <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-400 shrink-0" />
              General Overview
            </button>
            <button
              onClick={() => setInfoTab('how-it-works')}
              className={`text-center px-2 py-2.5 rounded-xl text-[10px] xs:text-xs font-bold sm:font-extrabold cursor-pointer transition-all flex items-center justify-center gap-1 sm:gap-1.5 flex-1
                ${infoTab === 'how-it-works' 
                  ? 'bg-slate-900 border border-slate-800 text-white shadow shadow-white/5' 
                  : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-400 fill-yellow-500/10 shrink-0" />
              How It Works
            </button>
            <button
              onClick={() => setInfoTab('math')}
              className={`text-center px-2 py-2.5 rounded-xl text-[10px] xs:text-xs font-bold sm:font-extrabold cursor-pointer transition-all flex items-center justify-center gap-1 sm:gap-1.5 flex-1
                ${infoTab === 'math' 
                  ? 'bg-slate-900 border border-slate-800 text-white shadow shadow-white/5' 
                  : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Calculator className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 shrink-0" />
              Math Sandbox
            </button>
            <button
              onClick={() => setInfoTab('myths')}
              className={`text-center px-2 py-2.5 rounded-xl text-[10px] xs:text-xs font-bold sm:font-extrabold cursor-pointer transition-all flex items-center justify-center gap-1 sm:gap-1.5 flex-1
                ${infoTab === 'myths' 
                  ? 'bg-slate-900 border border-slate-800 text-white shadow shadow-white/5' 
                  : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Scale className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-455 shrink-0" />
              Myth vs Reality
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedAsset.id}-${infoTab}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className={`rounded-3xl border bg-slate-900 p-6 md:p-8 shadow-2xl space-y-6 relative overflow-hidden`}
            >
              {/* Blur backdrop mesh */}
              <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl ${selectedAsset.bgGradient} rounded-full blur-2xl pointer-events-none`} />

              {/* Title Section */}
              <div className="flex items-center gap-3.5 border-b border-slate-850 pb-5">
                <span className="text-4xl animate-bounce">{selectedAsset.emoji}</span>
                <div>
                  <h3 className="text-2xl font-black text-white flex items-center gap-2">
                    {selectedAsset.name} 
                    <span className="text-xs font-medium text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                      Learn mode
                    </span>
                  </h3>
                  <p className="text-xs text-slate-350 mt-1">{selectedAsset.shortDesc}</p>
                </div>
              </div>

              {/* RATING GAUGES */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-4 bg-slate-950/50 p-4.5 rounded-2xl border border-slate-850">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Profit Yield Capability</span>
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-xl leading-none">
                        {i < selectedAsset.returnStars ? '★' : '☆'}
                      </span>
                    ))}
                    <span className="text-xs text-slate-350 ml-1.5 font-bold">({selectedAsset.returnStars}/5)</span>
                  </div>
                </div>

                <div className="space-y-1.5 border-t sm:border-t-0 sm:border-l border-slate-850/50 pt-3.5 sm:pt-0 pl-0 sm:pl-4">
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Capital Safety Level</span>
                  <div className="flex items-center gap-1 text-emerald-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-xl leading-none">
                        {i < selectedAsset.safetyStars ? '★' : '☆'}
                      </span>
                    ))}
                    <span className="text-xs text-slate-350 ml-1.5 font-bold">({selectedAsset.safetyStars}/5)</span>
                  </div>
                </div>

                <div className="space-y-1.5 border-t sm:border-t-0 sm:border-l border-slate-850/50 pt-3.5 sm:pt-0 pl-0 sm:pl-4">
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Liquidity (Asset Access Speed)</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Droplet className={`w-4 h-4 text-cyan-400 fill-cyan-400/20`} />
                    <span className="text-xs font-black text-white">{selectedAsset.liquidityLevel}</span>
                  </div>
                </div>
              </div>

              {/* OVERVIEW CONTENT */}
              {infoTab === 'overview' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h4 className="text-xs font-extrabold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-indigo-400" />
                      What actually is it?
                    </h4>
                    <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/30 p-4.5 rounded-2xl border border-slate-850/40">
                      {selectedAsset.whatIsIt}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-3">
                      <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Check className="w-4 h-4" />
                        Major Benefits (Pros)
                      </h5>
                      <ul className="space-y-2">
                        {selectedAsset.pros.map((pro, index) => (
                          <li key={index} className="text-xs text-slate-300 flex items-start gap-1.5">
                            <span className="text-emerald-500 mt-1 shrink-0">•</span>
                            <span className="leading-relaxed">{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4.5 rounded-2xl bg-rose-500/5 border border-rose-500/10 space-y-3">
                      <h5 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Info className="w-4 h-4 text-rose-455" />
                        Key Risks & Cons
                      </h5>
                      <ul className="space-y-2">
                        {selectedAsset.cons.map((con, index) => (
                          <li key={index} className="text-xs text-slate-300 flex items-start gap-1.5">
                            <span className="text-rose-455 mt-1 shrink-0">•</span>
                            <span className="leading-relaxed">{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-850 flex flex-col sm:flex-row justify-between gap-4 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 font-extrabold uppercase">Minimum Initial Capital Required</span>
                      <p className="font-mono font-black text-white text-sm mt-0.5">{selectedAsset.minCapital}</p>
                    </div>
                    <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-slate-850 pt-2 sm:pt-0 sm:pl-4">
                      <span className="text-[10px] text-slate-500 font-extrabold uppercase">Ideal suitability profile</span>
                      <p className="font-sans font-extrabold text-indigo-350 text-xs mt-0.5">{selectedAsset.bestFor}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* HOW IT WORKS (ANALOGY) CONTENT */}
              {infoTab === 'how-it-works' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h4 className="text-xs font-extrabold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      The Clever Real-World Analogy
                    </h4>
                    <div className="text-sm text-slate-205 italic leading-relaxed bg-amber-500/5 border border-amber-500/10 p-5 rounded-2xl">
                      "{selectedAsset.analogy}"
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold text-indigo-450 uppercase tracking-widest pl-1">
                      Step-by-Step Breakdown Phase
                    </h4>
                    
                    <div className="relative border-l-2 border-slate-800 ml-4 space-y-5 py-2">
                      {selectedAsset.howItWorksSteps.map((step, idx) => (
                        <div key={idx} className="relative pl-6">
                          {/* Bullet marker */}
                          <div className="absolute -left-[7px] top-1.5 w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-indigo-500" />
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-wide">Phase {idx + 1}</span>
                            <p className="text-xs text-slate-300 leading-relaxed pr-2">{step}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* THE MATH SANDBOX CONTENT */}
              {infoTab === 'math' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-2">
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">The Core Equation Formula</span>
                    <p className="font-mono text-sm text-slate-100 font-bold bg-slate-900/40 p-3 rounded-lg text-center select-all border border-slate-850">
                      {selectedAsset.equation}
                    </p>
                  </div>

                  <div className="p-5.5 rounded-2xl bg-emerald-555/5 border border-emerald-500/10 space-y-3">
                    <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Coins className="w-4 h-4" />
                      Simple Real-Life Math Scenario
                    </h4>
                    <p className="text-xs text-slate-250 leading-relaxed">
                      How does a real investment earn money in this asset? Let\'s break down actual hypothetical values:
                    </p>
                    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-850 leading-relaxed text-xs font-medium text-slate-201 text-center">
                      {selectedAsset.mathExample}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/20 text-[10px] text-slate-400 border border-slate-850 text-center italic">
                    💡 Click on the "Compounding Sandbox" slider panel right below this card to adjust your custom principal, rate, and horizons!
                  </div>
                </div>
              )}

              {/* MYTH VS REALITY CONTENT */}
              {infoTab === 'myths' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    <div className="p-5.5 rounded-2xl bg-rose-500/5 border border-rose-500/10 space-y-2">
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[9px] font-black uppercase tracking-widest">
                        ❌ Common Myth / Misconception
                      </div>
                      <p className="text-sm text-slate-205 font-bold leading-relaxed pt-1.5">
                        "{selectedAsset.myth}"
                      </p>
                    </div>

                    <div className="p-5.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-2">
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest">
                        ✔ The Reality Check
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed pt-1.5">
                        {selectedAsset.realityCheck}
                      </p>
                    </div>

                  </div>

                  <div className="p-4.5 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-xs text-indigo-200 relative overflow-hidden">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-1">
                      💡 Legend Fact & Mythbuster
                    </span>
                    <p className="text-slate-300 italic leading-relaxed">
                      "{selectedAsset.funFact}"
                    </p>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 5. Comprehensive Beginners Side-by-Side Comparison Matrix */}
      <div className="rounded-3xl border border-slate-850 bg-slate-900 p-6 md:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-2">
          <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-400" />
            Vibrant Battle Matrix (Cheat-Sheet)
          </h3>
          <p className="text-xs text-slate-400">
            Compare returns, risks, key locks, and entry levels of each financial asset side-by-side to make perfect choices!
          </p>
        </div>

        <div className="overflow-x-auto border border-slate-850 rounded-2xl bg-slate-950/40">
          <table className="w-full text-xs text-left text-slate-300 min-w-[700px]">
            <thead className="text-[10px] uppercase font-black tracking-widest text-slate-400 bg-slate-950 border-b border-slate-850">
              <tr>
                <th scope="col" className="px-5 py-3">Asset Instrument</th>
                <th scope="col" className="px-4 py-3">Compound Return</th>
                <th scope="col" className="px-4 py-3">Capital Safety</th>
                <th scope="col" className="px-4 py-3">Liquidity Speed</th>
                <th scope="col" className="px-4 py-3">Minimum Entry</th>
                <th scope="col" className="px-4 py-3">Lock Term</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850/50">
              <tr className="hover:bg-slate-900/60 transition-colors">
                <td className="px-5 py-4 font-extrabold text-white flex items-center gap-2">
                  <span className="text-xl">📈</span> Stocks
                </td>
                <td className="px-4 py-4 text-indigo-400 font-bold">🚀 Highest (Unlimited)</td>
                <td className="px-4 py-4 text-rose-455 font-bold">⚠️ Low (Market Fluctuations)</td>
                <td className="px-4 py-4 text-cyan-400 font-black">⚡ Instant (Within Secs)</td>
                <td className="px-4 py-4 font-mono">$10 - Low</td>
                <td className="px-4 py-4 font-medium text-slate-350">None</td>
              </tr>
              <tr className="hover:bg-slate-900/60 transition-colors">
                <td className="px-5 py-4 font-extrabold text-white flex items-center gap-2">
                  <span className="text-xl">🏦</span> Fixed Deposit (FD)
                </td>
                <td className="px-4 py-4 text-emerald-450 font-bold">🛡️ Guaranteed (5%-8%)</td>
                <td className="px-4 py-4 text-emerald-450 font-black">🔒 Absolute (Federal Insured)</td>
                <td className="px-4 py-4 text-amber-500/90 font-medium">⏳ Low (Withdraw penalties)</td>
                <td className="px-4 py-4 font-mono">$100 - Medium</td>
                <td className="px-4 py-4 font-medium text-slate-350">7 Days - 10 Years</td>
              </tr>
              <tr className="hover:bg-slate-900/60 transition-colors">
                <td className="px-5 py-4 font-extrabold text-white flex items-center gap-2">
                  <span className="text-xl">⏱️</span> Recurring Deposit (RD)
                </td>
                <td className="px-4 py-4 text-emerald-450 font-bold">🛡️ Guaranteed (5%-8%)</td>
                <td className="px-4 py-4 text-emerald-450 font-black">🔒 Absolute (Federal Insured)</td>
                <td className="px-4 py-4 text-amber-500/90 font-medium">⏳ Low (Withdraw penalties)</td>
                <td className="px-4 py-4 font-mono">$10/month - Instant</td>
                <td className="px-4 py-4 font-medium text-slate-350">6 Months - 10 Years</td>
              </tr>
              <tr className="hover:bg-slate-900/60 transition-colors">
                <td className="px-5 py-4 font-extrabold text-white flex items-center gap-2">
                  <span className="text-xl">🎒</span> Mutual Funds (MF)
                </td>
                <td className="px-4 py-4 text-indigo-400 font-bold">🎯 High (8%-15% avg)</td>
                <td className="px-4 py-4 text-yellow-500/80 font-bold">⚖️ Moderate (Diversified)</td>
                <td className="px-4 py-4 text-indigo-350 font-medium">📦 Medium (1-3 Days)</td>
                <td className="px-4 py-4 font-mono">$5/month - Very Low</td>
                <td className="px-4 py-4 font-medium text-slate-350">None (Except ELSS Tax saver)</td>
              </tr>
              <tr className="hover:bg-slate-900/60 transition-colors">
                <td className="px-5 py-4 font-extrabold text-white flex items-center gap-2">
                  <span className="text-xl">💧</span> Liquidity (Cash reserves)
                </td>
                <td className="px-4 py-4 text-rose-455 font-bold">❄️ Minimal (2%-4%)</td>
                <td className="px-4 py-4 text-emerald-450 font-black">🔒 Absolute (No drops)</td>
                <td className="px-4 py-4 text-cyan-400 font-black">⚡ Instant (Immediate bank cash)</td>
                <td className="px-4 py-4 font-mono">None - Any size</td>
                <td className="px-4 py-4 font-medium text-slate-350">None</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Magic of Compounding Interactive Sandbox */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8 shadow-2xl space-y-6 relative overflow-hidden" id="compounding-interest-sandbox">
        {/* Decorative backdrop mesh */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-850 pb-4">
          <div>
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400 fill-emerald-500/15" />
              The Magic of Compounding Sandbox
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Move the sliders to visualize how compound returns build an exponential snowball over time.
            </p>
          </div>
          <div className="px-3 py-1 rounded-full text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 shrink-0 self-start sm:self-center">
            Interest compounding annually
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Sliders Input Controls */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Input 1: Principal */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-350">Initial Investment Capital</span>
                <span className="font-mono text-emerald-400 font-black text-sm">${principal.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="500"
                max="50000"
                step="500"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full h-1.5 rounded-full bg-slate-800 appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                <span>$500</span>
                <span>$25,000</span>
                <span>$50,000</span>
              </div>
            </div>

            {/* Input 2: Rate of return */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-350">Annual Return Rate</span>
                <span className="font-mono text-indigo-400 font-black text-sm">{rate}%</span>
              </div>
              <input
                type="range"
                min="2.5"
                max="25"
                step="0.5"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full h-1.5 rounded-full bg-slate-800 appearance-none cursor-pointer accent-indigo-400"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                <span>2.5% (Ultra Safe)</span>
                <span>12% (Equity average)</span>
                <span>25% (High aggressive)</span>
              </div>
            </div>

            {/* Input 3: Duration */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-350">Time Horizon (Years)</span>
                <span className="font-mono text-pink-400 font-black text-sm">{years} Years</span>
              </div>
              <input
                type="range"
                min="1"
                max="35"
                step="1"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full h-1.5 rounded-full bg-slate-800 appearance-none cursor-pointer accent-pink-400"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                <span>1 Year</span>
                <span>15 Years</span>
                <span>35 Years (Retirement horizon)</span>
              </div>
            </div>

          </div>

          {/* Graphical compound metrics / fun visualizers */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            
            <div className="grid grid-cols-2 gap-3.5">
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-850">
                <p className="text-[10px] text-slate-500 font-extrabold uppercase">Total Accumulated Capital</p>
                <p className="text-2xl font-black text-white mt-1 shrink-0">
                  ${Math.round(compoundValue).toLocaleString()}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-850">
                <p className="text-[10px] text-slate-500 font-extrabold uppercase">Pure Compounded Gain</p>
                <p className="text-2xl font-black text-emerald-400 mt-1">
                  ${Math.round(interestEarned).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Bar chart visuals */}
            <div className="p-4 bg-slate-950/60 border border-slate-850 rounded-xl space-y-3 relative overflow-hidden">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Growth Structure Comparison
              </p>
              <div className="space-y-2.5 pt-1">
                {/* Principal bar */}
                <div>
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>Base Investment Capital</span>
                    <span className="font-bold font-mono">${principal.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-500 transition-all duration-300" style={{ width: '40%' }} />
                  </div>
                </div>

                {/* Compound Growth value bar */}
                <div>
                  <div className="flex justify-between text-[10px] text-emerald-400 mb-1">
                    <span>Maturity Yield (with compound magic)</span>
                    <span className="font-bold font-mono">${Math.round(compoundValue).toLocaleString()}</span>
                  </div>
                  <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300" 
                      style={{ width: `${Math.min(100, Math.max(40, (compoundValue / (principal * 6)) * 100))}%` }} 
                    />
                  </div>
                </div>
              </div>

              {compoundingDifference > 50 && (
                <div className="text-[10px] text-indigo-350 bg-indigo-500/5 p-2 rounded-lg border border-indigo-500/10 leading-relaxed text-center font-medium">
                  🚀 Your money grew by an extra <strong>${Math.round(compoundingDifference).toLocaleString()}</strong> pure cash compared to putting it in lockbox! นั่น is the power of compounding interest.
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* 7. Playful Personality Quiz Segment */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow and decoration */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2 pb-2">
            <h3 className="text-2xl font-extrabold text-white flex items-center justify-center gap-2">
              <Award className="w-6 h-6 text-pink-400" />
              What Kind of Investor Are You?
            </h3>
            <p className="text-xs text-slate-400">
              Take this cute 3-question profile explorer to test your danger threshold & unlock custom advice badge.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {quizStep === 0 && (
              <motion.div
                key="quiz-start"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center p-6 bg-slate-950/60 rounded-2xl border border-slate-850 space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center text-3xl mx-auto shadow-lg shadow-indigo-500/10 select-none">
                  🕵️‍♂️
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-sm font-bold text-white">Unlock Your Investor Badge</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                    No complicated tests or heavy equations. Answer based on how you actually feel about cash fluctuations.
                  </p>
                </div>
                <button
                  onClick={() => setQuizStep(1)}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-400 hover:to-indigo-400 text-white font-extrabold text-xs transition duration-300 cursor-pointer shadow-lg shadow-indigo-500/10"
                >
                  Start Spark Quiz
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {quizStep >= 1 && quizStep <= 3 && (
              <motion.div
                key={`quiz-q-${activeQuestion}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                className="space-y-5 p-5 bg-slate-950/45 rounded-2xl border border-slate-850"
              >
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span className="font-extrabold text-indigo-400">Question {activeQuestion + 1} of 3</span>
                  <span className="font-mono font-medium">{Math.round(((activeQuestion + 1) / 3) * 100)}% Complete</span>
                </div>

                <h4 className="text-base font-bold text-white leading-relaxed">
                  {QUIZ_QUESTIONS[activeQuestion].question}
                </h4>

                <div className="space-y-2.5 pt-1">
                  {QUIZ_QUESTIONS[activeQuestion].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswerSelect(opt.score)}
                      className="w-full text-left p-3.5 rounded-xl border border-slate-850 hover:border-indigo-500/35 bg-slate-900/60 hover:bg-slate-900 text-xs text-slate-300 hover:text-white font-medium transition duration-200 cursor-pointer flex items-center justify-between group"
                    >
                      <span>{opt.text}</span>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {quizStep === 4 && (
              <motion.div
                key="quiz-result"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 rounded-2xl border text-center space-y-6 bg-slate-950/85"
              >
                {(() => {
                  const result = getQuizResult();
                  return (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                          Spark Profile Generated!
                        </span>
                        
                        <div className={`inline-flex items-center justify-center px-5 py-2 rounded-2xl border text-sm font-black uppercase tracking-wider ${result.colorClass} shadow-lg select-none`}>
                          {result.badge}
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                        {result.desc}
                      </p>

                      <div className="text-left max-w-md mx-auto p-4 rounded-xl bg-slate-900/90 border border-slate-850 space-y-2.5">
                        <h4 className="text-[11px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                          ⭐ Recommended Guidelines
                        </h4>
                        <ul className="space-y-2">
                          {result.tips.map((tip, idx) => (
                            <li key={idx} className="text-[11px] text-slate-320 flex items-start gap-1.5">
                              <span className="text-indigo-400 shrink-0 mt-0.5 font-bold">✔</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={resetQuiz}
                        className="px-5 py-2 rounded-xl text-xs font-bold border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
                      >
                        Reset Personality Quiz
                      </button>
                    </div>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}
