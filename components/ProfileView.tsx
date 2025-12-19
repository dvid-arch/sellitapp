
import React, { useState, useMemo } from 'react';
import { 
  User, Package, History, Radio, Settings, Edit2, 
  MapPin, Star, CheckCircle2, MoreVertical, Trash2, 
  Eye, ExternalLink, Calendar, Plus, Lock, X, EyeOff, Loader2, Check,
  ChevronRight, Camera, GraduationCap, BarChart3
} from 'lucide-react';
import { User as UserType, Listing } from '../types';
import { useToast } from '../context/ToastContext';

interface ProfileViewProps {
  user: UserType | null;
  listings: Listing[];
  onEditListing: (listing: Listing) => void;
  onDeleteListing: (id: string) => void;
  onMarkSold: (id: string) => void;
  onAddProductClick: () => void;
  onOpenListing: (listing: Listing) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ 
  user, 
  listings, 
  onEditListing, 
  onDeleteListing, 
  onMarkSold,
  onAddProductClick,
  onOpenListing
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'listings' | 'sold' | 'broadcasts'>('listings');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [showPass, setShowPass] = useState(false);
  
  const { showToast } = useToast();

  const [passwordForm, setPasswordForm] = useState({
    current: '',
    newPass: '',
    confirm: '',
    username_field: '' 
  });

  const [profileForm, setProfileForm] = useState({
    name: user?.name || 'Obokobong',
    hostel: 'NDDC Hostel',
    campus: 'University of Lagos',
  });

  const activeListings = listings.filter(l => l.status === 'available');
  const soldListings = listings.filter(l => l.status === 'sold');

  const stats = [
    { label: 'Active Ads', value: activeListings.length, icon: Package, color: 'text-sellit' },
    { label: 'Items Sold', value: soldListings.length, icon: CheckCircle2, color: 'text-green-500' },
    { label: 'Avg Rating', value: '4.9', icon: Star, color: 'text-orange-400' },
  ];

