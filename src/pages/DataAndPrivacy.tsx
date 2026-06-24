import { ArrowLeft, Lock, Download, Trash2, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DataAndPrivacy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="bg-primary px-6 pt-12 pb-6 flex items-center gap-4 text-white shadow-md rounded-b-[30px]">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold flex-1 text-center pr-10">Data & Privacy</h1>
      </div>

      <div className="p-6 mt-4 space-y-6">
        <div className="flex items-center gap-4 bg-primary/10 p-4 rounded-2xl border border-primary/20">
          <Lock className="text-primary" size={28} />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Your data is encrypted and securely stored. We never share your financial information with third parties.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-white px-2">Manage Data</h3>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <Download size={20} className="text-emerald-500" />
              <span className="font-bold text-gray-900 dark:text-white">Export My Data</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <FileText size={20} className="text-blue-500" />
              <span className="font-bold text-gray-900 dark:text-white">Privacy Policy</span>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-4 shadow-sm flex items-center justify-between border border-red-100 dark:border-red-900/30 cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/40 transition mt-8">
            <div className="flex items-center gap-3">
              <Trash2 size={20} className="text-red-500" />
              <span className="font-bold text-red-600 dark:text-red-400">Delete Account & Data</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataAndPrivacy;
