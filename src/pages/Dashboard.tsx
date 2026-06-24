import { useStore } from '../store/useStore';
import { useFinanceData } from '../hooks/useFinanceData';
import { useSmsScanner } from '../hooks/useSmsScanner';
import { ArrowDown, ArrowUp, MoreHorizontal, ChevronUp, TrendingUp, Newspaper, MessageSquareCode, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Transaction } from '../types';
import { useState, useEffect } from 'react';

const Dashboard = () => {
  useFinanceData();
  const { incomes, expenses } = useStore();
  const { scanLatestSMS, isScanning } = useSmsScanner();

  const totalIncome = incomes.reduce((sum, item) => sum + Number(item.amount), 0);
  const totalExpense = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const currentBalance = totalIncome - totalExpense;

  // Combine and sort transactions
  const transactions: Transaction[] = [
    ...incomes.map(i => ({ ...i, type: 'income' as const })),
    ...expenses.map(e => ({ ...e, type: 'expense' as const }))
  ].sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime()).slice(0, 4);

  // Free API States
  const [cryptoPrices, setCryptoPrices] = useState<{bitcoin?: number, ethereum?: number}>({});
  
  const news = [
    { 
      url: '#', 
      imageurl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=200&q=80', 
      source: 'Finance Weekly', 
      title: 'Global Markets Rally as Tech Stocks Surge This Week' 
    },
    { 
      url: '#', 
      imageurl: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=200&q=80', 
      source: 'Crypto Insider', 
      title: 'Bitcoin Breaks New Resistance Levels Amid Institutional Buying' 
    },
    { 
      url: '#', 
      imageurl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=200&q=80', 
      source: 'Market Watch', 
      title: 'Top 5 Strategies for Managing Your Portfolio in 2026' 
    }
  ];

  useEffect(() => {
    // 1. Fetch Live Crypto Prices (CoinGecko API - Free, No Key)
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=inr')
      .then(res => res.json())
      .then(data => {
        setCryptoPrices({
          bitcoin: data.bitcoin?.inr,
          ethereum: data.ethereum?.inr
        });
      })
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9F9] dark:bg-gray-900 pb-24">
      
      {/* Top Teal Curved Header */}
      <div className="bg-[#3E7C78] rounded-b-[40px] px-6 pt-16 pb-12 shadow-[0_10px_30px_rgb(62,124,120,0.2)] relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
            <span className="text-white/80 font-medium text-sm flex items-center gap-1">
              Total Balance <ChevronUp size={14} className="opacity-80" />
            </span>
            <h2 className="text-4xl font-extrabold text-white mt-1 tracking-tight">
              ₹ {currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h2>
          </div>
          <button className="text-white p-2 bg-white/10 rounded-full hover:bg-white/20 backdrop-blur-sm transition">
            <MoreHorizontal size={24} />
          </button>
        </div>

        <div className="flex justify-between items-center mt-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <ArrowDown size={18} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-white/80 text-xs font-medium mb-0.5">Income</p>
              <p className="text-white font-bold text-lg tracking-tight">
                ₹ {totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-right">
            <div>
              <p className="text-white/80 text-xs font-medium mb-0.5">Expenses</p>
              <p className="text-white font-bold text-lg tracking-tight">
                ₹ {totalExpense.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <ArrowUp size={18} strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="px-6 relative z-20 space-y-8 mt-6">
        
        {/* Transactions History */}
        <div>
          <div className="flex justify-between items-end mb-4 px-1">
            <h3 className="text-[19px] font-extrabold text-gray-900 dark:text-white">Transactions History</h3>
            <Link to="/transactions" className="text-sm font-bold text-gray-400 hover:text-primary transition-colors">See all</Link>
          </div>

          <div className="space-y-3">
            {transactions.map(t => (
              <div key={`${t.type}-${t.id}`} className="bg-white dark:bg-gray-800 rounded-3xl p-4 flex items-center justify-between shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl ${t.type === 'income' ? 'bg-[#E5F5E9] text-[#2EA265]' : 'bg-[#FEECEB] text-[#E04F5F]'}`}>
                    {(t.type === 'income' ? t.source : t.expense_name).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-[16px]">
                      {t.type === 'income' ? t.source : t.expense_name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 font-medium">{t.transaction_date}</p>
                  </div>
                </div>
                <p className={`font-bold text-[16px] tracking-tight ${t.type === 'income' ? 'text-[#2EA265]' : 'text-[#E04F5F]'}`}>
                  {t.type === 'income' ? '+' : '-'} ₹ {Number(t.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
            ))}

            {transactions.length === 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 text-center shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                <p className="text-gray-400 font-medium">No recent transactions</p>
              </div>
            )}
          </div>
        </div>

        {/* AI Bank SMS Sync Tool */}
        <div className="pt-2">
          <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-3xl p-5 shadow-lg relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10">
              <MessageSquareCode size={100} />
            </div>
            <div className="relative z-10">
              <h3 className="text-white font-extrabold text-lg tracking-tight mb-1">Auto-Sync Bank SMS</h3>
              <p className="text-white/80 text-sm font-medium mb-4 leading-snug">
                Let AI scan your recent SMS messages to auto-detect bank expenses.
              </p>
              <button 
                onClick={scanLatestSMS}
                disabled={isScanning}
                className="bg-white text-emerald-600 font-bold px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2 hover:bg-gray-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isScanning ? (
                  <><RefreshCw size={18} className="animate-spin" /> Scanning...</>
                ) : (
                  <><MessageSquareCode size={18} /> Scan Messages Now</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Free API 1: Live Crypto Ticker */}
        <div className="pt-2">
          <div className="flex justify-between items-end mb-4 px-1">
            <h3 className="text-[19px] font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="text-primary" /> Live Markets
            </h3>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-1">
            <div className="min-w-[160px] bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-[0_4px_15px_rgb(0,0,0,0.03)] border border-gray-50 dark:border-gray-700 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#F7931A]/20 flex items-center justify-center text-[#F7931A] font-bold text-xs">B</div>
                <span className="font-bold text-gray-500 text-sm">Bitcoin</span>
              </div>
              <p className="font-extrabold text-gray-900 dark:text-white mt-1">
                {cryptoPrices.bitcoin ? `₹${cryptoPrices.bitcoin.toLocaleString()}` : 'Loading...'}
              </p>
            </div>
            <div className="min-w-[160px] bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-[0_4px_15px_rgb(0,0,0,0.03)] border border-gray-50 dark:border-gray-700 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#627EEA]/20 flex items-center justify-center text-[#627EEA] font-bold text-xs">E</div>
                <span className="font-bold text-gray-500 text-sm">Ethereum</span>
              </div>
              <p className="font-extrabold text-gray-900 dark:text-white mt-1">
                {cryptoPrices.ethereum ? `₹${cryptoPrices.ethereum.toLocaleString()}` : 'Loading...'}
              </p>
            </div>
          </div>
        </div>

        {/* Free API 2: Live Financial News */}
        <div className="pt-2">
          <div className="flex justify-between items-end mb-4 px-1">
            <h3 className="text-[19px] font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Newspaper className="text-primary" /> Market News
            </h3>
          </div>
          <div className="space-y-3">
            {news.map((item, index) => (
              <a key={index} href={item.url} target="_blank" rel="noreferrer" className="block bg-white dark:bg-gray-800 rounded-3xl p-4 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md transition-shadow">
                <div className="flex gap-4">
                  <img src={item.imageurl} alt="news" className="w-20 h-20 rounded-xl object-cover bg-gray-100" />
                  <div className="flex-1">
                    <p className="text-xs text-primary font-bold mb-1">{item.source}</p>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-2 leading-snug">
                      {item.title}
                    </h4>
                  </div>
                </div>
              </a>
            ))}
            {news.length === 0 && (
              <div className="text-center p-4 text-gray-400">Loading news...</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
