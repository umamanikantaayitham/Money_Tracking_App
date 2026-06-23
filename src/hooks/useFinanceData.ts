import { useEffect, useCallback } from 'react';
import { supabase } from '../supabase';
import { useStore } from '../store/useStore';
import { Income, Expense, Budget } from '../types';

export const useFinanceData = () => {
  const { user, setIncomes, setExpenses, setBudgets, setIsLoading } = useStore();

  const fetchData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const [incomeRes, expenseRes, budgetRes] = await Promise.all([
        supabase.from('income').select('*').order('transaction_date', { ascending: false }),
        supabase.from('expenses').select('*').order('transaction_date', { ascending: false }),
        supabase.from('budgets').select('*')
      ]);

      if (incomeRes.error) throw incomeRes.error;
      if (expenseRes.error) throw expenseRes.error;
      if (budgetRes.error) throw budgetRes.error;

      setIncomes(incomeRes.data as Income[]);
      setExpenses(expenseRes.data as Expense[]);
      setBudgets(budgetRes.data as Budget[]);
    } catch (error) {
      console.error('Error fetching finance data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, setIncomes, setExpenses, setBudgets, setIsLoading]);

  useEffect(() => {
    fetchData();

    if (!user) return;

    // Realtime subscriptions
    const incomeSub = supabase.channel('income-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'income', filter: `user_id=eq.${user.id}` }, fetchData)
      .subscribe();

    const expenseSub = supabase.channel('expense-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses', filter: `user_id=eq.${user.id}` }, fetchData)
      .subscribe();

    const budgetSub = supabase.channel('budget-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'budgets', filter: `user_id=eq.${user.id}` }, fetchData)
      .subscribe();

    return () => {
      supabase.removeChannel(incomeSub);
      supabase.removeChannel(expenseSub);
      supabase.removeChannel(budgetSub);
    };
  }, [user, fetchData]);

  return { refresh: fetchData };
};
