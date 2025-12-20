
import React, { useState, useMemo } from 'react';
import { 
  User, Package, History, Radio, Settings, Edit2, 
  MapPin, Star, CheckCircle2, MoreVertical, Trash2, 
  Eye, ExternalLink, Calendar, Plus, Lock, X, EyeOff, Loader2, Check,
  ChevronRight, Camera, GraduationCap, BarChart3, Clock, XCircle, Edit3, MessageSquare, Handshake,
  Building2, CreditCard, Info, Zap, ShieldCheck, ArrowRightLeft
} from 'lucide-react';
import { User as UserType, Listing, Offer, OfferStatus, BankDetails } from '../types';
import { useToast } from '../context/ToastContext';

interface ProfileViewProps {
  user: UserType | null;
  listings: Listing[];
  offers: Offer[];
  onEditListing: (listing: Listing) => void;
  onDeleteListing: (id: string) => void;
  onMarkSold: (id: string) => void;
  onBoostListing: (id: string) => void; // New handler
  onAddProductClick: () => void;
  onOpenListing: (listing: Listing) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ 
  user, 
  listings, 
  offers,
  onEditListing, 
  onDeleteListing, 
  onMarkSold,
  onBoostListing,
  onAddProductClick,
  onOpenListing
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'listings' | 'sold' | 'broadcasts' | 'offers' | 'settings'>('listings');
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [isSavingBank, setIsSavingBank] = useState(false);
  
  const [showBoostCheckout, setShowBoostCheckout] = useState<Listing | null>(null);
  const [boostPaymentStep, setBoostPaymentStep] = useState<'selection' | 'processing' | 'success'>('selection');
  const [boostPaymentMethod, setBoostPaymentMethod] = useState<'card' | 'transfer'>('card');
  
  const { showToast } = useToast();

  const [bankForm, setBankForm] = useState<BankDetails>(user?.bankDetails || {
    bankName: '',
    accountNumber: '',
    accountName: ''
  });

  const [profileForm, setProfileForm] = useState({
    name: user?.name || 'Obokobong',
    hostel: 'NDDC Hostel',
    campus: 'University of Lagos',
  });

  const activeListings = listings.filter(l => l.status === 'available');
  const soldListings = listings.filter(l => l.status === 'sold');
  const receivedOffers = offers.filter(o => o.buyerName !== (user?.name || 'Obokobong'));

  const getStatusConfig = (status: OfferStatus) => {
    switch (status) {
      case 'pending': return { label: 'Pending', color: 'text-amber-600 bg-amber-50 border-amber-100', icon: Clock };
      case 'accepted': return { label: 'Accepted', color: 'text-green-600 bg-green-50 border-green-100', icon: CheckCircle2 };
      case 'declined': return { label: 'Declined', color: 'text-red-600 bg-red-50 border-red-100', icon: XCircle };
      case 'withdrawn': return { label: 'Withdrawn', color: 'text-gray-500 bg-gray-50 border-gray-100', icon: Trash2 };
      case 'countered': return { label: 'Countered', color: 'text-blue-600 bg-blue-50 border-blue-100', icon: Edit3 };
      default: return { label: 'Unknown', color: 'text-gray-400 bg-gray-50 border-gray-100', icon: Clock };
    }
  };

