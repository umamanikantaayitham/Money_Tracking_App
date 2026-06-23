import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { ArrowUpDown } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Analytics = () => {
  const { expenses } = useStore();
  const [timeFilter, setTimeFilter] = useState('Day');

  // Dummy chart data matching the smooth bezier curve from screenshot
  const chartData = {
    labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    datasets: [
      {
        label: 'Expense',
        data: [400, 600, 1230, 800, 1000, 600, 800],
        borderColor: '#438883',
        backgroundColor: 'rgba(67, 136, 131, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#438883',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: (ctx: any) => ctx.dataIndex === 2 ? 6 : 0, // Only show point on 'May'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, border: { display: false } },
      y: { display: false } // Hide y axis like in screenshot
    }
  };

  const topSpending = expenses.slice(0, 3); // Get top 3 (in a real app, sort by amount)

  return (
    <div className="px-6 pt-12 pb-6">
      
      {/* Top Toggle */}
      <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-6">
        {['Day', 'Week', 'Month', 'Year'].map(t => (
          <button
            key={t}
            onClick={() => setTimeFilter(t)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
              timeFilter === t ? 'bg-primary text-white' : 'text-gray-500'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex justify-end mb-4">
        <select className="border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-900 outline-none">
          <option>Expense</option>
          <option>Income</option>
        </select>
      </div>

      {/* Chart */}
      <div className="h-[200px] mb-8 relative">
        <Line data={chartData} options={chartOptions as any} />
      </div>

      {/* Top Spending */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Top Spending</h3>
          <button className="text-gray-500"><ArrowUpDown size={18} /></button>
        </div>

        <div className="space-y-4">
          {topSpending.length > 0 ? topSpending.map((e) => (
            <div key={e.id} className="glass-panel p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-600">
                  {e.expense_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{e.expense_name}</p>
                  <p className="text-xs text-gray-500">{e.transaction_date}</p>
                </div>
              </div>
              <p className="font-bold text-red-500">
                - ₹ {Number(e.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
            </div>
          )) : (
            <div className="text-center text-gray-500 py-4">No data yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
