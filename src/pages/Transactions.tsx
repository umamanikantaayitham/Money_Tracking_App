import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { Transaction } from '../types';
import { Search, TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import { supabase } from '../supabase';

const Transactions = () => {
  const { incomes, expenses } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  const transactions: Transaction[] = useMemo(() => {
    const combined: Transaction[] = [
      ...incomes.map(i => ({ ...i, type: 'income' as const })),
      ...expenses.map(e => ({ ...e, type: 'expense' as const }))
    ];
    return combined.sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime());
  }, [incomes, expenses]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = 
        (t.type === 'income' ? t.source : t.expense_name).toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'all' || t.type === filterType;
      
      return matchesSearch && matchesType;
    });
  }, [transactions, searchTerm, filterType]);

  const handleDelete = async (t: Transaction) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    
    const table = t.type === 'income' ? 'income' : 'expenses';
    await supabase.from(table).delete().eq('id', t.id);
    // Realtime will auto-update state
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Transaction History</h2>

      <div className="glass-panel p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search transactions..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'income', 'expense'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filterType === type 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredTransactions.map(t => (
          <div key={`${t.type}-${t.id}`} className="glass-panel p-4 flex items-center justify-between hover:scale-[1.01] transition-transform">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${t.type === 'income' ? 'bg-primary/10 text-primary' : 'bg-red-500/10 text-red-500'}`}>
                {t.type === 'income' ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
              </div>
              <div>
                <h4 className="font-semibold">{t.type === 'income' ? t.source : t.expense_name}</h4>
                <div className="flex gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">{t.category}</span>
                  <span>{t.transaction_date}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className={`font-bold ${t.type === 'income' ? 'text-primary' : 'text-red-500'}`}>
                {t.type === 'income' ? '+' : '-'}₹{Number(t.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <button onClick={() => handleDelete(t)} className="text-gray-400 hover:text-red-500 transition-colors p-2">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No transactions found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
