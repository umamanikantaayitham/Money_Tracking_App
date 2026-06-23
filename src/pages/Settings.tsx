import { useStore } from '../store/useStore';
import { Bell, Moon, Shield } from 'lucide-react';

const Settings = () => {
  const { theme, toggleTheme } = useStore();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>
      
      <div className="glass-panel overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-lg"><Moon size={20} /></div>
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-gray-500">Toggle dark/light theme</p>
            </div>
          </div>
          <button 
            onClick={toggleTheme}
            className={`w-12 h-6 rounded-full transition-colors relative ${theme === 'dark' ? 'bg-primary' : 'bg-gray-300'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${theme === 'dark' ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><Bell size={20} /></div>
            <div>
              <p className="font-medium">Notifications</p>
              <p className="text-sm text-gray-500">Manage daily reminders</p>
            </div>
          </div>
          <button className="text-primary text-sm font-medium">Configure</button>
        </div>

        <div className="p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 text-green-500 rounded-lg"><Shield size={20} /></div>
            <div>
              <p className="font-medium">Security</p>
              <p className="text-sm text-gray-500">Change password and auth</p>
            </div>
          </div>
          <button className="text-primary text-sm font-medium">Manage</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
