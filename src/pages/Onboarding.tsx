import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useEffect } from 'react';

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useStore();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Graphic / 3D Illustration Area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Abstract Background Shapes mimicking the Figma design */}
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-cover bg-center opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #3E7C78 0%, transparent 60%)' }}></div>
        <div className="absolute inset-0 flex items-center justify-center p-8">
          {/* Placeholder for the 3D coin juggling character from Figma */}
          <div className="w-64 h-64 bg-primary/10 rounded-full flex items-center justify-center relative shadow-2xl shadow-primary/20 animate-pulse">
            <div className="w-48 h-48 bg-primary/20 rounded-full flex items-center justify-center relative">
              <span className="text-6xl absolute top-0 -left-4 hover:-translate-y-2 transition-transform duration-500">🪙</span>
              <span className="text-8xl hover:-translate-y-4 transition-transform duration-500">🧑‍💻</span>
              <span className="text-6xl absolute bottom-4 -right-4 hover:-translate-y-2 transition-transform duration-500">💰</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sheet */}
      <div className="bg-white rounded-t-[40px] px-8 pt-10 pb-12 shadow-[0_-20px_40px_rgba(0,0,0,0.05)] text-center relative z-10">
        <h1 className="text-3xl font-bold text-primary leading-tight mb-4 tracking-tight">
          Spend Smarter<br />Save More
        </h1>
        
        <button 
          onClick={() => navigate('/register')}
          className="w-full bg-primary hover:bg-[#2A5C59] text-white py-4 rounded-full font-bold text-lg shadow-lg shadow-primary/30 transition-all active:scale-95 mb-6"
        >
          Get Started
        </button>
        
        <p className="text-sm text-gray-500 font-medium">
          Already Have Account?{' '}
          <button onClick={() => navigate('/login')} className="text-primary hover:underline font-bold">
            Log In
          </button>
        </p>
      </div>
    </div>
  );
};

export default Onboarding;
