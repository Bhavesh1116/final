import React, { useState } from 'react';
import { MenuItem } from '../types';
import { Star, Flame, Leaf, ArrowRight, Wine, ImageOff } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface DishCardProps {
  item: MenuItem;
  isRecommended?: boolean;
  index: number;
}

export const DishCard: React.FC<DishCardProps> = ({ item, isRecommended, index }) => {
  const [imgError, setImgError] = useState(false);
  
  const isWine = item.category === 'Wine';
  const hasBottlePrice = item.bottlePrice !== undefined;
  const isBottleOnly = hasBottlePrice && item.price === item.bottlePrice;

  return (
    <ScrollReveal delay={index * 100} className="h-full">
      <div className={`group h-full relative bg-dark-850/50 backdrop-blur-sm rounded-3xl overflow-hidden border transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] ${isRecommended ? 'border-gold-500/50 shadow-[0_0_30px_-10px_rgba(212,175,55,0.2)]' : 'border-white/5 hover:border-gold-500/30'}`}>
        
        {/* Image Container */}
        <div className="h-64 overflow-hidden relative bg-dark-800">
          {!imgError ? (
            <img 
              src={item.image} 
              alt={item.name} 
              onError={() => setImgError(true)}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 bg-dark-900">
              <ImageOff className="w-8 h-8 mb-2 opacity-50" />
              <span className="text-xs uppercase tracking-widest">Image Unavailable</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent opacity-80"></div>
          
          {/* Top Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            {item.isChefSpecial && (
              <span className="bg-gold-500 text-dark-950 text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                <Star className="w-3 h-3 fill-current" /> Special
              </span>
            )}
            {isRecommended && (
               <span className="bg-white text-dark-950 text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-pulse">
               <SparklesIcon className="w-3 h-3" /> Picked For You
             </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="relative -mt-16 p-6">
           <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark-850/90 rounded-t-3xl"></div>
           
           <div className="relative z-10">
              <div className="flex justify-between items-end mb-3">
                <div className="flex flex-col gap-1 items-start">
                  {/* Pricing Display Logic */}
                  {!isBottleOnly && (
                    <div className="bg-dark-950/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-gold-500/20 text-gold-400 font-serif font-bold text-lg shadow-xl">
                      {isWine ? 'Glass' : ''} {item.currency}{item.price}
                    </div>
                  )}
                  
                  {hasBottlePrice && (
                     <div className={`px-2 text-xs font-medium text-gray-400 ${isBottleOnly ? 'bg-dark-950/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-gold-500/20 text-gold-400 font-serif font-bold text-lg shadow-xl' : ''}`}>
                       Bottle {item.currency}{item.bottlePrice}
                     </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs font-medium text-gold-500/90 mb-1">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{item.rating}</span>
                  <span className="text-gray-600">({item.reviewsCount})</span>
                </div>
              </div>

              <h3 className="text-2xl font-serif font-medium text-white group-hover:text-gold-400 transition-colors duration-300 leading-tight mb-3">
                {item.name}
              </h3>

              <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-6 font-light">
                {item.description}
              </p>

              {/* Footer Meta & Action */}
              <div className="flex items-center justify-between pt-5 border-t border-white/5">
                <div className="flex gap-4 text-gray-500 text-xs tracking-wide uppercase">
                  {item.category === 'Wine' && (
                     <span className="flex items-center gap-1.5 transition-colors" title="Wine">
                      <Wine className="w-3.5 h-3.5" /> Vintage
                    </span>
                  )}
                  {item.isVegetarian && (
                    <span className="flex items-center gap-1.5 hover:text-green-400 transition-colors" title="Vegetarian">
                      <Leaf className="w-3.5 h-3.5" /> Veg
                    </span>
                  )}
                  {(item.spicinessLevel || 0) > 0 && (
                    <span className="flex items-center gap-1.5 hover:text-red-400 transition-colors" title="Spicy">
                      <Flame className="w-3.5 h-3.5" /> {['', 'Mild', 'Medium', 'Hot'][item.spicinessLevel || 1]}
                    </span>
                  )}
                </div>
                
                <button className="group/btn flex items-center gap-2 text-gold-500 text-sm font-semibold hover:text-white transition-colors">
                  Order
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </div>
           </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L12 3Z"/>
  </svg>
)