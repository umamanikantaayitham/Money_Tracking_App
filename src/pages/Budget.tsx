import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { supabase } from '../supabase';
import { PlusCircle, Target } from 'lucide-react';

const CATEGORIES = ['Food', 'Groceries', 'Rent', 'Transport', 'Shopping', 'Entertainment', 'Others'];

const Budget = () => {
  const { user, budgets, expenses } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({ category: CATEGORIES[0], amount: '' });
  const [loading, setLoading] = useState(false);

  const currentMonth = new Date().toISOString().slice(0, 7);

  const currentBudgets = useMemo(() => {
    return budgets.filter(b => b.month === currentMonth);
  }, [budgets, currentMonth]);

  const categoryExpenses = useMemo(() => {
    const cats: Record<string, number> = {};
    expenses
      .filter(e => e.transaction_date.startsWith(currentMonth))
      .forEach(e => {
        cats[e.category] = (cats[e.category] || 0) + Number(e.amount);
      });
    return cats;
  }, [expenses, currentMonth]);

  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const { error } = await supabase.from('budgets').upsert({
      user_id: user.id,
      category: formData.category,
      budget_amount: parseFloat(formData.amount),
      month: currentMonth
    }, { onConflict: 'user_id, category, month' });

    setLoading(false);
    if (!error) {
      setShowAdd(false);
      setFormData({ category: CATEGORIES[0], amount: '' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Monthly Budget</h2>
        <button 
          onClick={() => setShowAdd(!showAdd)} 
          className="btn-primary py-2 px-4 text-sm"
        >
          <PlusCircle size={16} /> New Budget
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAddBudget} className="glass-panel p-6 flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full">
            <label className="label">Category</label>
            <select 
              className="input-field"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="w-full">
            <label className="label">Budget Amount</label>
            <input 
              type="number" 
              required
              step="0.01"
              className="input-field" 
              placeholder="0.00"
              value={formData.amount}
              onChange={e => setFormData({...formData, amount: e.target.value})}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full md:w-auto h-12">
            {loading ? 'Saving...' : 'Save'}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentBudgets.map(budget => {
          const spent = categoryExpenses[budget.category] || 0;
          const percentage = Math.min((spent / budget.budget_amount) * 100, 100);
          const isOver = spent > budget.budget_amount;

          return (
            <div key={budget.id} className="glass-panel p-6">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Target size={18} className="text-primary" /> {budget.category}
                </h4>
                <span className="text-sm text-gray-500">{percentage.toFixed(0)}% Used</span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4 overflow-hidden">
                <div 
                  className={`h-2.5 rounded-full ${isOver ? 'bg-red-500' : 'bg-primary'}`} 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Spent: ₹{spent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">Limit: ₹{budget.budget_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          );
        })}
        
        {currentBudgets.length === 0 && !showAdd && (
          <div className="col-span-full glass-panel p-12 text-center text-gray-500">
            No budgets set for this month. Create one to start tracking!
          </div>
        )}
      </div>
    </div>
  );
};

export default Budget;
