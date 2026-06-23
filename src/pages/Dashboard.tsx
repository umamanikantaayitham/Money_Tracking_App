import { useStore } from '../store/useStore';
import { useFinanceData } from '../hooks/useFinanceData';
import { ArrowDown, ArrowUp, MoreHorizontal, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Transaction } from '../types';

const Dashboard = () => {
  useFinanceData();
  const { incomes, expenses, isLoading } = useStore();

  const totalIncome = incomes.reduce((sum, item) => sum + Number(item.amount), 0);
  const totalExpense = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const currentBalance = totalIncome - totalExpense;

  // Combine and sort transactions
  const transactions: Transaction[] = [
    ...incomes.map(i => ({ ...i, type: 'income' as const })),
    ...expenses.map(e => ({ ...e, type: 'expense' as const }))
  ].sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime()).slice(0, 4);

  return (
    <div className="px-6 pt-12 pb-6">
      <div className="curved-bg" />
      
      {/* Header Info */}
      <div className="text-white mb-8">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <span className="text-white/80 font-medium">Total Balance</span>
            <ChevronUp size={16} className="text-white/80" />
          </div>
          <button className="text-white/80 hover:text-white transition">
            <MoreHorizontal size={24} />
          </button>
        </div>
        <h2 className="text-4xl font-bold mb-8">
          ₹ {currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </h2>

        <div className="flex justify-between items-center pr-4">
          <div>
            <div className="flex items-center gap-2 text-white/80 mb-1">
              <div className="bg-white/20 p-1 rounded-full">
                <ArrowDown size={14} />
              </div>
              <span>Income</span>
            </div>
            <p className="text-xl font-semibold">
              ₹ {totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-white/80 mb-1 justify-end">
              <div className="bg-white/20 p-1 rounded-full">
                <ArrowUp size={14} />
              </div>
              <span>Expenses</span>
            </div>
            <p className="text-xl font-semibold">
              ₹ {totalExpense.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Transactions History */}
      <div className="mt-12">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Transactions History</h3>
          <Link to="/transactions" className="text-sm text-gray-500 hover:text-primary transition">See all</Link>
        </div>

        <div className="space-y-4">
          {transactions.map(t => (
            <div key={t.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl ${t.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {(t.type === 'income' ? t.source : t.expense_name).charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">
                    {t.type === 'income' ? t.source : t.expense_name}
                  </p>
                  <p className="text-xs text-gray-500">{t.transaction_date}</p>
                </div>
              </div>
              <p className={`font-bold ${t.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                {t.type === 'income' ? '+' : '-'} ₹ {Number(t.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Send Again */}
      <div className="mt-8 mb-4">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Send Again</h3>
          <span className="text-sm text-gray-500 cursor-pointer">See all</span>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {['A', 'B', 'C', 'D'].map((initial, i) => (
            <div key={i} className="flex-shrink-0 w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-lg font-bold text-gray-600 dark:text-gray-300">
              {initial}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
