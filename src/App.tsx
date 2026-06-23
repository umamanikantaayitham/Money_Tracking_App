import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { supabase } from './supabase';
import { useStore } from './store/useStore';
import { requestNotificationPermissions } from './services/notificationService';

// Pages
import Layout from './components/Layout.tsx';
import Onboarding from './pages/Onboarding.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import ForgotPassword from './pages/ForgotPassword.tsx';
import Dashboard from './pages/Dashboard.tsx';
import AddIncome from './pages/AddIncome.tsx';
import AddExpense from './pages/AddExpense.tsx';
import Transactions from './pages/Transactions.tsx';
import Reports from './pages/Reports.tsx';
import Budget from './pages/Budget.tsx';
import Analytics from './pages/Analytics.tsx';
import Profile from './pages/Profile.tsx';
import Settings from './pages/Settings.tsx';
import ToastContainer from './components/ToastContainer.tsx';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useStore((state) => state.user);
  if (!user) return <Navigate to="/onboarding" />;
  return <Layout>{children}</Layout>;
};

function App() {
  const { setUser, theme } = useStore();

  useEffect(() => {
    // Initial theme setup
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }

    // Request Notifications
    requestNotificationPermissions();

    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email || '' });
      } else {
        setUser(null);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email || '' });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, theme]);

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ToastContainer />
      <Routes>
        {/* Public Routes */}
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/income/add" element={<ProtectedRoute><AddIncome /></ProtectedRoute>} />
        <Route path="/expense/add" element={<ProtectedRoute><AddExpense /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        <Route path="/budget" element={<ProtectedRoute><Budget /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
