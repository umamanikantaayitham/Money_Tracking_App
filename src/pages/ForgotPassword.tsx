import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { ChevronLeft, Mail } from 'lucide-react';
import { useToastStore } from '../store/useToastStore';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToastStore();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      addToast(error.message, 'error');
    } else {
      addToast('Check your email for the password reset link!', 'success');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8F9F9] dark:bg-gray-900 relative">
      <button 
        onClick={() => navigate(-1)} 
        className="absolute top-8 left-6 p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm text-gray-600 dark:text-gray-300"
      >
        <ChevronLeft size={24} />
      </button>

      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#E5F5E9] rounded-2xl flex items-center justify-center mb-4 text-[#2EA265]">
            <Mail size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Reset Password
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-center text-sm">
            Enter your email address and we will send you instructions to reset your password.
          </p>
        </div>

        <form onSubmit={handleReset} className="space-y-5">
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all dark:text-white"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-primary/30 flex justify-center items-center gap-2 mt-4">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-600 dark:text-gray-400">
          Remember your password?{' '}
          <Link to="/login" className="text-primary hover:underline font-bold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