  const passwordStrength = useMemo(() => {
    const p = passwordForm.newPass;
    if (!p) return 0;
    let strength = 0;
    if (p.length >= 8) strength += 25;
    if (/[A-Z]/.test(p)) strength += 25;
    if (/[0-9]/.test(p)) strength += 25;
    if (/[^A-Za-z0-9]/.test(p)) strength += 25;
    return strength;
  }, [passwordForm.newPass]);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.username_field) return; 

    if (passwordForm.newPass !== passwordForm.confirm) {
      showToast('Mismatch', 'Passwords do not match.', 'error');
      return;
    }

    if (passwordStrength < 50) {
      showToast('Weak Password', 'Please choose a stronger password.', 'warning');
      return;
    }

    setIsChangingPassword(true);
    setTimeout(() => {
      setIsChangingPassword(false);
      setShowPasswordModal(false);
      setPasswordForm({ current: '', newPass: '', confirm: '', username_field: '' });
      showToast('Success', 'Password has been updated safely.', 'success');
    }, 1200);
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setTimeout(() => {
      setIsUpdatingProfile(false);
      setShowEditProfileModal(false);
      showToast('Profile Updated', 'Your changes have been saved.', 'success');
    }, 1000);
  };

  const confirmDelete = () => {
    if (showDeleteConfirm) {
      onDeleteListing(showDeleteConfirm);
      setShowDeleteConfirm(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-28 md:pb-12">
      {/* Profile Header Card */}
      <div className="relative bg-white rounded-[3rem] shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100 mb-8">
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
                <Camera size={18} />
              </button>
            </div>
            
            <div className="flex-1 md:pb-4">
              <div className="flex wrap items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">{profileForm.name}</h1>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-sellit/5 text-sellit rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest border border-sellit/10">
                  <CheckCircle2 size={14} className="fill-current text-white" />
                  Verified Student
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <div className="flex items-center gap-2 text-gray-400 font-bold text-sm">
                  <MapPin size={16} />
                  <span>{profileForm.hostel}, {profileForm.campus}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 font-bold text-sm">
                  <Calendar size={16} />
                  <span>Joined Oct 2023</span>
                </div>
              </div>
            </div>

            <div className="md:pb-4 flex gap-3">
              <button 
                onClick={() => setShowPasswordModal(true)}
                className="flex items-center gap-2 px-6 py-4 bg-white text-gray-700 rounded-[1.25rem] font-bold text-sm border border-gray-100 hover:bg-gray-50 transition-all shadow-sm"
              >
                <Lock size={16} />
                <span className="hidden sm:inline text-xs uppercase tracking-widest font-black">Security</span>
              </button>
              <button 
                onClick={() => setShowEditProfileModal(true)}
                className="px-6 py-4 bg-gray-50 text-gray-900 rounded-[1.25rem] font-black text-xs uppercase tracking-widest border border-gray-100 hover:bg-gray-100 transition-all shadow-sm"
              >
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
          { id: 'listings', label: 'Active Ads', icon: Package },
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
      <div className="animate-in fade-in duration-500 min-h-[400px]">
        {activeSubTab === 'listings' && (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
            {activeListings.map((item) => (
              <div 
                key={item.id} 
                onClick={() => onOpenListing(item)}
                className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 flex flex-col cursor-pointer"
              >
                <div className="relative aspect-square">
                  <img src={item.imageUrl} className="w-full h-full object-cover" alt="" />
                  
                  {/* Views Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 bg-white/90 backdrop-blur-md rounded-xl text-[10px] font-black text-sellit shadow-sm border border-sellit/5">
                    <Eye size={12} />
                    <span>{item.viewCount || 0}</span>
                  </div>

                  <div className="absolute top-3 right-3 flex gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onEditListing(item); }}
                      className="p-2 bg-white/90 backdrop-blur-md rounded-xl text-gray-600 shadow-sm hover:text-sellit transition-colors"
                      title="Edit Ad"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(item.id); }}
                      className="p-2 bg-white/90 backdrop-blur-md rounded-xl text-gray-600 shadow-sm hover:text-red-500 transition-colors"
                      title="Delete Ad"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                     <h3 className="font-bold text-gray-900 text-sm md:text-base truncate flex-1">{item.title}</h3>
                     {item.offerCount ? (
                       <span className="bg-orange-50 text-orange-500 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase ring-1 ring-orange-100">{item.offerCount} Offers</span>
                     ) : null}
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                    <span className="text-base md:text-xl font-black text-sellit">₦{item.price.toLocaleString()}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onMarkSold(item.id); }}
                      className="text-[9px] font-black text-gray-400 hover:text-green-500 uppercase tracking-widest transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 size={12} /> Mark Sold
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <button 
              onClick={onAddProductClick}
              className="aspect-square rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-4 text-gray-400 hover:border-sellit hover:text-sellit hover:bg-sellit/5 transition-all group"
            >
               <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-sellit/10 transition-colors">
                 <Plus size={32} />
               </div>
               <span className="font-black text-sm uppercase tracking-widest">New Listing</span>
            </button>
          </div>
        )}

        {activeSubTab === 'sold' && (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
            {soldListings.length > 0 ? (
              soldListings.map((item) => (
                <div key={item.id} className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 opacity-60 grayscale-[0.5] group">
                   <div className="relative aspect-square">
                      <img src={item.imageUrl} className="w-full h-full object-cover" alt="" />
                      <div className="absolute inset-0 bg-black/5" />
                      <div className="absolute top-3 right-3 bg-gray-900 text-white px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">Sold</div>
                   </div>
                   <div className="p-5">
                      <h3 className="font-bold text-gray-900 text-sm truncate">{item.title}</h3>
                      <p className="text-xl font-black text-gray-400 mt-2">₦{item.price.toLocaleString()}</p>
                   </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-200 mx-auto mb-6">
                  <History size={40} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">No items sold yet</h3>
                <p className="text-gray-400 font-medium max-w-xs mx-auto">Successfully sold items will appear here.</p>
              </div>
            )}
          </div>
        )}

        {activeSubTab === 'broadcasts' && (
          <div className="space-y-4">
            <div className="bg-white rounded-[3rem] border border-gray-100 p-8 text-center py-20">
              <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-200 mx-auto mb-6">
                <Radio size={40} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">No Active Broadcasts</h3>
              <p className="text-gray-400 font-medium max-w-xs mx-auto">When you broadcast a need, it will appear here for management.</p>
            </div>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowEditProfileModal(false)} />
          <div className="relative w-full max-w-[500px] bg-white rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300 border border-gray-100">
            <button onClick={() => setShowEditProfileModal(false)} className="absolute top-8 right-8 p-2 text-gray-400 hover:text-gray-900 transition-colors"><X size={24} /></button>
            <div className="mb-10 text-center md:text-left">
              <div className="w-12 h-12 bg-sellit/10 rounded-2xl flex items-center justify-center text-sellit mb-6 mx-auto md:mx-0"><User size={24} /></div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Edit Profile</h2>
              <p className="text-gray-500 font-medium">Keep your location and info up to date.</p>
            </div>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div>
                <label className="block text-sm font-black text-gray-700 mb-2 ml-1 uppercase tracking-widest">Full Name</label>
                <input required type="text" className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-sellit/10 transition-all font-medium text-gray-900 shadow-inner" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-black text-gray-700 mb-2 ml-1 uppercase tracking-widest">Hostel / Hall</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input required type="text" className="w-full pl-12 pr-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-sellit/10 transition-all font-medium text-gray-900 shadow-inner" value={profileForm.hostel} onChange={e => setProfileForm({...profileForm, hostel: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-black text-gray-700 mb-2 ml-1 uppercase tracking-widest">Campus / University</label>
                <div className="relative">
                  <GraduationCap size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input required type="text" className="w-full pl-12 pr-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-sellit/10 transition-all font-medium text-gray-900 shadow-inner" value={profileForm.campus} onChange={e => setProfileForm({...profileForm, campus: e.target.value})} />
                </div>
              </div>
              <button type="submit" disabled={isUpdatingProfile} className="w-full bg-sellit text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-sellit/20 hover:bg-sellit-dark transition-all active:scale-[0.98] flex items-center justify-center gap-3 mt-4">
                {isUpdatingProfile ? <><Loader2 size={24} className="animate-spin" /><span>Saving...</span></> : <><Check size={24} className="stroke-[3]" /><span>Save Changes</span></>}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(null)} />
          <div className="relative w-full max-w-sm bg-white rounded-[2rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-black text-gray-900 mb-2">Delete Listing?</h3>
            <p className="text-gray-500 text-sm font-medium mb-8">This action cannot be undone. All offers and messages for this listing will be lost.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 px-4 py-3 bg-gray-50 rounded-xl text-gray-600 font-bold hover:bg-gray-100 transition-colors">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 px-4 py-3 bg-red-500 rounded-xl text-white font-bold hover:bg-red-600 transition-colors">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowPasswordModal(false)} />
          <div className="relative w-full max-w-[480px] bg-white rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300 border border-gray-100">
            <button onClick={() => setShowPasswordModal(false)} className="absolute top-8 right-8 p-2 text-gray-400 hover:text-gray-900 transition-colors"><X size={24} /></button>
            <div className="mb-10 text-center md:text-left">
              <div className="w-12 h-12 bg-sellit/10 rounded-2xl flex items-center justify-center text-sellit mb-6 mx-auto md:mx-0"><Lock size={24} /></div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Security Settings</h2>
              <p className="text-gray-500 font-medium">Update your password to keep your account safe.</p>
            </div>
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div className="sr-only opacity-0 h-0 w-0">
                <input type="text" value={passwordForm.username_field} onChange={e => setPasswordForm({...passwordForm, username_field: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-black text-gray-700 mb-2 ml-1 uppercase tracking-widest">Current Password</label>
                <div className="relative">
                  <input required type={showPass ? "text" : "password"} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-sellit/10 transition-all font-medium text-gray-900 shadow-inner" placeholder="••••••••" value={passwordForm.current} onChange={e => setPasswordForm({...passwordForm, current: e.target.value})} />
                </div>
              </div>
              <div className="h-px bg-gray-50 w-full" />
              <div>
                <label className="block text-sm font-black text-gray-700 mb-2 ml-1 uppercase tracking-widest">New Password</label>
                <div className="relative">
                  <input required type={showPass ? "text" : "password"} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-sellit/10 transition-all font-medium text-gray-900 shadow-inner" placeholder="••••••••" value={passwordForm.newPass} onChange={e => setPasswordForm({...passwordForm, newPass: e.target.value})} />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-sellit transition-colors p-2">{showPass ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                </div>
                {passwordForm.newPass && (
                  <div className="mt-3 px-1">
                    <div className="flex justify-between items-center mb-1.5"><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Strength</span><span className="text-[10px] font-black uppercase text-sellit">{passwordStrength === 100 ? 'Excellent' : passwordStrength >= 50 ? 'Secure' : 'Too Weak'}</span></div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden"><div className={`h-full transition-all duration-500 ${passwordStrength === 100 ? 'bg-green-500' : passwordStrength >= 50 ? 'bg-orange-400' : 'bg-red-400'}`} style={{ width: `${passwordStrength}%` }}/></div>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-black text-gray-700 mb-2 ml-1 uppercase tracking-widest">Confirm New Password</label>
                <input required type={showPass ? "text" : "password"} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-sellit/10 transition-all font-medium text-gray-900 shadow-inner" placeholder="••••••••" value={passwordForm.confirm} onChange={e => setPasswordForm({...passwordForm, confirm: e.target.value})} />
              </div>
              <button type="submit" disabled={isChangingPassword || !passwordForm.newPass} className="w-full bg-sellit text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-sellit/20 hover:bg-sellit-dark transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 mt-4">
                {isChangingPassword ? <><Loader2 size={24} className="animate-spin" /><span>Updating...</span></> : <><Check size={24} className="stroke-[3]" /><span>Update Password</span></>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
