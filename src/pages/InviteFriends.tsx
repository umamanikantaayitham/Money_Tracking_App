import { ArrowLeft, Share2, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InviteFriends = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 relative">
      {/* Header */}
      <div className="bg-primary px-6 pt-12 pb-6 flex items-center gap-4 text-white shadow-md rounded-b-[30px]">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold flex-1 text-center pr-10">Invite Friends</h1>
      </div>

      <div className="p-6 mt-4 flex flex-col items-center">
        <div className="w-48 h-48 bg-primary/10 rounded-full flex items-center justify-center mb-8 relative">
           <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-ping opacity-20"></div>
           <Share2 size={64} className="text-primary" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
          Share Money Tracker Pro
        </h2>
        <p className="text-gray-500 text-center mb-8 px-4 leading-relaxed">
          Invite your friends to use Money Tracker Pro and help them manage their finances efficiently!
        </p>

        <div className="w-full bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm flex items-center justify-between border border-gray-100 dark:border-gray-700">
          <span className="font-mono text-gray-600 dark:text-gray-300 font-bold tracking-wider">MTP-ENJELIN-2026</span>
          <button className="text-primary p-2 hover:bg-primary/10 rounded-xl transition">
            <Copy size={20} />
          </button>
        </div>

        <button className="w-full bg-primary hover:bg-[#2A5C59] text-white py-4 rounded-full font-bold text-lg shadow-lg shadow-primary/30 mt-8 transition-transform active:scale-95">
          Share Invite Link
        </button>
      </div>
    </div>
  );
};

export default InviteFriends;
