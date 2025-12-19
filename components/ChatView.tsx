
import React, { useState, useMemo } from 'react';
import { Search, Phone, Smile, Send, Info, MessageSquare, ChevronLeft } from 'lucide-react';
import { Chat } from '../types';

interface ChatViewProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (id: string | null) => void;
  onSendMessage: (chatId: string, text: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({ chats, activeChatId, onSelectChat, onSendMessage }) => {
  const [inputText, setInputText] = useState('');
  const [sidebarSearch, setSidebarSearch] = useState('');

  const selectedChat = useMemo(() => 
    chats.find(c => c.id === activeChatId), 
  [chats, activeChatId]);

  const handleSend = () => {
    if (!inputText.trim() || !selectedChat) return;
    onSendMessage(selectedChat.id, inputText);
    setInputText('');
  };

  const showDetailOnMobile = !!activeChatId;

  return (
    <div className="flex h-full bg-white overflow-hidden relative">
      {/* CHAT LIST (Master) */}
      <div className={`w-full md:w-[320px] lg:w-[380px] border-r border-gray-100 flex flex-col bg-[#F9FAFB]/50 transition-all duration-300 ${
        showDetailOnMobile ? 'hidden md:flex' : 'flex'
      }`}>
        <div className="p-6 lg:p-8">
          <h1 className="text-3xl font-black text-gray-900 mb-6">Messages</h1>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search chats..."
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white border-none rounded-2xl focus:ring-4 focus:ring-sellit/5 font-medium text-sm shadow-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 lg:px-4 space-y-1 scrollbar-hide pb-20 md:pb-4">
          {chats.filter(c => c.contactName.toLowerCase().includes(sidebarSearch.toLowerCase())).map((chat) => (
            <div 
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`flex items-center gap-3 p-4 rounded-3xl cursor-pointer transition-all ${
                activeChatId === chat.id ? 'bg-white shadow-md ring-1 ring-sellit/5' : 'hover:bg-gray-100/50'
              }`}
            >
              <div className="relative shrink-0">
                <img src={chat.contactAvatar} className="w-12 h-12 rounded-full object-cover border border-gray-100" />
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h3 className="font-bold text-gray-900 text-sm md:text-base truncate">{chat.contactName}</h3>
                  <span className="text-[10px] font-bold text-gray-400">{chat.lastMessageTime}</span>
                </div>
                <p className="text-xs md:text-sm text-gray-500 truncate font-medium">{chat.lastMessage}</p>
              </div>
            </div>
          ))}
          {chats.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center opacity-30 text-center">
              <MessageSquare size={48} className="mb-4" />
              <p className="font-bold">No conversations yet</p>
            </div>
          )}
        </div>
      </div>

      {/* MESSAGES AREA (Detail) */}
      <div className={`flex-1 flex flex-col h-full bg-white fixed inset-0 z-50 md:relative md:z-0 transition-transform duration-300 ease-out ${
        showDetailOnMobile ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
      }`}>
        {!selectedChat ? (
          <div className="hidden md:flex flex-1 flex-col items-center justify-center text-gray-400 text-center gap-6 p-8">
            <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center border border-dashed border-gray-200">
               <MessageSquare size={40} className="text-gray-200" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Select a Conversation</h3>
              <p className="font-medium text-gray-400 max-w-xs">Start a chat from a listing or broadcast to see messages here.</p>
            </div>
          </div>
        ) : (
          <>
            <header className="px-4 md:px-8 py-3 md:py-4 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-md sticky top-0">
              <div className="flex items-center gap-3">
                <button onClick={() => onSelectChat(null)} className="md:hidden p-1.5 -ml-1 text-gray-500 hover:bg-gray-50 rounded-lg"><ChevronLeft size={24} /></button>
                <img src={selectedChat.contactAvatar} className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border border-gray-100" />
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 text-sm md:text-lg leading-tight truncate">{selectedChat.contactName}</h3>
                  <p className="text-[10px] md:text-xs text-green-500 font-bold uppercase tracking-wider">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-4">
                <button className="p-2 text-gray-400 hover:text-sellit transition-colors"><Phone size={20} /></button>
              </div>
            </header>

            <div className="px-4 md:px-8 py-2 md:py-3 border-b border-gray-50 bg-[#F9FAFB]/50 flex items-center gap-3 shrink-0">
              <img src={selectedChat.product.imageUrl} className="w-10 h-10 md:w-12 md:h-12 rounded-xl object-cover border border-gray-100 shadow-sm" />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 text-[10px] md:text-sm truncate leading-tight">{selectedChat.product.title}</h4>
                <p className="text-[10px] md:text-xs font-black text-sellit">₦{selectedChat.product.price.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col gap-4 scrollbar-hide pb-24 md:pb-8">
              {selectedChat.messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.senderId === 'me' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] md:max-w-[70%] px-4 md:px-6 py-3 md:py-4 rounded-2xl md:rounded-[2rem] text-sm md:text-base font-medium shadow-sm ${
                    msg.senderId === 'me' ? 'bg-sellit text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200/30'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[9px] font-bold text-gray-300 mt-1 uppercase px-2">{msg.timestamp}</span>
                </div>
              ))}
              {selectedChat.messages.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center opacity-30 text-center py-20">
                   <p className="font-bold">Be the first to say hello!</p>
                </div>
              )}
            </div>

            <div className="p-4 md:p-8 shrink-0 bg-white border-t border-gray-100 sticky bottom-0 z-10 pb-20 md:pb-8">
              <div className="bg-gray-50 border border-gray-200 rounded-3xl p-1 flex items-center shadow-inner">
                <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors"><Smile size={24} /></button>
                <input 
                  type="text" 
                  placeholder="Message..."
                  className="flex-1 bg-transparent border-none py-3 text-sm md:text-base focus:ring-0 font-medium"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button onClick={handleSend} disabled={!inputText.trim()} className="p-3 text-sellit disabled:opacity-20 active:scale-90 transition-transform">
                  <Send size={24} className="fill-current" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
