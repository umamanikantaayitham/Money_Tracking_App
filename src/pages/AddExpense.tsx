import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { useStore } from '../store/useStore';
import { ChevronLeft, MoreHorizontal, Plus } from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';

const EXPENSE_CATEGORIES = ['Netflix', 'Food', 'Groceries', 'Rent', 'Electricity', 'Internet', 'Transport', 'Shopping'];

type FormInputs = {
  amount: string;
  name: string; // Used for both source and expense_name
  category: string;
  transaction_date: string;
  notes: string;
};

const AddExpense = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<'expense' | 'income'>('expense');

  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<FormInputs>({
    defaultValues: {
      category: EXPENSE_CATEGORIES[0],
      transaction_date: new Date().toISOString().split('T')[0],
      notes: ''
    }
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (!user) return;
    setLoading(true);

    const table = type === 'income' ? 'income' : 'expenses';
    const payload = type === 'income' 
      ? { user_id: user.id, source: data.name, amount: parseFloat(data.amount), category: data.category, transaction_date: data.transaction_date, notes: data.notes }
      : { user_id: user.id, expense_name: data.name, amount: parseFloat(data.amount), category: data.category, transaction_date: data.transaction_date, notes: data.notes };

    const { error } = await supabase.from(table).insert([payload]);

    setLoading(false);
    if (!error) {
      navigate('/');
    } else {
      alert(`Error adding ${type}`);
    }
  };

  const handleClear = () => {
    setValue('amount', '');
  };

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <div className="flex justify-between items-center p-6 text-white pt-12">
        <button onClick={() => navigate(-1)}><ChevronLeft size={28} /></button>
        <h2 className="text-xl font-medium">Add {type === 'income' ? 'Income' : 'Expense'}</h2>
        <button><MoreHorizontal size={28} /></button>
      </div>

      {/* Type Toggle */}
      <div className="px-6 mb-2">
        <div className="flex justify-between items-center bg-white/20 rounded-xl p-1 backdrop-blur-md">
          <button
            onClick={() => { setType('expense'); reset(); }}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${type === 'expense' ? 'bg-white text-primary shadow-sm' : 'text-white'}`}
          >
            Expense
          </button>
          <button
            onClick={() => { setType('income'); reset(); }}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${type === 'income' ? 'bg-white text-primary shadow-sm' : 'text-white'}`}
          >
            Income
          </button>
        </div>
      </div>
      
      {/* Form Card */}
      <div className="bg-white dark:bg-gray-900 rounded-t-[40px] mt-4 min-h-[calc(100vh-120px)] p-8 shadow-2xl relative">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Category</label>
            <div className="relative">
              <select
                {...register('category', { required: true })}
                className="w-full pl-14 pr-10 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium appearance-none outline-none focus:border-primary"
              >
                {EXPENSE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black text-red-600 flex items-center justify-center font-bold">
                N
              </div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1.5L6 6.5L11 1.5" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Name</label>
            <input
              type="text"
              {...register('name', { required: true })}
              className={`w-full px-4 py-4 rounded-2xl border ${errors.name ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium outline-none focus:border-primary`}
              placeholder={type === 'income' ? 'Salary, Freelance...' : 'Netflix, Rent...'}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-medium">₹</span>
              <input
                type="number"
                step="0.01"
                inputMode="decimal"
                {...register('amount', { required: true, min: 0.01 })}
                className={`w-full pl-8 pr-16 py-4 rounded-2xl border ${errors.amount ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium outline-none focus:border-primary`}
                placeholder="0.00"
              />
              <button type="button" onClick={handleClear} className="absolute right-4 top-1/2 -translate-y-1/2 text-primary text-sm font-medium">
                Clear
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Date</label>
            <input
              type="date"
              {...register('transaction_date', { required: true })}
              className={`w-full px-4 py-4 rounded-2xl border ${errors.transaction_date ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium outline-none focus:border-primary`}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Invoice</label>
            <button type="button" className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 text-gray-500 flex items-center justify-center gap-2 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              <Plus size={20} className="bg-gray-500 text-white rounded-full p-0.5" />
              Add Invoice
            </button>
          </div>

          {/* Hidden submit so we can trigger via native keyboard */}
          <button type="submit" disabled={loading} className="w-full bg-primary text-white py-4 rounded-2xl font-semibold shadow-lg shadow-primary/30 mt-8">
            {loading ? 'Saving...' : 'Confirm Expense'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
