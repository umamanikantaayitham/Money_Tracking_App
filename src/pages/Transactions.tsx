import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { Transaction } from '../types';
import { Search, Trash2 } from 'lucide-react';
import { supabase } from '../supabase';
import { useToastStore } from '../store/useToastStore';

const Transactions = () => {
  const { incomes, expenses } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { addToast } = useToastStore();

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

  const confirmDelete = async () => {
    if (!transactionToDelete) return;
    setIsDeleting(true);
    
    const table = transactionToDelete.type === 'income' ? 'income' : 'expenses';
    const { error } = await supabase.from(table).delete().eq('id', transactionToDelete.id);
    
    if (!error) {
      addToast('Transaction deleted successfully', 'success');
    } else {
      addToast('Failed to delete transaction', 'error');
    }
    
    setIsDeleting(false);
    setTransactionToDelete(null);
  };

  return (
    <div className="min-h-screen bg-[#F8F9F9] dark:bg-gray-900 pb-24">
      
      {/* Top Header Section with Teal Gradient */}
      <div className="bg-primary rounded-b-[40px] px-6 pt-14 pb-8 shadow-md relative z-10">
        <h2 className="text-2xl font-bold text-white text-center tracking-wide">Transaction History</h2>
      </div>

      {/* Main Content Area */}
      <div className="px-6 -mt-4 relative z-20 space-y-6">
        
        {/* Search and Filter Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search transactions..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex justify-between bg-gray-50 dark:bg-gray-900 rounded-xl p-1">
            {(['all', 'income', 'expense'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`flex-1 py-2 rounded-lg text-sm font-bold capitalize transition-all duration-300 ${
                  filterType === type 
                    ? 'bg-primary text-white shadow-md shadow-primary/30' 
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Transaction List */}
        <div className="space-y-4">
          {filteredTransactions.map(t => (
            <div key={`${t.type}-${t.id}`} className="bg-white dark:bg-gray-800 rounded-2xl p-4 flex items-center justify-between shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${t.type === 'income' ? 'bg-[#E5F5E9] text-[#2EA265]' : 'bg-[#FEECEB] text-[#E04F5F]'}`}>
                  {(t.type === 'income' ? t.source : t.expense_name).charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-base">
                    {t.type === 'income' ? t.source : t.expense_name}
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5 font-medium">{t.transaction_date}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className={`font-bold text-base tracking-tight ${t.type === 'income' ? 'text-[#2EA265]' : 'text-[#E04F5F]'}`}>
                  {t.type === 'income' ? '+' : '-'}₹{Number(t.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <button onClick={() => setTransactionToDelete(t)} className="text-gray-300 hover:text-red-500 transition-colors p-2 active:scale-90">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}

          {filteredTransactions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Search size={32} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No Transactions Found</h3>
              <p className="text-sm text-gray-400 px-8">We couldn't find any transactions matching your current search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {transactionToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={32} className="text-red-500" />
            </div>
            <h3 className="text-xl font-extrabold text-center text-gray-900 dark:text-white mb-2">Delete Transaction?</h3>
            <p className="text-center text-gray-500 dark:text-gray-400 font-medium mb-6">
              Are you sure you want to delete <span className="font-bold text-gray-900 dark:text-gray-200">"{transactionToDelete.type === 'income' ? transactionToDelete.source : transactionToDelete.expense_name}"</span> for <span className="font-bold text-gray-900 dark:text-gray-200">₹{transactionToDelete.amount}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setTransactionToDelete(null)}
                disabled={isDeleting}
                className="flex-1 py-3.5 rounded-xl font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 py-3.5 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-70 flex items-center justify-center"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
