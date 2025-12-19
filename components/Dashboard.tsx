
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  Plus, Search, MapPin, Bell, MessageSquare, Home, 
  ChevronDown, Filter, PackageX, LogOut, PanelLeftClose, PanelLeftOpen,
  ArrowUpDown, Radio, User as UserIcon, SlidersHorizontal, Settings, UserCircle
} from 'lucide-react';
import { Logo } from '../constants';
import { User, Listing, Offer, Broadcast, Chat } from '../types';
import { ListingForm } from './ListingForm';
import { ProductDetail } from './ProductDetail';
import { BroadcastForm } from './BroadcastForm';
import { BroadcastsView } from './BroadcastsView';
import { ChatView } from './ChatView';
import { NotificationsView } from './NotificationsView';
import { OfferView } from './OfferView';
import { ProfileView } from './ProfileView';

interface DashboardProps {
  user: User | null;
  onLogout: () => void;
}

const MOCK_LISTINGS: Listing[] = [
  {
    id: '1',
    title: 'Mini Refrigerator',
    price: 75000,
    category: 'Electronics',
    isUrgent: true,
    isNegotiable: true,
    description: 'Small refrigerator, perfect for keeping drinks and snacks cold in your hostel room. High energy efficiency.',
    imageUrl: 'https://images.unsplash.com/photo-1571175452281-04a282879717?q=80&w=800&auto=format&fit=crop',
    seller: 'Jane Darwin',
    location: 'NDDC Hostel'
  },
  {
    id: '2',
    title: 'HP Laptop',
    price: 275000,
    category: 'Electronics',
    isNegotiable: true,
    description: 'Fairly used HP laptop, 256GB Ram, Core i5. Perfect for project research. Battery life is solid.',
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop',
    seller: 'Peter O.',
    location: 'NDDC Hostel'
  },
  {
    id: '3',
    title: 'Scientific Calculator',
    price: 5000,
    category: 'Books',
    description: 'Trusted model for science students. Works perfectly with no scratches.',
    imageUrl: 'https://images.unsplash.com/photo-1543674892-7d64d45df18b?q=80&w=800&auto=format&fit=crop',
    seller: 'Samuel K.',
    location: 'NDDC Hostel'
  },
  {
    id: '4',
    title: 'PS4',
    price: 375000,
    category: 'Electronics',
    isNegotiable: true,
    description: 'Fully functional PS4 with two controllers. Ideal for gaming breaks.',
    imageUrl: 'https://images.unsplash.com/photo-1507450966965-9a96dd4d98f0?q=80&w=800&auto=format&fit=crop',
    seller: 'Mike T.',
    location: 'Engineering Hall'
  },
  {
    id: '6',
    title: '2-Burner Gas Stove',
    price: 35000,
    category: 'Kitchen',
    isNegotiable: true,
    description: 'Perfect for hostel cooking. Compact and efficient.',
    imageUrl: 'https://images.unsplash.com/photo-1521203050033-780598859941?q=80&w=800&auto=format&fit=crop',
    seller: 'John Darwin',
    location: 'Moremi Hall'
  }
];