  const handleSaveBankDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingBank(true);
    setTimeout(() => {
      setIsSavingBank(false);
      showToast('Payout Details Saved', 'Funds from sales will be sent to this account.', 'success');
    }, 1000);
  };

  const processBoostPayment = () => {
    if (!showBoostCheckout) return;
    setBoostPaymentStep('processing');
    
    // Simulate payment processing
    setTimeout(() => {
        setBoostPaymentStep('success');
        onBoostListing(showBoostCheckout.id);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-28 md:pb-12">
      <div className="relative bg-white rounded-[3rem] shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100 mb-8">
        <div className="h-32 md:h-48 bg-sellit relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-sellit-dark via-sellit to-sellit opacity-90" />
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
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-2">{profileForm.name}</h1>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-400 font-bold text-sm">
                <div className="flex items-center gap-2"><MapPin size={16} /><span>{profileForm.hostel}</span></div>
                <div className="flex items-center gap-2"><GraduationCap size={16} /><span>{profileForm.campus}</span></div>
                <div className="flex items-center gap-2 text-green-500"><ShieldCheck size={16} /><span>Verified Student</span></div>
              </div>
            </div>

            <div className="md:pb-4 flex gap-3">
              <button onClick={() => setShowEditProfileModal(true)} className="px-6 py-4 bg-gray-50 text-gray-900 rounded-[1.25rem] font-black text-xs uppercase tracking-widest border border-gray-100 hover:bg-gray-100 transition-all">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-8 bg-gray-100/50 p-2 rounded-[1.5rem] w-fit overflow-x-auto scrollbar-hide">
        {[
          { id: 'listings', label: 'Active Ads', icon: Package },
          { id: 'offers', label: 'Manage Offers', icon: Handshake },
          { id: 'settings', label: 'Payout Settings', icon: Building2 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`flex items-center gap-3 px-6 md:px-8 py-3 rounded-[1.25rem] text-xs md:text-sm font-black transition-all whitespace-nowrap ${
              activeSubTab === tab.id 
                ? 'bg-white text-sellit shadow-lg shadow-sellit/5' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <tab.icon size={18} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="animate-in fade-in duration-500">
        {activeSubTab === 'listings' && (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
            {activeListings.map((item) => (
              <div key={item.id} className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 flex flex-col">
                <div onClick={() => onOpenListing(item)} className="relative aspect-square cursor-pointer">
                  <img src={item.imageUrl} className="w-full h-full object-cover" alt="" />
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <button onClick={(e) => { e.stopPropagation(); onEditListing(item); }} className="p-2 bg-white/90 rounded-xl text-gray-600 hover:text-sellit shadow-sm"><Edit2 size={16} /></button>
                    {item.isBoosted && (
                        <div className="bg-sellit text-white p-2 rounded-xl shadow-lg animate-pulse"><Zap size={14} fill="white" /></div>
                    )}
                  </div>
                  {item.isUrgent && (
                     <div className="absolute top-3 left-3 bg-orange-500 text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-wider shadow-lg animate-pulse">Urgent</div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-gray-900 text-sm truncate">{item.title}</h3>
                  <p className="text-xl font-black text-sellit mt-2">₦{item.price.toLocaleString()}</p>
                  
                  <div className="mt-4 pt-4 border-t border-gray-50 flex gap-2">
                    <button 
                      onClick={() => {
                        setShowBoostCheckout(item);
                        setBoostPaymentStep('selection');
                      }}
                      disabled={item.isBoosted}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                        item.isBoosted 
                        ? 'bg-green-50 text-green-600 border-green-100' 
                        : 'bg-sellit/[0.05] text-sellit border-sellit/10 hover:bg-sellit hover:text-white'
                      }`}
                    >
                      {item.isBoosted ? <Check size={12} strokeWidth={3} /> : <Zap size={12} fill="currentColor" />}
                      {item.isBoosted ? 'Boosted' : 'Sell Faster'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={onAddProductClick} className="aspect-square rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-4 text-gray-400 hover:border-sellit hover:text-sellit transition-all">
               <Plus size={32} />
               <span className="font-black text-sm uppercase">New Listing</span>
            </button>
          </div>
        )}

        {activeSubTab === 'offers' && (
          <div className="space-y-10">
            <div>
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Offers on your items</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {receivedOffers.length > 0 ? (
                  receivedOffers.map(offer => {
                    const config = getStatusConfig(offer.status);
                    const StatusIcon = config.icon;
                    return (
                      <div key={offer.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5">
                         <img src={offer.buyerAvatar} className="w-16 h-16 rounded-2xl object-cover" />
                         <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 text-base truncate">{offer.buyerName}</p>
                            <p className="text-lg font-black text-sellit">₦{offer.offeredPrice.toLocaleString()}</p>
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border ${config.color}`}>
                              <StatusIcon size={12} /> {config.label}
                            </div>
                         </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full py-12 text-center bg-white border border-dashed border-gray-100 rounded-[2rem] text-gray-300 font-bold italic text-sm">No one has made an offer yet.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'settings' && (
          <div className="max-w-2xl">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-12 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-sellit/5 text-sellit rounded-2xl"><Building2 size={32} /></div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900">Payout Details</h3>
                  <p className="text-gray-500 font-medium">Where should we send your money after a sale?</p>
                </div>
              </div>

              <form onSubmit={handleSaveBankDetails} className="space-y-6">
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-2 ml-1 uppercase tracking-widest">Bank Name</label>
                  <input required type="text" placeholder="e.g. Zenith Bank" className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-sellit/10 transition-all font-medium" value={bankForm.bankName} onChange={e => setBankForm({...bankForm, bankName: e.target.value})} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-black text-gray-700 mb-2 ml-1 uppercase tracking-widest">Account Number</label>
                    <input required type="text" placeholder="10 digits" maxLength={10} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-sellit/10 transition-all font-medium" value={bankForm.accountNumber} onChange={e => setBankForm({...bankForm, accountNumber: e.target.value.replace(/[^0-9]/g, '')})} />
                  </div>
                  <div>
                    <label className="block text-sm font-black text-gray-700 mb-2 ml-1 uppercase tracking-widest">Account Name</label>
                    <input required type="text" placeholder="Beneficiary Name" className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-sellit/10 transition-all font-medium" value={bankForm.accountName} onChange={e => setBankForm({...bankForm, accountName: e.target.value})} />
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-2xl flex gap-4 border border-blue-100">
                  <Info size={20} className="text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800 font-medium leading-relaxed">Payments are automatically disbursed from the Sellit Escrow account to this bank account within 24 hours of the buyer releasing the payment.</p>
                </div>
                <button type="submit" disabled={isSavingBank} className="w-full bg-sellit text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-sellit/20 hover:bg-sellit-dark transition-all flex items-center justify-center gap-3">
                  {isSavingBank ? <Loader2 size={24} className="animate-spin" /> : <Check size={24} />}
                  <span>Save Payout Method</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Instant Boost Checkout Modal */}
      {showBoostCheckout && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setShowBoostCheckout(null)} />
              <div className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                  {boostPaymentStep === 'selection' && (
                      <div className="p-10 space-y-8">
                          <div className="text-center">
                              <div className="w-16 h-16 bg-sellit/10 text-sellit rounded-2xl flex items-center justify-center mx-auto mb-4">
                                  <Zap size={32} fill="currentColor" />
                              </div>
                              <h2 className="text-3xl font-black text-gray-900 mb-2">Priority Boost</h2>
                              <p className="text-gray-500 font-medium leading-relaxed">Get 10x more eyes on your ad by pinning it to the top for students.</p>
                          </div>

                          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-white rounded-xl border border-gray-100 overflow-hidden shrink-0">
                                      <img src={showBoostCheckout.imageUrl} className="w-full h-full object-cover" />
                                  </div>
                                  <div className="min-w-0">
                                      <p className="font-bold text-gray-900 text-sm truncate">{showBoostCheckout.title}</p>
                                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">One-time Service</p>
                                  </div>
                              </div>
                              <span className="text-2xl font-black text-sellit">₦100</span>
                          </div>

                          <div className="space-y-3">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Payment Method</p>
                              <div className="grid grid-cols-2 gap-3">
                                  <button onClick={() => setBoostPaymentMethod('card')} className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${boostPaymentMethod === 'card' ? 'border-sellit bg-sellit/[0.02]' : 'border-gray-100'}`}>
                                      <CreditCard className={boostPaymentMethod === 'card' ? 'text-sellit' : 'text-gray-400'} size={24} />
                                      <span className={`text-xs font-black ${boostPaymentMethod === 'card' ? 'text-gray-900' : 'text-gray-400'}`}>Card</span>
                                  </button>
                                  <button onClick={() => setBoostPaymentMethod('transfer')} className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${boostPaymentMethod === 'transfer' ? 'border-sellit bg-sellit/[0.02]' : 'border-gray-100'}`}>
                                      <ArrowRightLeft className={boostPaymentMethod === 'transfer' ? 'text-sellit' : 'text-gray-400'} size={24} />
                                      <span className={`text-xs font-black ${boostPaymentMethod === 'transfer' ? 'text-gray-900' : 'text-gray-400'}`}>Transfer</span>
                                  </button>
                              </div>
                          </div>

                          <button 
                            onClick={processBoostPayment}
                            className="w-full bg-sellit text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-sellit/20 hover:bg-sellit-dark transition-all active:scale-[0.98]"
                          >
                              Pay ₦100 & Boost
                          </button>
                          
                          <button onClick={() => setShowBoostCheckout(null)} className="w-full text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors">Maybe Later</button>
                      </div>
                  )}

                  {boostPaymentStep === 'processing' && (
                      <div className="p-20 text-center space-y-6">
                          <Loader2 className="w-16 h-16 text-sellit animate-spin mx-auto" />
                          <div>
                              <h2 className="text-2xl font-black text-gray-900">Securing your spot</h2>
                              <p className="text-gray-400 font-medium">Setting up priority placement...</p>
                          </div>
                      </div>
                  )}

                  {boostPaymentStep === 'success' && (
                      <div className="p-12 text-center space-y-8">
                          <div className="w-24 h-24 bg-sellit text-white rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-sellit/20">
                              <Check size={56} strokeWidth={3} />
                          </div>
                          <div>
                              <h2 className="text-4xl font-black text-gray-900 mb-3">Item Boosted!</h2>
                              <p className="text-gray-500 font-medium max-w-xs mx-auto">Your ad is now priority and will stay at the top of the campus feed.</p>
                          </div>
                          <button onClick={() => setShowBoostCheckout(null)} className="w-full bg-gray-900 text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl">
                              Done
                          </button>
                      </div>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};
