import { ArrowLeft, User, MapPin, Calendar, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

const PersonalProfile = () => {
  const navigate = useNavigate();
  const { user } = useStore();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="bg-primary px-6 pt-12 pb-24 flex items-center gap-4 text-white shadow-md rounded-b-[40px] relative">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold flex-1 text-center pr-10">Personal Profile</h1>
      </div>

      <div className="px-6 -mt-16 relative z-10">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col items-center">
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-4 border-4 border-white dark:border-gray-800 -mt-14 shadow-md">
            <User size={40} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name || 'Enjelin Morgeana'}</h2>
          <p className="text-sm text-gray-500 mb-6">Financial Enthusiast</p>

          <div className="w-full space-y-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <MapPin size={18} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Location</p>
                <p className="font-medium text-gray-900 dark:text-white">New York, USA</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Calendar size={18} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Date of Birth</p>
                <p className="font-medium text-gray-900 dark:text-white">October 14, 1995</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Briefcase size={18} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Occupation</p>
                <p className="font-medium text-gray-900 dark:text-white">Software Engineer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalProfile;
