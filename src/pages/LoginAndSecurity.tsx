import { ArrowLeft, Shield, Key, Smartphone, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginAndSecurity = () => {
  const navigate = useNavigate();

  const options = [
    { icon: Key, title: 'Change Password', desc: 'Update your account password' },
    { icon: Smartphone, title: 'Two-Factor Authentication', desc: 'Add an extra layer of security' },
    { icon: Shield, title: 'Active Sessions', desc: 'Manage devices logged into your account' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="bg-primary px-6 pt-12 pb-6 flex items-center gap-4 text-white shadow-md rounded-b-[30px]">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold flex-1 text-center pr-10">Security</h1>
      </div>

      <div className="p-6 mt-4 space-y-6">
        <div className="flex flex-col items-center mb-8">
           <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
             <Shield size={36} />
           </div>
           <h2 className="text-xl font-bold text-gray-900 dark:text-white">Security Settings</h2>
           <p className="text-sm text-gray-500 text-center mt-2 px-4">Keep your financial data safe by enabling extra security measures.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          {options.map((opt, i) => (
            <div key={i} className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition ${i !== options.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''}`}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <opt.icon size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">{opt.title}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoginAndSecurity;
