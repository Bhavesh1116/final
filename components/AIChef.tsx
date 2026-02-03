import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, MapPin, ChefHat, X, Sparkles } from 'lucide-react';
import { getDishRecommendation, askRestaurantAgent } from '../services/geminiService';
import { MenuItem } from '../types';

interface AIChefProps {
  onRecommend: (dishIds: string[]) => void;
  fullMenu: MenuItem[];
}

type Mode = 'food' | 'general';

export const AIChef: React.FC<AIChefProps> = ({ onRecommend, fullMenu }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showHint, setShowHint] = useState(false); // New state for visibility
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<Mode>('food');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, loading]);

  // Show the "I can check maps" hint after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);
    setShowHint(false); // Hide hint once interaction starts

    try {
      if (mode === 'food') {
        const result = await getDishRecommendation(userMsg);
        setMessages(prev => [...prev, { role: 'ai', text: result.recommendationText }]);
        if (result.recommendedDishIds.length > 0) {
          onRecommend(result.recommendedDishIds);
        }
      } else {
        const answer = await askRestaurantAgent(userMsg);
        setMessages(prev => [...prev, { role: 'ai', text: answer }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "I'm having trouble connecting to the kitchen. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const openMapsQuery = () => {
    setIsOpen(true);
    setMode('general');
    setInput("How is the traffic near the restaurant right now?");
    setShowHint(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      
      {/* Proactive Notification Bubble */}
      {showHint && !isOpen && (
        <div className="pointer-events-auto mb-4 mr-2 animate-reveal origin-bottom-right">
          <div className="relative bg-white text-dark-950 p-4 rounded-2xl rounded-br-none shadow-2xl border border-gold-500 max-w-xs">
            <button 
              onClick={() => setShowHint(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
            >
              <X className="w-3 h-3" />
            </button>
            <div className="flex gap-3">
              <div className="bg-green-100 p-2 rounded-full h-fit">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-bold text-sm mb-1">Live Updates Active 🟢</p>
                <p className="text-xs text-gray-600 leading-relaxed mb-2">
                  I'm connected to Google Maps! Ask me about traffic, parking, or wait times.
                </p>
                <button 
                  onClick={openMapsQuery}
                  className="text-xs font-bold text-gold-600 hover:underline flex items-center gap-1"
                >
                  Check Traffic Now <Send className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="pointer-events-auto mb-4 w-[90vw] md:w-96 bg-dark-800/95 backdrop-blur-xl border border-gold-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-reveal flex flex-col h-[60vh] md:h-[500px]">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-gold-600 to-gold-500 p-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2 text-dark-950 font-bold">
              <ChefHat className="w-6 h-6" />
              <h3 className="font-serif">Concierge</h3>
            </div>
            {/* Mode Toggles */}
            <div className="flex bg-dark-950/20 p-1 rounded-lg">
              <button 
                onClick={() => setMode('food')}
                className={`p-1.5 rounded-md transition-all ${mode === 'food' ? 'bg-white text-gold-600 shadow-sm' : 'text-dark-900/60 hover:text-dark-950'}`}
                title="Food Recommendations"
              >
                <ChefHat className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setMode('general')}
                className={`p-1.5 rounded-md transition-all ${mode === 'general' ? 'bg-white text-gold-600 shadow-sm' : 'text-dark-900/60 hover:text-dark-950'}`}
                title="Location & Info"
              >
                <MapPin className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Messages Area */}
          <div className="p-4 flex-1 overflow-y-auto space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 text-sm mt-10 px-4 flex flex-col items-center">
                <Sparkles className="w-8 h-8 text-gold-500/50 mb-4" />
                {mode === 'food' ? (
                  <p>Tell me your mood (e.g., "Spicy food" or "Celebration"), and I'll curate a menu.</p>
                ) : (
                  <p>I am grounded with Google Maps. Ask about location, traffic, or nearby landmarks.</p>
                )}
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed animate-reveal ${
                  msg.role === 'user' 
                    ? 'bg-gold-500/20 text-gold-100 border border-gold-500/20 rounded-tr-none' 
                    : 'bg-dark-700 text-gray-200 border border-white/5 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start animate-reveal">
                 <div className="bg-dark-700 rounded-2xl rounded-tl-none p-3 border border-white/5 flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-gold-500" />
                    <span className="text-xs text-gray-400">Chef is thinking...</span>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-dark-900 border-t border-white/5 shrink-0">
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'food' ? "I'm craving something..." : "Traffic, parking, hours..."}
                className="w-full bg-dark-950 border border-dark-700 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-gold-500 transition-colors placeholder-gray-600"
              />
              <button 
                type="submit"
                disabled={loading || !input.trim()}
                className="absolute right-2 top-2 p-1.5 bg-gold-600 rounded-lg text-white hover:bg-gold-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => { setIsOpen(!isOpen); setShowHint(false); }}
        className="pointer-events-auto group flex items-center gap-3 bg-white text-dark-900 px-5 py-3 rounded-full shadow-[0_0_30px_rgba(197,160,40,0.3)] hover:scale-105 transition-all duration-300 border-2 border-gold-400"
      >
        <span className="font-bold font-serif hidden md:block group-hover:block">
          {isOpen ? 'Close' : 'Ask Concierge'}
        </span>
        <div className="bg-gold-500 text-white p-1 rounded-full">
           <ChefHat className="w-5 h-5" />
        </div>
      </button>
    </div>
  );
};