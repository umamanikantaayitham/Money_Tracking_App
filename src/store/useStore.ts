import { create } from 'zustand';
import { User, Income, Expense, Budget } from '../types';

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  incomes: Income[];
  setIncomes: (incomes: Income[]) => void;
  
  expenses: Expense[];
  setExpenses: (expenses: Expense[]) => void;

  budgets: Budget[];
  setBudgets: (budgets: Budget[]) => void;

  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { theme: newTheme };
  }),

  incomes: [],
  setIncomes: (incomes) => set({ incomes }),

  expenses: [],
  setExpenses: (expenses) => set({ expenses }),

  budgets: [],
  setBudgets: (budgets) => set({ budgets }),

  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
}));
