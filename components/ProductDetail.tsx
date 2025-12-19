
import React, { useEffect, useState, useRef } from 'react';
import { X, MapPin, ChevronLeft, ChevronRight, MessageSquare, CheckCircle2 } from 'lucide-react';
import { Listing } from '../types';

interface ProductDetailProps {
  listing: Listing;
  onClose: () => void;
  onContact?: () => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ listing, onClose, onContact }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  
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

  return (
    <div className="fixed inset-0 z-[60] flex md:justify-end pointer-events-none">
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px] animate-in fade-in duration-300 pointer-events-auto" 
        onClick={onClose} 
      />
      
      <div className="relative w-full md:max-w-xl bg-white md:rounded-l-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom md:slide-in-from-right duration-500 ease-out flex flex-col h-full mt-auto md:mt-0 max-h-[95vh] md:max-h-full pointer-events-auto rounded-t-[2.5rem] md:rounded-t-none">
        
        <div className="flex items-center justify-between px-6 py-4 md:px-8 md:py-6 border-b border-gray-50 shrink-0">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Product Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide pb-24 md:pb-8">
          <div className="p-4 md:p-8">
            <div className="relative aspect-square md:aspect-[4/3] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden mb-6 md:mb-8 group bg-gray-50">
              <div 
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
              >
                {productImages.map((img, i) => (
                  <div key={i} className="min-w-full h-full snap-center">
                    <img src={img} className="w-full h-full object-cover" alt="" />
                  </div>
                ))}
              </div>
              
              {productImages.length > 1 && (
                <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                  <button onClick={() => scrollToIndex(currentIdx - 1)} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white pointer-events-auto hover:bg-white/40 disabled:opacity-0"><ChevronLeft size={20} /></button>
                  <button onClick={() => scrollToIndex(currentIdx + 1)} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white pointer-events-auto hover:bg-white/40 disabled:opacity-0"><ChevronRight size={20} /></button>
                </div>
              )}
            </div>

            <div className="space-y-6 md:space-y-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-1">{listing.title}</h1>
                <div className="flex items-center gap-1.5 text-gray-400 font-bold text-xs">
                  <MapPin size={14} />
                  <span>{listing.location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 md:p-6 bg-gray-50 rounded-[1.5rem] md:rounded-[2rem]">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Current Price</span>
                  <span className="text-2xl md:text-3xl font-black text-sellit">₦{listing.price.toLocaleString()}</span>
                </div>
                {listing.isNegotiable && <span className="bg-sellit/10 text-sellit px-3 py-1.5 rounded-xl text-[10px] font-black uppercase">Negotiable</span>}
              </div>

              <div>
                <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-2">Description</h4>
                <p className="text-gray-500 font-medium leading-relaxed text-sm md:text-base">{listing.description}</p>
              </div>

              <div className="flex items-center justify-between p-4 md:p-6 border border-gray-100 rounded-3xl">
                <div className="flex items-center gap-3 md:gap-4">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" className="w-10 h-10 md:w-14 md:h-14 rounded-full object-cover" alt="" />
                  <div>
                    <span className="block font-bold text-gray-900 text-sm md:text-base">{listing.seller}</span>
                    <span className="text-[10px] font-bold text-green-500 uppercase">Verified Student</span>
                  </div>
                </div>
                <div className="p-2 md:p-3 bg-sellit/5 text-sellit rounded-2xl"><CheckCircle2 size={20} /></div>
              </div>

              <button 
                onClick={onContact}
                className="w-full bg-sellit text-white py-4 md:py-5 rounded-[1.25rem] md:rounded-[1.5rem] font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-sellit/20 hover:bg-sellit-dark transition-all active:scale-95"
              >
                <MessageSquare size={22} />
                <span>Chat with Seller</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
