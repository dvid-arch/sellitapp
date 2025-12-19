
import React, { useEffect, useState, useRef } from 'react';
import { 
  X, MapPin, ChevronLeft, ChevronRight, MessageSquare, 
  CheckCircle2, Tag, ArrowRight, Loader2, Clock, 
  AlertCircle, Edit3, Trash2, Check, BarChart3,
  TrendingUp, Heart, Flame, ShoppingBag, Eye, ExternalLink
} from 'lucide-react';
import { Listing, Offer, Chat } from '../types';
import { useToast } from '../context/ToastContext';

interface ProductDetailProps {
  listing: Listing;
  userOffer?: Offer;
  receivedOffers?: Offer[]; // For Sellers
  existingChat?: Chat;
  lastViewedPrice?: number;
  isOwner?: boolean;
  isSaved?: boolean;
  onClose: () => void;
  onContact?: () => void;
  onMakeOffer?: (amount: number, message: string) => void;
  onWithdrawOffer?: (offerId: string) => void;
  onToggleSave?: (id: string) => void;
  onMarkSold?: (id: string) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ 
  listing, 
  userOffer, 
  receivedOffers = [],
  existingChat,
  lastViewedPrice,
  isOwner,
  isSaved,
  onClose, 
  onContact, 
  onMakeOffer,
  onWithdrawOffer,
  onToggleSave,
  onMarkSold,
  onEdit,
  onDelete
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState(userOffer ? userOffer.offeredPrice.toString() : '');
  const [offerMessage, setOfferMessage] = useState(userOffer ? userOffer.message : '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();
  
  const productImages = listing.images && listing.images.length > 0 
    ? listing.images 
    : [listing.imageUrl];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleScroll = () => {
    if (scrollRef.current) {
      const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.offsetWidth);
      if (index !== currentIdx) {
        setCurrentIdx(index);
      }
    }
  };

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: index * scrollRef.current.offsetWidth,
        behavior: 'smooth'
      });
    }
  };

  const handleSubmitOffer = () => {
    const amount = parseFloat(offerAmount.replace(/[^0-9.]/g, ''));
    if (isNaN(amount) || amount <= 0) {
      showToast('Invalid Amount', 'Please enter a valid offer price.', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      if (onMakeOffer) onMakeOffer(amount, offerMessage);
      setIsSubmitting(false);
      setShowOfferModal(false);
      showToast(
        userOffer ? 'Offer Updated' : 'Offer Sent!', 
        `Your offer of ₦${amount.toLocaleString()} has been ${userOffer ? 'updated' : 'sent to ' + listing.seller}.`, 
        'success'
      );
    }, 1200);
  };

  const priceDrop = lastViewedPrice && lastViewedPrice > listing.price ? lastViewedPrice - listing.price : 0;
  const discountPercentage = offerAmount 
    ? Math.round((1 - parseFloat(offerAmount.replace(/[^0-9.]/g, '')) / listing.price) * 100)
    : 0;

  const renderContextBanner = () => {
    if (listing.status === 'sold') {
      return (
        <div className="bg-gray-900 text-white px-8 py-3 flex items-center gap-3 animate-in slide-in-from-top duration-500">
          <ShoppingBag size={18} />
          <span className="text-xs font-black uppercase tracking-wider">This item has been sold</span>
        </div>
      );
    }

    if (isOwner) {
      return (
        <div className="bg-sellit text-white px-8 py-3 flex items-center gap-3 animate-in slide-in-from-top duration-500">
          <BarChart3 size={18} />
          <span className="text-xs font-black uppercase tracking-wider">Item Insights & Control Center</span>
        </div>
      );
    }

    if (priceDrop > 0) {
      return (
        <div className="bg-green-500 text-white px-8 py-3 flex items-center gap-3 animate-in slide-in-from-top duration-500">
          <TrendingUp size={18} />
          <span className="text-xs font-black uppercase tracking-wider">Price Dropped ₦{priceDrop.toLocaleString()} recently!</span>
        </div>
      );
    }

    if (userOffer) {
      const statusMap = {
        pending: { color: 'bg-amber-500', icon: Clock, text: 'Your offer is pending' },
        accepted: { color: 'bg-green-600', icon: Check, text: 'Offer accepted! Contact seller' },
        declined: { color: 'bg-red-500', icon: X, text: 'Offer declined' },
        countered: { color: 'bg-blue-500', icon: Edit3, text: 'Seller countered your offer' },
        withdrawn: { color: 'bg-gray-500', icon: Trash2, text: 'You withdrew this offer' }
      };
      const config = statusMap[userOffer.status];
      return (
        <div className={`${config.color} text-white px-8 py-3 flex items-center gap-3 animate-in slide-in-from-top duration-500`}>
          <config.icon size={18} />
          <span className="text-xs font-black uppercase tracking-wider">{config.text}</span>
        </div>
      );
    }

    return null;
  };

  const renderActionArea = () => {
    if (listing.status === 'sold') return null;

    if (isOwner) {
      return (
        <div className="space-y-6">
          {/* Performance Section */}
          <div className="bg-sellit/5 rounded-[2.5rem] p-8 border border-sellit/10">
             <div className="flex items-center justify-between mb-6">
               <h3 className="text-[10px] font-black text-sellit uppercase tracking-widest flex items-center gap-2">
                 <Eye size={14} /> Engagement Metrics
               </h3>
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div className="bg-white p-5 rounded-3xl shadow-sm border border-sellit/5">
                 <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Live Views</p>
                 <div className="flex items-baseline gap-1.5">
                   <p className="text-3xl font-black text-gray-900">{listing.viewCount || 0}</p>
                   <span className="text-[10px] text-green-500 font-bold">+12%</span>
                 </div>
               </div>
               <div className="bg-white p-5 rounded-3xl shadow-sm border border-sellit/5">
                 <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Offers</p>
                 <div className="flex items-baseline gap-1.5">
                   <p className="text-3xl font-black text-gray-900">{receivedOffers.length}</p>
                   <span className="text-[10px] text-orange-500 font-bold">Active</span>
                 </div>
               </div>
             </div>
          </div>

          <div className="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Offers Management</h3>
               {receivedOffers.length > 0 && <span className="text-[10px] font-bold text-sellit">Action Required</span>}
            </div>
            
            <div className="space-y-4 max-h-64 overflow-y-auto scrollbar-hide">
              {receivedOffers.length > 0 ? (
                receivedOffers.map(offer => (
                  <div key={offer.id} className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between group hover:border-sellit/30 transition-all shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={offer.buyerAvatar} className="w-12 h-12 rounded-full object-cover border border-gray-100" />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{offer.buyerName}</p>
                        <p className="text-sm font-black text-sellit">₦{offer.offeredPrice.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <button className="p-2.5 bg-sellit/5 text-sellit rounded-xl hover:bg-sellit hover:text-white transition-all">
                         <MessageSquare size={18} />
                       </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-100 mx-auto mb-4 border border-dashed border-gray-200">
                    <Tag size={24} />
                  </div>
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No offers received yet</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <button onClick={onEdit} className="flex-1 bg-white border-2 border-gray-100 text-gray-900 py-4.5 rounded-[1.5rem] font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all active:scale-95 shadow-sm">
              <Edit3 size={18} /> Edit Ad
            </button>
            <button 
              onClick={() => onMarkSold?.(listing.id)}
              className="flex-1 bg-gray-900 text-white py-4.5 rounded-[1.5rem] font-bold shadow-xl shadow-gray-200 flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95"
            >
              <CheckCircle2 size={18} /> Mark Sold
            </button>
          </div>
          <button onClick={onDelete} className="w-full text-red-400 hover:text-red-500 py-3 font-black text-[10px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
            <Trash2 size={14} /> Remove Listing Forever
          </button>
        </div>
      );
    }

    if (userOffer) {
      return (
        <div className="space-y-4">
          <div className="p-6 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Your Proposal</span>
              <span className="text-2xl font-black text-sellit">₦{userOffer.offeredPrice.toLocaleString()}</span>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowOfferModal(true)} 
                className="flex-1 bg-white border border-gray-100 py-3 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                <Edit3 size={14} /> Revise Offer
              </button>
              <button 
                onClick={() => onWithdrawOffer?.(userOffer.id)} 
                className="px-4 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          <button onClick={onContact} className="w-full bg-sellit text-white py-5 rounded-[1.5rem] font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-sellit/20 active:scale-95 transition-all">
            <MessageSquare size={22} />
            <span>{existingChat ? 'Resume Conversation' : 'Message Seller'}</span>
          </button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button onClick={() => setShowOfferModal(true)} className="w-full bg-white text-sellit py-4 md:py-5 rounded-[1.25rem] md:rounded-[1.5rem] font-bold text-lg flex items-center justify-center gap-3 border-2 border-sellit/20 hover:bg-sellit/5 transition-all active:scale-95 shadow-sm">
          <Tag size={22} />
          <span>Make Offer</span>
        </button>
        <button onClick={onContact} className="w-full bg-sellit text-white py-4 md:py-5 rounded-[1.25rem] md:rounded-[1.5rem] font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-sellit/20 hover:bg-sellit-dark transition-all active:scale-95">
          <MessageSquare size={22} />
          <span>{existingChat ? 'Resume Chat' : 'Chat Seller'}</span>
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[60] flex md:justify-end pointer-events-none md:p-4 lg:p-5">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px] animate-in fade-in duration-300 pointer-events-auto" onClick={onClose} />
      
      <div className="relative w-full md:max-w-xl bg-white shadow-2xl overflow-hidden animate-in slide-in-from-bottom md:slide-in-from-right duration-500 ease-out flex flex-col h-full mt-auto md:mt-0 max-h-[92vh] md:max-h-full pointer-events-auto rounded-t-[2.5rem] md:rounded-[2.5rem] ring-1 ring-black/5">
        
        {renderContextBanner()}

        <div className="flex items-center justify-between px-6 py-4 md:px-8 md:py-6 border-b border-gray-50 shrink-0">
          <div className="flex items-center gap-3">
             <h2 className="text-xl md:text-2xl font-black text-gray-900">{isOwner ? 'Management' : 'Product Details'}</h2>
          </div>
          <div className="flex items-center gap-2">
            {!isOwner && (
              <button 
                onClick={() => onToggleSave?.(listing.id)}
                className={`p-2 rounded-full transition-all ${isSaved ? 'text-sellit bg-sellit/10' : 'text-gray-300 hover:bg-gray-50'}`}
              >
                <Heart size={24} fill={isSaved ? 'currentColor' : 'none'} />
              </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide pb-24 md:pb-8">
          <div className="p-4 md:p-8">
            <div className="relative aspect-square md:aspect-[4/3] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden mb-6 md:mb-8 group bg-gray-50 shadow-inner">
              <div ref={scrollRef} onScroll={handleScroll} className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                {productImages.map((img, i) => (
                  <div key={i} className="min-w-full h-full snap-center">
                    <img src={img} className="w-full h-full object-cover" alt="" />
                  </div>
                ))}
              </div>
              
              {productImages.length > 1 && (
                <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                  <button onClick={() => scrollToIndex(currentIdx - 1)} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white pointer-events-auto hover:bg-white/40 transition-all"><ChevronLeft size={20} /></button>
                  <button onClick={() => scrollToIndex(currentIdx + 1)} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white pointer-events-auto hover:bg-white/40 transition-all"><ChevronRight size={20} /></button>
                </div>
              )}
            </div>

            <div className="space-y-6 md:space-y-8">
              <div>
                <div className="flex items-center justify-between gap-4 mb-2">
                   <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight truncate">{listing.title}</h1>
                   {!isOwner && <span className="text-[10px] font-black text-sellit bg-sellit/5 px-2 py-1 rounded-lg border border-sellit/10">{listing.viewCount || 0} views</span>}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-gray-400 font-bold text-xs">
                    <MapPin size={14} />
                    <span>{listing.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400 font-bold text-xs">
                    <Clock size={14} />
                    <span>Listed recently</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 md:p-6 bg-gray-50 rounded-[1.5rem] md:rounded-[2rem]">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Price</span>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl md:text-3xl font-black text-sellit">₦{listing.price.toLocaleString()}</span>
                    {priceDrop > 0 && (
                      <span className="text-sm font-black text-gray-400 line-through opacity-50">₦{lastViewedPrice?.toLocaleString()}</span>
                    )}
                  </div>
                </div>
                {listing.status === 'sold' ? (
                  <span className="bg-gray-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase">SOLD OUT</span>
                ) : (
                  listing.isNegotiable && <span className="bg-sellit/10 text-sellit px-3 py-1.5 rounded-xl text-[10px] font-black uppercase">Negotiable</span>
                )}
              </div>

              <div>
                <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                  About Item
                </h4>
                <p className="text-gray-500 font-medium leading-relaxed text-sm md:text-base">{listing.description}</p>
              </div>

              {!isOwner && (
                <div className="flex items-center justify-between p-4 md:p-6 border border-gray-100 rounded-3xl group cursor-pointer hover:bg-gray-50 transition-all">
                  <div className="flex items-center gap-3 md:gap-4">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" className="w-10 h-10 md:w-14 md:h-14 rounded-full object-cover border border-gray-100" alt="" />
                    <div>
                      <span className="block font-bold text-gray-900 text-sm md:text-base">{listing.seller}</span>
                      <span className="text-[10px] font-bold text-green-500 uppercase flex items-center gap-1">
                        Verified Student
                      </span>
                    </div>
                  </div>
                  <div className="p-2 md:p-3 bg-sellit/5 text-sellit rounded-2xl group-hover:bg-sellit group-hover:text-white transition-all"><ExternalLink size={18} /></div>
                </div>
              )}

              {renderActionArea()}
            </div>
          </div>
        </div>
      </div>

      {showOfferModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-auto">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowOfferModal(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <button onClick={() => setShowOfferModal(false)} className="absolute top-8 right-8 p-2 text-gray-400 hover:text-gray-900 transition-colors"><X size={24} /></button>
            <div className="space-y-8">
              <div className="text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 tracking-tight">{userOffer ? 'Revise Offer' : 'Make an Offer'}</h2>
                <p className="text-gray-500 font-medium">Propose a fair price for <span className="text-gray-900 font-bold">{listing.title}</span>.</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 flex items-center justify-between">
                <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Asking Price</p><p className="text-2xl font-black text-gray-400 line-through">₦{listing.price.toLocaleString()}</p></div>
                {discountPercentage > 0 && discountPercentage < 100 && (
                  <div className="text-right"><p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-1">Your Discount</p><p className="text-2xl font-black text-green-500">{discountPercentage}% OFF</p></div>
                )}
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-700 ml-1 uppercase tracking-widest">Your Price (₦)</label>
                  <input type="text" placeholder="Enter your offer" className="w-full px-6 py-5 bg-white border-2 border-gray-100 rounded-2xl focus:border-sellit focus:ring-4 focus:ring-sellit/5 transition-all font-black text-2xl text-sellit" value={offerAmount} onChange={e => setOfferAmount(e.target.value)} autoFocus />
                </div>
              </div>
              <button onClick={handleSubmitOffer} disabled={isSubmitting || !offerAmount} className="w-full bg-sellit text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-sellit/20 hover:bg-sellit-dark transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50">
                {isSubmitting ? <><Loader2 className="animate-spin" size={24} /><span>Processing...</span></> : <><Check size={24} /><span>{userOffer ? 'Confirm Revision' : 'Submit Offer'}</span></>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
