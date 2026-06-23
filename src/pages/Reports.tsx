import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { Pie } from 'react-chartjs-2';
import { Calendar } from 'lucide-react';

const Reports = () => {
  const { incomes, expenses } = useStore();
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

  const filteredData = useMemo(() => {
    let inc = incomes;
    let exp = expenses;

    if (reportType === 'monthly') {
      inc = incomes.filter(i => i.transaction_date.startsWith(selectedDate));
      exp = expenses.filter(e => e.transaction_date.startsWith(selectedDate));
    } else if (reportType === 'daily') {
      const todayStr = new Date().toISOString().split('T')[0];
      inc = incomes.filter(i => i.transaction_date === todayStr);
      exp = expenses.filter(e => e.transaction_date === todayStr);
    }

    return { inc, exp };
  }, [incomes, expenses, reportType, selectedDate]);

  const totalInc = filteredData.inc.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalExp = filteredData.exp.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const savings = totalInc - totalExp;

  const expensesByCategory = useMemo(() => {
    const cats: Record<string, number> = {};
    filteredData.exp.forEach(e => {
      cats[e.category] = (cats[e.category] || 0) + Number(e.amount);
    });
    return cats;
  }, [filteredData.exp]);

  const pieData = {
    labels: Object.keys(expensesByCategory),
    datasets: [
      {
        data: Object.values(expensesByCategory),
        backgroundColor: [
          '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e'
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Financial Reports</h2>

      <div className="glass-panel p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-full sm:w-auto">
          {(['daily', 'weekly', 'monthly'] as const).map(type => (
            <button
              key={type}
              onClick={() => setReportType(type)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                reportType === type ? 'bg-white dark:bg-gray-700 shadow text-primary' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {reportType === 'monthly' && (
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-xl w-full sm:w-auto">
            <Calendar size={18} className="text-gray-500" />
            <input 
              type="month" 
              className="bg-transparent outline-none text-sm font-medium dark:text-white"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-6 text-center">
          <p className="text-gray-500 mb-1">Income</p>
          <p className="text-2xl font-bold text-primary">₹{totalInc.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="glass-panel p-6 text-center">
          <p className="text-gray-500 mb-1">Expenses</p>
          <p className="text-2xl font-bold text-red-500">₹{totalExp.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="glass-panel p-6 text-center">
          <p className="text-gray-500 mb-1">Savings</p>
          <p className={`text-2xl font-bold ${savings >= 0 ? 'text-primary' : 'text-red-500'}`}>
            ₹{savings.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {Object.keys(expensesByCategory).length > 0 ? (
        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold mb-6 text-center">Expenses by Category</h3>
          <div className="h-[300px] flex justify-center">
            <Pie data={pieData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }} />
          </div>
        </div>
      ) : (
        <div className="glass-panel p-12 text-center text-gray-500">
          No expense data available for this period.
        </div>
      )}
    </div>
  );
};

export default Reports;
