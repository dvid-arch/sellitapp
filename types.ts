
export type AuthStep = 'signup' | 'login' | 'verify' | 'authenticated';

export interface User {
  name: string;
  email: string;
  phone: string;
}

export type OfferStatus = 'pending' | 'accepted' | 'declined' | 'withdrawn' | 'countered';
export type ListingStatus = 'available' | 'pending_payment' | 'sold';

export interface Listing {
  id: string;
  title: string;
  price: number;
  category: string;
  description: string;
  imageUrl: string;
  images?: string[];
  seller: string;
  location: string;
  isUrgent?: boolean;
  isNegotiable?: boolean;
  status: ListingStatus;
  viewCount?: number;
  offerCount?: number;
}

export interface ViewRecord {
  listingId: string;
  lastViewedPrice: number;
  timestamp: number;
}

export interface Offer {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  originalPrice: number;
  offeredPrice: number;
  buyerName: string;
  buyerAvatar: string;
  message: string;
  status: OfferStatus;
  timestamp: string;
}

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  senderId: string;
}

export interface Chat {
  id: string;
  contactName: string;
  contactAvatar: string;
  lastSeen: string;
  lastMessage: string;
  lastMessageTime: string;
  product: {
    title: string;
    price: number;
    imageUrl: string;
  };
  messages: Message[];
}

export type NotificationType = 'match' | 'price_drop' | 'offer' | 'system' | 'trending';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  relatedImage?: string;
  actionLabel?: string;
  actionPayload?: {
    type: 'view_listing' | 'view_offer' | 'navigate_tab';
    id?: string;
    tab?: string;
  };
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  title: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export interface CarouselSlide {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  icon?: string;
}

export interface Broadcast {
  id: string;
  author: string;
  authorAvatar: string;
  need: string;
  details: string;
  budgetMin: number;
  budgetMax: number;
  location: string;
  time: string;
  isBoosted: boolean;
  category: string;
}
