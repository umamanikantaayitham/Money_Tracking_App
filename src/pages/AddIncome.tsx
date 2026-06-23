import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { useStore } from '../store/useStore';
import { PlusCircle } from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';

const INCOME_CATEGORIES = ['Salary', 'Freelancing', 'Business', 'Bonus', 'Investments', 'Rental Income', 'Other'];

type IncomeFormInputs = {
  amount: string;
  source: string;
  category: string;
  transaction_date: string;
  notes: string;
};

const AddIncome = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<IncomeFormInputs>({
    defaultValues: {
      category: INCOME_CATEGORIES[0],
      transaction_date: new Date().toISOString().split('T')[0],
      notes: ''
    }
  });

  const onSubmit: SubmitHandler<IncomeFormInputs> = async (data) => {
    if (!user) return;
    
    setLoading(true);
    const { error } = await supabase.from('income').insert([{
      user_id: user.id,
      amount: parseFloat(data.amount),
      source: data.source,
      category: data.category,
      transaction_date: data.transaction_date,
      notes: data.notes
    }]);

    setLoading(false);
    if (!error) {
      navigate('/');
    } else {
      alert('Error adding income');
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Add Income</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="glass-panel p-6 space-y-5">
        <div>
          <label className="label">Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
            <input
              type="number"
              step="0.01"
              {...register('amount', { required: true, min: 0.01 })}
              className={`input-field pl-8 ${errors.amount ? 'border-red-500' : ''}`}
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="label">Income Source</label>
          <input
            type="text"
            {...register('source', { required: true })}
            className={`input-field ${errors.source ? 'border-red-500' : ''}`}
            placeholder="e.g. Google LLC"
          />
        </div>

        <div>
          <label className="label">Category</label>
          <select
            {...register('category', { required: true })}
            className="input-field"
          >
            {INCOME_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div>
          <label className="label">Date</label>
          <input
            type="date"
            {...register('transaction_date', { required: true })}
            className={`input-field ${errors.transaction_date ? 'border-red-500' : ''}`}
          />
        </div>

        <div>
          <label className="label">Notes (Optional)</label>
          <textarea
            {...register('notes')}
            className="input-field min-h-[100px]"
            placeholder="Add some details..."
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full mt-4">
          <PlusCircle size={20} />
          {loading ? 'Saving...' : 'Add Income'}
        </button>
      </form>
    </div>
  );
};

export default AddIncome;
