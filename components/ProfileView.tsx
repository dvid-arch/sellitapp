
import React, { useState } from 'react';
import { 
  User, Package, History, Radio, Settings, Edit2, 
  MapPin, Star, CheckCircle2, MoreVertical, Trash2, 
  Eye, ExternalLink, Calendar, Plus
} from 'lucide-react';
import { User as UserType, Listing } from '../types';

interface ProfileViewProps {
  user: UserType | null;
  listings: Listing[];
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, listings }) => {
  const [activeSubTab, setActiveSubTab] = useState<'listings' | 'sold' | 'broadcasts'>('listings');

  const stats = [
    { label: 'Active Ads', value: listings.length, icon: Package, color: 'text-sellit' },
    { label: 'Items Sold', value: '14', icon: CheckCircle2, color: 'text-green-500' },
    { label: 'Avg Rating', value: '4.9', icon: Star, color: 'text-orange-400' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-28 md:pb-12">
      {/* Profile Header Card */}
      <div className="relative bg-white rounded-[3rem] shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100 mb-8">
        {/* Cover Pattern */}
        <div className="h-32 md:h-48 bg-sellit relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-sellit-dark via-sellit to-sellit opacity-90" />
           <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        </div>
        
        <div className="px-6 md:px-12 pb-10">
          <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16 md:-mt-20 relative z-10">
            <div className="relative group">
              <div className="w-32 h-32 md:w-44 md:h-44 rounded-[2.5rem] border-[6px] border-white shadow-2xl overflow-hidden bg-white">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300" className="w-full h-full object-cover" alt="Profile" />
              </div>
              <button className="absolute bottom-2 right-2 p-2.5 bg-white rounded-2xl shadow-xl text-sellit hover:scale-110 transition-transform border border-gray-100">
                <Edit2 size={18} />
              </button>
            </div>
            
            <div className="flex-1 md:pb-4">
              <div className="flex wrap items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">{user?.name || 'Obokobong'}</h1>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-sellit/5 text-sellit rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest border border-sellit/10">
                  <CheckCircle2 size={14} className="fill-current text-white" />
                  Verified Student
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <div className="flex items-center gap-2 text-gray-400 font-bold text-sm">
                  <MapPin size={16} />
                  <span>NDDC Hostel, UNILAG</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 font-bold text-sm">
                  <Calendar size={16} />
                  <span>Joined Oct 2023</span>
                </div>
              </div>
            </div>

            <div className="md:pb-4">
              <button className="w-full md:w-auto px-8 py-4 bg-gray-50 text-gray-900 rounded-[1.25rem] font-black text-sm border border-gray-100 hover:bg-gray-100 transition-all shadow-sm">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:border-sellit/20 transition-all">
            <div>
              <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl md:text-4xl font-black text-gray-900">{stat.value}</p>
            </div>
            <div className={`p-4 rounded-2xl bg-gray-50 ${stat.color} group-hover:scale-110 transition-transform`}>
              <stat.icon size={28} />
            </div>
          </div>
        ))}
      </div>

      {/* Sub-Navigation */}
      <div className="flex gap-2 mb-8 bg-gray-100/50 p-2 rounded-[1.5rem] w-fit">
        {[
          { id: 'listings', label: 'My Listings', icon: Package },
          { id: 'sold', label: 'Sold History', icon: History },
          { id: 'broadcasts', label: 'My Broadcasts', icon: Radio },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`flex items-center gap-3 px-6 md:px-8 py-3 rounded-[1.25rem] text-xs md:text-sm font-black transition-all ${
              activeSubTab === tab.id 
                ? 'bg-white text-sellit shadow-lg shadow-sellit/5' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <tab.icon size={18} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="animate-in fade-in duration-500">
        {activeSubTab === 'listings' && (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
            {listings.map((item) => (
              <div key={item.id} className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500">
                <div className="relative aspect-square">
                  <img src={item.imageUrl} className="w-full h-full object-cover" alt="" />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button className="p-2 bg-white/90 backdrop-blur-md rounded-xl text-gray-600 shadow-sm hover:text-sellit transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button className="p-2 bg-white/90 backdrop-blur-md rounded-xl text-gray-600 shadow-sm hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-sm md:text-base truncate">{item.title}</h3>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-base md:text-xl font-black text-sellit">₦{item.price.toLocaleString()}</span>
                    <span className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase">
                      <Eye size={12} /> 124
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <button className="aspect-square rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-4 text-gray-400 hover:border-sellit hover:text-sellit hover:bg-sellit/5 transition-all group">
               <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-sellit/10 transition-colors">
                 <Plus size={32} />
               </div>
               <span className="font-black text-sm uppercase tracking-widest">New Listing</span>
            </button>
          </div>
        )}

        {activeSubTab === 'sold' && (
          <div className="bg-white rounded-[3rem] border border-gray-100 p-8 text-center py-20">
            <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-200 mx-auto mb-6">
              <History size={40} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">No items sold yet</h3>
            <p className="text-gray-400 font-medium max-w-xs mx-auto">Items you successfully sell on campus will appear here in your history.</p>
          </div>
        )}

        {activeSubTab === 'broadcasts' && (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-sellit/20 transition-all">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-gray-50 flex items-center justify-center text-sellit overflow-hidden">
                    <img src={`https://images.unsplash.com/photo-1543674892-7d64d45df18b?w=150`} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-gray-900 mb-1">Looking for a Scientific Calculator</h4>
                    <p className="text-gray-400 text-sm font-medium mb-3">Posted 2 days ago • Active in NDDC Hostel</p>
                    <div className="flex gap-2">
                       <span className="px-3 py-1 bg-gray-50 rounded-lg text-[10px] font-black uppercase text-gray-500">Books</span>
                       <span className="px-3 py-1 bg-sellit/5 rounded-lg text-[10px] font-black uppercase text-sellit">₦5,000 - ₦8,000</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="flex-1 md:flex-none px-6 py-3 bg-sellit/5 text-sellit rounded-xl font-black text-xs uppercase tracking-widest hover:bg-sellit hover:text-white transition-all">
                    View Responses (3)
                  </button>
                  <button className="p-3 text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
