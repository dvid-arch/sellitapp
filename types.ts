
export type AuthStep = 'signup' | 'login' | 'verify' | 'authenticated';

export interface User {
  name: string;
  email: string;
  phone: string;
}

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
}

export interface CarouselSlide {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  icon?: 'location';
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
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
}