const INITIAL_CHATS: Chat[] = [
  {
    id: 'chat_1',
    contactName: 'John Darwin',
    contactAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    lastSeen: 'last seen 5 mins ago',
    lastMessage: 'Yes, it\'s still available.',
    lastMessageTime: '18:17',
    product: {
      title: '2-Burner Gas Stove',
      price: 35000,
      imageUrl: 'https://images.unsplash.com/photo-1521203050033-780598859941?w=150'
    },
    messages: [
      { id: 'm1', text: 'Hi! Is this still available?', timestamp: '18:16', senderId: 'me' },
      { id: 'm2', text: "Yes, it is.", timestamp: '18:17', senderId: 'them' },
    ]
  }
];

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('Home');
  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS);
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [showBroadcastForm, setShowBroadcastForm] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  
  // Filtering & Sorting State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('Newest');
  
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Handle clicks outside profile dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    setIsScrolled(e.currentTarget.scrollTop > 100);
  };

  const startChat = useCallback((contactName: string, avatar: string, product: { title: string, price: number, imageUrl: string }) => {
    const existingChat = chats.find(c => c.contactName === contactName && c.product.title === product.title);
    if (existingChat) {
      setActiveChatId(existingChat.id);
    } else {
      const newChat: Chat = {
        id: `chat_${Date.now()}`,
        contactName,
        contactAvatar: avatar,
        lastSeen: 'Active now',
        lastMessage: 'Starting conversation...',
        lastMessageTime: 'Just now',
        product,
        messages: []
      };
      setChats(prev => [newChat, ...prev]);
      setActiveChatId(newChat.id);
    }
    setActiveTab('Messages');
  }, [chats]);

  const filteredListings = useMemo(() => {
    let result = listings.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All Categories' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === 'Price: Low to High') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'Price: High to Low') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'Urgent First') result.sort((a, b) => (b.isUrgent ? 1 : 0) - (a.isUrgent ? 1 : 0));

    return result;
  }, [listings, searchQuery, selectedCategory, sortBy]);

  const navItems = [
    { name: 'Home', icon: Home },
    { name: 'Broadcasts', icon: Radio },
    { name: 'Add Product', icon: Plus, primary: true },
    { name: 'Notifications', icon: Bell },
    { name: 'Messages', icon: MessageSquare },
  ];

  const categories = ['All Categories', 'Electronics', 'Books', 'Fashion', 'Kitchen', 'Home and furniture'];
  const sortOptions = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Urgent First'];

  const renderContent = () => {
    if (showBroadcastForm) return <div className="p-4 md:p-8"><BroadcastForm onBack={() => setShowBroadcastForm(false)} /></div>;
    
    switch (activeTab) {
      case 'Broadcasts':
        return <div className="p-4 md:p-8"><BroadcastsView onRespond={(b) => startChat(b.author, b.authorAvatar, { title: b.need, price: b.budgetMax, imageUrl: b.authorAvatar })} /></div>;
      case 'Add Product':
        return <ListingForm onClose={() => setActiveTab('Home')} onSubmit={(l) => { setListings([l, ...listings]); setActiveTab('Home'); }} />;
      case 'Notifications':
        return <div className="p-4 md:p-8"><NotificationsView onAction={(p) => { if(p.type === 'view_listing') setSelectedListing(listings[0]); }} /></div>;
      case 'Messages':
        return <ChatView chats={chats} activeChatId={activeChatId} onSelectChat={setActiveChatId} onSendMessage={(chatId, text) => {
          setChats(prev => prev.map(c => c.id === chatId ? { ...c, messages: [...c.messages, { id: Date.now().toString(), text, timestamp: 'now', senderId: 'me' }], lastMessage: text } : c));
        }} />;
      case 'Profile':
        return <ProfileView user={user} listings={listings.filter(l => l.seller === (user?.name || 'Obokobong'))} />;
      default:
        return (
          <div className="p-4 md:p-8">
            {/* Responsive Hero */}
            <div className="relative w-full h-44 md:h-80 rounded-[2rem] md:rounded-[3rem] overflow-hidden mb-8 md:mb-12 bg-sellit text-white shadow-2xl shadow-sellit/20 flex flex-col justify-center px-6 md:px-16 group">
              <div className="absolute inset-0 bg-gradient-to-r from-sellit-dark via-sellit to-transparent opacity-90 z-10" />
              <div className="relative z-20 max-w-xl">
                <h1 className="text-2xl md:text-5xl font-black mb-3 md:mb-5 leading-tight tracking-tight text-white drop-shadow-sm">Need something?<br/>Broadcast to Campus.</h1>
                <p className="text-white/80 text-xs md:text-lg mb-4 md:mb-8 font-medium leading-relaxed hidden sm:block drop-shadow-sm">Post your request and let fellow students find you. Simple, fast, and local.</p>
                <div className="flex gap-3">
                  <button onClick={() => setShowBroadcastForm(true)} className="bg-white text-sellit px-5 py-2.5 md:px-8 md:py-3.5 rounded-xl md:rounded-2xl font-black text-xs md:text-sm shadow-xl hover:scale-105 active:scale-95 transition-all">Start Broadcast</button>
                  <button onClick={() => setActiveTab('Broadcasts')} className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2.5 md:px-8 md:py-3.5 rounded-xl md:rounded-2xl font-black text-xs md:text-sm hover:bg-white/20 transition-all">View Needs</button>
                </div>
              </div>
            </div>

            {/* Robust Filter Bar - Responsive */}
            <div className={`sticky top-[-1px] z-30 transition-all duration-300 py-4 -mx-4 md:-mx-8 px-4 md:px-8 bg-[#F8FAFB]/95 backdrop-blur-md mb-6 md:mb-10 ${isScrolled ? 'border-b border-gray-100 shadow-sm' : ''}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2 md:gap-4 overflow-x-auto scrollbar-hide">
                  <div className="relative shrink-0">
                    <select 
                      value={selectedCategory} 
                      onChange={(e) => setSelectedCategory(e.target.value)} 
                      className="appearance-none pl-10 pr-10 py-2.5 bg-white border border-gray-100 rounded-xl text-xs md:text-sm font-black text-gray-700 hover:border-sellit transition-all shadow-sm outline-none cursor-pointer"
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <Filter size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>

                  <div className="relative shrink-0">
                    <select 
                      value={sortBy} 
                      onChange={(e) => setSortBy(e.target.value)} 
                      className="appearance-none pl-10 pr-10 py-2.5 bg-white border border-gray-100 rounded-xl text-xs md:text-sm font-black text-gray-700 hover:border-sellit transition-all shadow-sm outline-none cursor-pointer"
                    >
                      {sortOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <ArrowUpDown size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4">
                   <span className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">{filteredListings.length} items found</span>
                   <div className="flex items-center gap-2 text-[10px] md:text-xs font-black text-sellit bg-sellit/5 px-3 py-1.5 rounded-lg border border-sellit/10">
                     <MapPin size={12} />
                     <span>NDDC Hostel</span>
                   </div>
                </div>
              </div>
            </div>
            
            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8 pb-28 md:pb-12">
              {isLoading ? (
                Array.from({length: 10}).map((_, i) => (
                  <div key={i} className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] h-56 md:h-80 animate-pulse border border-gray-100 p-4">
                    <div className="bg-gray-50 h-2/3 rounded-2xl mb-4" />
                    <div className="h-4 bg-gray-50 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-50 rounded w-1/2" />
                  </div>
                ))
              ) : filteredListings.length > 0 ? (
                filteredListings.map((item) => (
                  <div key={item.id} onClick={() => setSelectedListing(item)} className="group bg-white rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-sellit/5 transition-all duration-500 cursor-pointer">
                    <div className="relative aspect-square md:aspect-[4/5] overflow-hidden bg-gray-50">
                      <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title} />
                      {item.isUrgent && (
                        <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider z-10 shadow-lg animate-pulse">
                          Urgent
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                    </div>
                    <div className="p-4 md:p-6">
                      <h3 className="font-black text-gray-900 text-sm md:text-lg leading-tight truncate group-hover:text-sellit transition-colors">{item.title}</h3>
                      <p className="text-[10px] md:text-xs text-gray-400 font-bold mt-1 md:mt-2 line-clamp-1">{item.description}</p>
                      <div className="flex items-center justify-between mt-3 md:mt-5 pt-3 border-t border-gray-50">
                        <span className="text-sm md:text-xl font-black text-gray-900">₦{item.price.toLocaleString()}</span>
                        {item.isNegotiable && <span className="text-[8px] md:text-[10px] font-black text-sellit bg-sellit/10 px-2 py-0.5 rounded-md uppercase">Neg.</span>}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-24 md:py-40 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-200 mb-8 border border-dashed border-gray-200">
                    <PackageX size={40} />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">No items found</h2>
                  <p className="text-gray-400 font-medium max-w-sm px-4">Try changing your filters or broadcasting what you're looking for!</p>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#F8FAFB] overflow-hidden">
      {/* DESKTOP SIDEBAR */}
      <aside className={`hidden md:flex bg-white border-r border-gray-100 flex-col shrink-0 z-40 transition-all duration-500 ${isSidebarExpanded ? 'w-64' : 'w-24'}`}>
        <div className="p-6 flex items-center justify-between">
          {isSidebarExpanded ? <Logo /> : <div className="w-12 h-12 rounded-2xl bg-sellit/10 flex items-center justify-center text-sellit font-black text-xl">S</div>}
          <button onClick={() => setIsSidebarExpanded(!isSidebarExpanded)} className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors">
            {isSidebarExpanded ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
          </button>
        </div>
        <nav className="flex-1 px-4 space-y-3 mt-6">
          {navItems.map((item) => (
            <button 
              key={item.name} 
              onClick={() => { setActiveTab(item.name); setShowBroadcastForm(false); }} 
              className={`w-full flex items-center p-4 rounded-2xl font-black gap-4 transition-all duration-300 ${
                activeTab === item.name && !showBroadcastForm ? 'bg-sellit text-white shadow-xl shadow-sellit/20 translate-x-1' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <item.icon size={24} className="shrink-0" />
              {isSidebarExpanded && <span className="text-sm uppercase tracking-wider">{item.name}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* MOBILE/TABLET BOTTOM NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-2xl border-t border-gray-100 pt-2 pb-safe-offset-3">
        <div className="flex justify-around items-end h-16">
          {navItems.map((item) => (
            <button 
              key={item.name} 
              onClick={() => { setActiveTab(item.name); setShowBroadcastForm(false); }}
              className={`flex flex-col items-center justify-center w-full h-full transition-all ${
                item.primary ? '-translate-y-5 scale-110' : ''
              } ${activeTab === item.name && !showBroadcastForm ? 'text-sellit' : 'text-gray-400'}`}
            >
              <div className={`${item.primary ? 'bg-sellit text-white p-4 rounded-[1.5rem] shadow-2xl shadow-sellit/40 active:scale-90 transition-transform ring-4 ring-white' : 'p-2'}`}>
                <item.icon size={item.primary ? 28 : 24} />
              </div>
              {!item.primary && <span className="text-[9px] font-black mt-1 uppercase tracking-tighter">{item.name}</span>}
            </button>
          ))}
        </div>
      </nav>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* UNIVERSAL HEADER */}
        <header className="h-16 md:h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-10 shrink-0 z-30">
          <div className="flex-1 max-w-2xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search anything on campus..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 md:py-3.5 bg-gray-50 border-none rounded-2xl text-sm md:text-base outline-none focus:ring-4 focus:ring-sellit/5 transition-all font-bold text-gray-900 placeholder:text-gray-400" 
            />
          </div>
          
          {/* USER PROFILE & DROPDOWN */}
          <div className="ml-4 flex items-center gap-2 md:gap-5 relative" ref={profileDropdownRef}>
             <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                onFocus={() => setIsProfileOpen(true)}
                className="flex items-center gap-3 group focus:outline-none"
             >
               <div className="hidden sm:flex flex-col items-end transition-opacity group-hover:opacity-80">
                 <span className="text-xs font-black text-gray-900">{user?.name || 'Obokobong'}</span>
                 <span className="text-[9px] font-black text-sellit uppercase tracking-widest">NDDC Hostel</span>
               </div>
               <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gray-50 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden ring-1 ring-gray-100 group-hover:ring-sellit/30 transition-all">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" className="w-full h-full object-cover" alt="Profile" />
               </div>
             </button>

             {/* Profile Dropdown Menu */}
             {isProfileOpen && (
               <div className="absolute top-full right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[100] ring-1 ring-black/5">
                 <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Signed in as</p>
                   <p className="text-sm font-black text-gray-900 truncate">{user?.email || 'ubokobong@gmail.com'}</p>
                 </div>
                 <div className="p-2">
                   <button onClick={() => { setIsProfileOpen(false); setActiveTab('Profile'); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                     <UserCircle size={18} className="text-gray-400" />
                     My Profile
                   </button>
                   <button onClick={() => { setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                     <Settings size={18} className="text-gray-400" />
                     Settings
                   </button>
                   <div className="h-px bg-gray-50 my-1 mx-2" />
                   <button 
                     onClick={() => { setIsProfileOpen(false); onLogout(); }} 
                     className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                   >
                     <LogOut size={18} />
                     Sign Out
                   </button>
                 </div>
               </div>
             )}
          </div>
        </header>

        <main onScroll={handleScroll} className="flex-1 overflow-y-auto scrollbar-hide relative bg-[#F8FAFB]">
          {renderContent()}
        </main>
      </div>

      {selectedListing && (
        <ProductDetail 
          listing={selectedListing} 
          onClose={() => setSelectedListing(null)} 
          onContact={() => startChat(selectedListing.seller, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', { title: selectedListing.title, price: selectedListing.price, imageUrl: selectedListing.imageUrl })} 
        />
      )}
    </div>
  );
};
