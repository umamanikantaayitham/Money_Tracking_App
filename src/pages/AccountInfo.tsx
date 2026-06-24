import { ArrowLeft, UserCircle, Mail, Phone, Edit2, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

const AccountInfo = () => {
  const navigate = useNavigate();
  const { user } = useStore();

  const [profile, setProfile] = useState<{ username: string; phone: string; email: string }>({
    username: '',
    phone: '',
    email: user?.email || '',
  });

  const [editingField, setEditingField] = useState<'username' | 'phone' | null>(null);
  const [tempValue, setTempValue] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      supabase.from('profiles').select('username, phone, email').eq('id', user.id).single()
        .then(({ data }) => {
          if (data) {
            setProfile({
              username: data.username || user.name?.toLowerCase().replace(' ', '_') || '',
              phone: data.phone || '',
              email: data.email || user.email || '',
            });
          }
          setLoading(false);
        });
    }
  }, [user]);

  const handleEdit = (field: 'username' | 'phone', currentValue: string) => {
    setEditingField(field);
    setTempValue(currentValue);
  };

  const handleSave = async () => {
    if (!editingField || !user?.id) return;
    
    // Save to supabase
    const updates = { [editingField]: tempValue };
    const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
    
    if (!error) {
      setProfile({ ...profile, [editingField]: tempValue });
    }
    setEditingField(null);
  };

  if (loading) return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="bg-primary px-6 pt-12 pb-6 flex items-center gap-4 text-white shadow-md rounded-b-[30px]">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold flex-1 text-center pr-10">Account Info</h1>
      </div>

      <div className="p-6 mt-4 space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
          
          {/* Username Field */}
          <div className="flex items-center pb-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
              <div className="w-10 h-10 flex-shrink-0 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <UserCircle size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 font-medium truncate">Username</p>
                {editingField === 'username' ? (
                  <input autoFocus value={tempValue} onChange={e => setTempValue(e.target.value)} className="w-full font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded outline-none" />
                ) : (
                  <p className="font-bold text-gray-900 dark:text-white truncate">@{profile.username || 'username'}</p>
                )}
              </div>
            </div>
            {editingField === 'username' ? (
              <div className="flex gap-2">
                 <button onClick={handleSave} className="text-emerald-500 p-2 hover:bg-emerald-50 rounded-full"><Check size={16} /></button>
                 <button onClick={() => setEditingField(null)} className="text-red-500 p-2 hover:bg-red-50 rounded-full"><X size={16} /></button>
              </div>
            ) : (
              <button onClick={() => handleEdit('username', profile.username)} className="text-primary flex-shrink-0 p-2 hover:bg-primary/10 rounded-full transition"><Edit2 size={16} /></button>
            )}
          </div>

          {/* Email Field (Read Only) */}
          <div className="flex items-center pb-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
              <div className="w-10 h-10 flex-shrink-0 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Mail size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 font-medium truncate">Email Address</p>
                <p className="font-bold text-gray-900 dark:text-white truncate">{profile.email}</p>
              </div>
            </div>
            {/* Email usually requires verification to change, so we leave it uneditable for now */}
          </div>

          {/* Phone Field */}
          <div className="flex items-center">
            <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
              <div className="w-10 h-10 flex-shrink-0 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Phone size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 font-medium truncate">Phone Number</p>
                {editingField === 'phone' ? (
                  <input autoFocus value={tempValue} onChange={e => setTempValue(e.target.value)} placeholder="+1 (555) 000-0000" className="w-full font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded outline-none" />
                ) : (
                  <p className="font-bold text-gray-900 dark:text-white truncate">{profile.phone || 'Add phone number'}</p>
                )}
              </div>
            </div>
            {editingField === 'phone' ? (
              <div className="flex gap-2">
                 <button onClick={handleSave} className="text-emerald-500 p-2 hover:bg-emerald-50 rounded-full"><Check size={16} /></button>
                 <button onClick={() => setEditingField(null)} className="text-red-500 p-2 hover:bg-red-50 rounded-full"><X size={16} /></button>
              </div>
            ) : (
              <button onClick={() => handleEdit('phone', profile.phone)} className="text-primary flex-shrink-0 p-2 hover:bg-primary/10 rounded-full transition"><Edit2 size={16} /></button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AccountInfo;
