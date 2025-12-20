
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Search, LogOut, PackageX
} from 'lucide-react';
import { Logo } from '../constants.tsx';
import { User, Listing } from '../types.ts';
import { ListingForm } from './ListingForm.tsx';
import { ProductDetail } from './ProductDetail.tsx';
import { useToast } from '../context/ToastContext.tsx';

const MOCK_LISTINGS: Listing[] = [
  {
    id: '1',
    title: 'Mini Refrigerator',
    price: 75000,
    category: 'Electronics',
    description: 'Perfect for dorm rooms. Chills fast.',
    imageUrl: 'https://images.unsplash.com/photo-1571175452281-04a282879717?w=500',
    seller: 'me',
    location: 'Moremi Hall',
    status: 'available'
  },
  {
    id: '2',
    title: 'Calculus Textbook',
    price: 5000,
    category: 'Books',
    description: 'Clean copies, no highlights.',
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
    seller: 'other',
    location: 'Faculty of Science',
    status: 'available'
  }
];

interface DashboardProps {
  user: User | null;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('Home');
  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { showToast } = useToast();

  const filteredListings = useMemo(() => {
    return listings.filter(l => 
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [listings, searchQuery]);

  const handleAddListing = (data: any) => {
    const newListing: Listing = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      seller: 'me',
      status: 'available'
    };
    setListings([newListing, ...listings]);
    setActiveTab('Home');
    showToast('Success', 'Listing published locally!', 'success');
  };

  const renderContent = () => {
    if (activeTab === 'Add Product') {
      return <ListingForm onClose={() => setActiveTab('Home')} onSubmit={handleAddListing} />;
    }

    return (
      <div className="p-4 md:p-8">
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
            {filteredListings.map(item => (
              <div 
                key={item.id} 
                onClick={() => setSelectedListing(item)}
                className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="aspect-square overflow-hidden bg-gray-50">
                   <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.title} />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 truncate">{item.title}</h3>
                  <p className="text-sellit font-black mt-1">₦{item.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <PackageX className="mx-auto text-gray-200 mb-4" size={64} />
            <p className="text-gray-400 font-bold">No listings found matching your search.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#F8FAFB] overflow-hidden">
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-100 flex-col p-6">
        <Logo />
        <nav className="mt-10 space-y-4">
          {['Home', 'Add Product'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              className={`w-full text-left p-4 rounded-2xl font-bold transition-all ${
                activeTab === tab ? 'bg-sellit text-white shadow-lg shadow-sellit/20' : 'text-gray-400 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="mt-auto flex items-center gap-2 text-red-500 font-bold p-4 hover:bg-red-50 rounded-2xl transition-all">
          <LogOut size={20} /> Logout
        </button>
      </aside>
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center px-10">
          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search campus..." 
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl outline-none border-none focus:ring-4 focus:ring-sellit/5"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto scrollbar-hide">{renderContent()}</main>
      </div>

      {selectedListing && (
        <ProductDetail 
          listing={selectedListing} 
          onClose={() => setSelectedListing(null)}
          isOwner={selectedListing.seller === 'me'}
        />
      )}
    </div>
  );
};
