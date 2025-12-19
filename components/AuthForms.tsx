
import React, { useState, useMemo } from 'react';
import { Logo } from '../constants';
import { User } from '../types';
import { Eye, EyeOff, ShieldCheck, ShieldAlert, Shield } from 'lucide-react';

interface AuthFormProps {
  type: 'signup' | 'login';
  onSwitch: () => void;
  onSubmit: (user?: User) => void;
}

export const AuthForms: React.FC<AuthFormProps> = ({ type, onSwitch, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    // Honeypot field - if filled, we assume it's a bot
    website: '' 
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const passwordStrength = useMemo(() => {
    // Only calculate for signup
    if (type !== 'signup' || !formData.password) return 0;
    const p = formData.password;
    let strength = 0;
    if (p.length >= 8) strength += 25;
    if (/[A-Z]/.test(p)) strength += 25;
    if (/[0-9]/.test(p)) strength += 25;
    if (/[^A-Za-z0-9]/.test(p)) strength += 25;
    return strength;
  }, [formData.password, type]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    // Check Honeypot
    if (formData.website) {
      newErrors.form = "Security check failed.";
      return false;
    }

    if (type === 'signup') {
      if (formData.name.trim().length < 3) newErrors.name = "Name too short";
      if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) newErrors.phone = "Invalid phone format";
      
      // Strict password rules for signup
      if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters for security";
      }
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid university email";
    }

    // Basic required check for login (no length hints for security)
    if (type === 'login' && !formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(type === 'signup' ? formData : undefined);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="mb-10">
        <Logo />
      </div>

      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
          {type === 'signup' ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p className="text-gray-500 mt-2 font-medium">
          {type === 'signup' ? 'Join the campus community today.' : 'Please enter your details to login.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Honeypot Field - Hidden from users */}
        <div className="sr-only opacity-0 h-0 overflow-hidden" aria-hidden="true">
          <input 
            type="text" 
            name="website" 
            tabIndex={-1} 
            value={formData.website} 
            onChange={e => setFormData({...formData, website: e.target.value})} 
          />
        </div>

        {type === 'signup' && (
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Full Name</label>
            <input
              required
              maxLength={50}
              className={`w-full px-5 py-4 bg-white border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-2xl focus:ring-4 focus:ring-sellit/10 transition-all text-gray-900 placeholder:text-gray-400 font-medium`}
              placeholder="John Doe"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1 ml-1 font-bold">{errors.name}</p>}
          </div>
        )}

        {type === 'signup' && (
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Phone Number</label>
            <input
              required
              type="tel"
              maxLength={15}
              className={`w-full px-5 py-4 bg-white border ${errors.phone ? 'border-red-500' : 'border-gray-200'} rounded-2xl focus:ring-4 focus:ring-sellit/10 transition-all text-gray-900 placeholder:text-gray-400 font-medium`}
              placeholder="+234..."
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1 font-bold">{errors.phone}</p>}
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">University Email</label>
          <input
            required
            type="email"
            maxLength={100}
            className={`w-full px-5 py-4 bg-white border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-2xl focus:ring-4 focus:ring-sellit/10 transition-all text-gray-900 placeholder:text-gray-400 font-medium`}
            placeholder="name@university.edu"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1 ml-1 font-bold">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Password</label>
          <div className="relative">
            <input
              required
              type={showPassword ? "text" : "password"}
              maxLength={32}
              className={`w-full px-5 py-4 bg-white border ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded-2xl focus:ring-4 focus:ring-sellit/10 transition-all text-gray-900 placeholder:text-gray-400 font-medium pr-14`}
              placeholder="••••••••"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-sellit transition-colors p-2"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1 ml-1 font-bold">{errors.password}</p>}
          
          {type === 'signup' && formData.password && (
            <div className="mt-3 px-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Strength</span>
                <span className="text-[10px] font-black uppercase text-sellit">
                  {passwordStrength === 100 ? 'Excellent' : passwordStrength >= 50 ? 'Medium' : 'Weak'}
                </span>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    passwordStrength === 100 ? 'bg-green-500' : passwordStrength >= 50 ? 'bg-orange-400' : 'bg-red-400'
                  }`} 
                  style={{ width: `${passwordStrength}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-sellit text-white py-[12px] px-[24px] rounded-2xl font-bold text-lg hover:bg-sellit-dark transition-all shadow-lg active:scale-[0.98] mt-6 flex items-center justify-center gap-2 group"
        >
          {type === 'signup' ? 'Get Started' : 'Log in'}
          <ShieldCheck size={18} className="group-hover:scale-110 transition-transform" />
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-500 font-medium">
          {type === 'signup' ? "Already have an account?" : "Don't have an account?"}
          <button 
            onClick={onSwitch} 
            className="text-sellit font-bold ml-1.5 hover:underline"
          >
            {type === 'signup' ? 'Log in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  );
};
