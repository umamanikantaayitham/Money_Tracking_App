import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Home, BarChart2, Wallet, User as UserIcon, Plus } from 'lucide-react';
import { useStore } from '../store/useStore';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const navItems = [
    { to: '/', icon: Home },
    { to: '/analytics', icon: BarChart2 },
    { to: '/transactions', icon: Wallet },
    { to: '/profile', icon: UserIcon },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark transition-colors relative pb-24">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto page-enter page-enter-active">
        <div className="max-w-md mx-auto w-full min-h-screen relative shadow-2xl bg-background-light dark:bg-background-dark">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation (Screenshot Style) */}
      <nav className="fixed bottom-0 w-full z-50 pointer-events-none flex justify-center">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] rounded-t-3xl h-20 px-6 flex justify-between items-center pointer-events-auto relative">
          
          {/* Left Nav Items */}
          <div className="flex w-[40%] justify-between">
            {navItems.slice(0, 2).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `p-2 transition-all duration-200 flex items-center justify-center ${
                    isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
                  }`
                }
              >
                {({ isActive }) => (
                  <item.icon size={26} strokeWidth={isActive ? 2.5 : 2} />
                )}
              </NavLink>
            ))}
          </div>

          {/* Floating Action Button */}
          <div className="absolute left-1/2 -top-6 -translate-x-1/2">
            <NavLink
              to="/expense/add"
              className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/40 hover:scale-105 transition-transform"
            >
              <Plus size={28} strokeWidth={2.5} />
            </NavLink>
          </div>

          {/* Right Nav Items */}
          <div className="flex w-[40%] justify-between">
            {navItems.slice(2, 4).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `p-2 transition-all duration-200 flex items-center justify-center ${
                    isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
                  }`
                }
              >
                {({ isActive }) => (
                  <item.icon size={26} strokeWidth={isActive ? 2.5 : 2} />
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
