import { ArrowLeft, Search, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MessageCenter = () => {
  const navigate = useNavigate();

  const messages = [
    { title: 'System Update', desc: 'Version 2.0 is now live with new AI features!', time: '10:00 AM', unread: true },
    { title: 'Security Alert', desc: 'New login detected on Android device.', time: 'Yesterday', unread: true },
    { title: 'Weekly Report', desc: 'Your expenses were 15% lower this week! Great job.', time: 'Mon', unread: false },
    { title: 'Welcome!', desc: 'Welcome to Money Tracker Pro. Setup your budget now.', time: 'Last Week', unread: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="bg-primary px-6 pt-12 pb-6 flex items-center gap-4 text-white shadow-md rounded-b-[30px]">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold flex-1 text-center pr-10">Messages</h1>
      </div>

      <div className="p-6 space-y-4">
        <div className="relative mb-6">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Search messages..." 
            className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl py-3 pl-12 pr-4 shadow-sm border-none focus:ring-2 focus:ring-primary outline-none"
          />
        </div>

        <div className="space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm flex items-start gap-4 transition-all hover:shadow-md cursor-pointer border-l-4 ${msg.unread ? 'border-primary' : 'border-transparent'}`}>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h3 className={`font-bold ${msg.unread ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>{msg.title}</h3>
                  <span className="text-xs font-medium text-gray-400">{msg.time}</span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-1">{msg.desc}</p>
              </div>
              {msg.unread && <Circle size={10} className="text-primary fill-primary mt-1.5" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessageCenter;
