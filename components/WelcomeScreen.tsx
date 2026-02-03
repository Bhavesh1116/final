import React, { useState, useEffect } from 'react';
import { Volume2, Utensils, Anchor } from 'lucide-react';

interface WelcomeScreenProps {
  onComplete: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  // Load voices for TTS (Text-to-Speech)
  useEffect(() => {
    const loadVoices = () => setVoicesLoaded(true);
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  const handleEnter = () => {
    // --- AUDIO LOGIC ---
    // Option 2: AI Voice (Demo Fallback)
    const utterance = new SpeechSynthesisUtterance("Welcome to Swan Oyster Depot. San Francisco's historic seafood landmark. Please note, we are a cash-only establishment.");
    utterance.rate = 0.9; 
    utterance.pitch = 1.0;
    utterance.volume = 0.9;

    // Try to pick a premium sounding English voice
    const voices = window.speechSynthesis.getVoices();
    const premiumVoice = voices.find(v => v.name.includes("Google US English")) || 
                         voices.find(v => v.name.includes("Samantha")) ||
                         voices[0];
    
    if (premiumVoice) utterance.voice = premiumVoice;
    window.speechSynthesis.speak(utterance);
    // -------------------

    // Animation Logic
    setFadeOut(true);
    
    // Unmount after animation finishes
    setTimeout(() => {
      onComplete();
    }, 800);
  };

  return (
    <div className={`fixed inset-0 z-[60] bg-dark-950 flex flex-col items-center justify-center transition-opacity duration-1000 ease-in-out ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
       
       {/* Background Effects */}
       <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1920&q=80')] opacity-20 bg-cover bg-center"></div>
       <div className="absolute inset-0 bg-radial-gradient from-transparent to-dark-950"></div>

       <div className="relative z-10 text-center space-y-10 p-6 animate-reveal">
         
         {/* Pulsing Logo */}
         <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 bg-gold-500 rounded-2xl rotate-45 opacity-20 animate-pulse"></div>
            <div className="absolute inset-0 bg-gold-500 rounded-2xl rotate-45 blur-xl opacity-40 animate-pulse delay-75"></div>
            <div className="relative w-full h-full bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl flex items-center justify-center shadow-2xl rotate-45 border border-white/20">
                <Anchor className="text-dark-950 w-10 h-10 -rotate-45" />
            </div>
         </div>

         <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-serif text-white tracking-widest uppercase">Swan Oyster Depot</h1>
            <p className="text-gold-400 text-sm tracking-[0.3em] font-light uppercase">Est. 1912 • San Francisco</p>
         </div>
         
         <div className="pt-8">
            <button 
              onClick={handleEnter}
              className="group relative px-10 py-4 overflow-hidden rounded-full bg-transparent border border-gold-500/30 text-white font-bold tracking-widest uppercase transition-all duration-300 hover:border-gold-500 hover:shadow-[0_0_30px_rgba(197,160,40,0.3)]"
            >
              <span className="absolute inset-0 bg-gold-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
              <span className="relative flex items-center gap-3 group-hover:text-dark-950 transition-colors">
                Enter Experience <Utensils className="w-4 h-4" />
              </span>
            </button>
            
            <p className="mt-6 text-gray-500 text-xs flex items-center justify-center gap-2 opacity-60">
              <Volume2 className="w-3 h-3" /> Audio Enabled
            </p>
         </div>
       </div>
    </div>
  );
};