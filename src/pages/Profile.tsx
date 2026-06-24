import { useStore } from '../store/useStore';
import { User, Gem, UserCircle, Mail, Shield, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useStore();

  const menuItems = [
    { icon: Gem, label: 'Invite Friends', bg: 'bg-primary/10', color: 'text-primary', path: '/profile/invite' },
    { icon: UserCircle, label: 'Account info', bg: 'bg-gray-100 dark:bg-gray-800', color: 'text-gray-600 dark:text-gray-300', path: '/profile/account' },
    { icon: User, label: 'Personal profile', bg: 'bg-gray-100 dark:bg-gray-800', color: 'text-gray-600 dark:text-gray-300', path: '/profile/personal' },
    { icon: Mail, label: 'Message center', bg: 'bg-gray-100 dark:bg-gray-800', color: 'text-gray-600 dark:text-gray-300', path: '/profile/messages' },
    { icon: Shield, label: 'Login and security', bg: 'bg-gray-100 dark:bg-gray-800', color: 'text-gray-600 dark:text-gray-300', path: '/profile/security' },
    { icon: Lock, label: 'Data and privacy', bg: 'bg-gray-100 dark:bg-gray-800', color: 'text-gray-600 dark:text-gray-300', path: '/profile/privacy' },
  ];

  return (
    <div className="pt-12 pb-6 relative min-h-screen">
      <div className="curved-bg-profile" />
      
      {/* Profile Header */}
      <div className="flex flex-col items-center mt-12 mb-8">
        <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg mb-4">
          <div className="w-full h-full bg-primary/20 rounded-full flex items-center justify-center text-primary">
            <User size={40} />
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {user?.name || 'Enjelin Morgeana'}
        </h2>
        <p className="text-sm text-primary font-medium">
          @{user?.name?.toLowerCase().replace(' ', '_') || 'enjelin_morgeana'}
        </p>
      </div>
      
      {/* Menu List */}
      <div className="px-6 space-y-2">
        {menuItems.map((item, i) => (
          <Link to={item.path} key={i} className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-2xl transition cursor-pointer">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${item.bg} ${item.color}`}>
              <item.icon size={22} />
            </div>
            <span className="font-medium text-gray-900 dark:text-white flex-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Profile;
