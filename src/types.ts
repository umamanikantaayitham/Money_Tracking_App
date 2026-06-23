export type User = {
  id: string;
  email: string;
  name?: string;
};

export type Income = {
  id: string;
  user_id: string;
  amount: number;
  source: string;
  category: string;
  notes?: string;
  transaction_date: string;
  created_at: string;
};

export type Expense = {
  id: string;
  user_id: string;
  amount: number;
  expense_name: string;
  category: string;
  notes?: string;
  transaction_date: string;
  created_at: string;
};

export type Budget = {
  id: string;
  user_id: string;
  category: string;
  budget_amount: number;
  month: string; // YYYY-MM
  created_at: string;
};

export type Transaction = (Income & { type: 'income' }) | (Expense & { type: 'expense' });
