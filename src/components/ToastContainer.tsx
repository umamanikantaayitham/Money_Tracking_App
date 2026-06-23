import { useToastStore } from '../store/useToastStore';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-12 left-0 right-0 z-[100] flex flex-col items-center gap-2 pointer-events-none px-4">
      {toasts.map((toast) => {
        let bgColor = 'bg-gray-800';
        let Icon = Info;
        let iconColor = 'text-blue-400';

        if (toast.type === 'success') {
          bgColor = 'bg-[#1e293b]';
          Icon = CheckCircle2;
          iconColor = 'text-[#2EA265]';
        } else if (toast.type === 'error') {
          bgColor = 'bg-[#450a0a]';
          Icon = XCircle;
          iconColor = 'text-[#E04F5F]';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl w-full max-w-sm ${bgColor} transform transition-all duration-300 page-enter-active`}
          >
            <Icon size={22} className={iconColor} />
            <p className="flex-1 text-sm font-medium text-white">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
