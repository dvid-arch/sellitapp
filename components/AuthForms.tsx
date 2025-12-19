
import React, { useState } from 'react';
import { Logo } from '../constants';
import { User } from '../types';

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
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(type === 'signup' ? formData : undefined);
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
        {type === 'signup' && (
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Full Name</label>
            <input
              required
              className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-sellit/10 transition-all text-gray-900 placeholder:text-gray-400 font-medium"
              placeholder="John Doe"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
        )}

        {type === 'signup' && (
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Phone Number</label>
            <input
              required
              type="tel"
              className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-sellit/10 transition-all text-gray-900 placeholder:text-gray-400 font-medium"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">University Email</label>
          <input
            required
            type="email"
            className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-sellit/10 transition-all text-gray-900 placeholder:text-gray-400 font-medium"
            placeholder="name@university.edu"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Password</label>
          <input
            required
            type="password"
            className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-sellit/10 transition-all text-gray-900 placeholder:text-gray-400 font-medium"
            placeholder="••••••••"
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-sellit text-white py-[12px] px-[24px] rounded-2xl font-bold text-lg hover:bg-sellit-dark transition-all shadow-lg active:scale-[0.98] mt-6"
        >
          {type === 'signup' ? 'Get Started' : 'Log in'}
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
