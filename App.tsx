import React, { useState, useMemo, useEffect } from 'react';
import { 
  Menu, X, MapPin, Phone, Clock, Instagram, 
  ChevronDown, Search, ArrowRight, Activity, Wallet, Info, PawPrint, Accessibility, Users, Zap, ExternalLink, Loader2
} from 'lucide-react';
import { MENU_ITEMS, REVIEWS, RESTAURANT_INFO } from './constants';
import { MenuItem, Category } from './types';
import { DishCard } from './components/DishCard';
import { AIChef } from './components/AIChef';
import { ScrollReveal } from './components/ScrollReveal';
import { WelcomeScreen } from './components/WelcomeScreen';
import { getLiveStatus } from './services/geminiService';

const App = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [recommendedIds, setRecommendedIds] = useState<string[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [heroOffset, setHeroOffset] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Live Status State
  const [liveStatus, setLiveStatus] = useState<{loading: boolean, text: string, source: string | null}>({
    loading: false, text: "", source: null
  });

  // Real-time clock effect
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setHeroOffset(window.scrollY * 0.5); 
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch Live Data handler
  const handleFetchLiveStatus = async () => {
    setLiveStatus({ loading: true, text: "", source: null });
    const result = await getLiveStatus();
    // Ensure source is never undefined by defaulting to null
    setLiveStatus({ loading: false, text: result.text, source: result.source ?? null });
  };

  // Filter logic
  const filteredItems = useMemo(() => {
    let items = MENU_ITEMS;
    
    if (activeCategory !== 'All') {
      items = items.filter(item => item.category === activeCategory);
    }
    
    if (searchQuery) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (recommendedIds.length > 0) {
      return [...items].sort((a, b) => {
        const aRec = recommendedIds.includes(a.id);
        const bRec = recommendedIds.includes(b.id);
        if (aRec && !bRec) return -1;
        if (!aRec && bRec) return 1;
        return 0;
      });
    }

    return items;
  }, [activeCategory, searchQuery, recommendedIds]);

  const categories: Category[] = ['All', 'Seafood', 'Chowder', 'Salads', 'Wine', 'Beer'];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-gray-200 font-sans selection:bg-gold-500/30">
      
      {/* Intro Overlay */}
      {showWelcome && <WelcomeScreen onComplete={() => setShowWelcome(false)} />}

      {/* Premium Navbar */}
      <nav className={`fixed w-full z-40 transition-all duration-500 border-b ${scrolled ? 'bg-dark-950/80 backdrop-blur-xl border-white/10 py-4' : 'bg-transparent border-transparent py-8'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => scrollToSection('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-dark-950 font-bold font-serif text-xl shadow-[0_0_15px_rgba(197,160,40,0.4)] group-hover:shadow-[0_0_25px_rgba(197,160,40,0.6)] transition-all duration-300">S</div>
            <span className="text-2xl font-serif font-bold tracking-tight text-white group-hover:text-gold-400 transition-colors">Swan Oyster Depot</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
            {['Home', 'Menu', 'Reviews', 'Info'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())} 
                className="text-sm font-medium tracking-wide uppercase hover:text-gold-400 transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-px after:bg-gold-500 after:transition-all hover:after:w-full"
              >
                {item}
              </button>
            ))}
            
            <div className="h-6 w-px bg-white/20"></div>

            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border ${RESTAURANT_INFO.isOpenNow ? 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.1)]' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${RESTAURANT_INFO.isOpenNow ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              {RESTAURANT_INFO.isOpenNow ? 'Live: Open' : 'Live: Closed'}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white p-2 hover:bg-white/5 rounded-full transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-30 bg-dark-950/98 backdrop-blur-xl transition-transform duration-500 pt-32 px-6 md:hidden ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex flex-col gap-8 text-2xl font-serif text-center">
          {['Home', 'Menu', 'Reviews', 'Info'].map((item) => (
            <button key={item} onClick={() => scrollToSection(item.toLowerCase())} className="hover:text-gold-400 transition-colors">{item}</button>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Parallax Background */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center transition-transform duration-100 ease-out"
            style={{ transform: `translateY(${heroOffset * 0.5}px) scale(1.1)` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-dark-950/80 via-dark-950/60 to-dark-950"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)] opacity-80"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-10" style={{ transform: `translateY(${-heroOffset * 0.2}px)` }}>
          <ScrollReveal delay={0}>
            <div className="inline-flex items-center gap-3 border border-gold-500/30 rounded-full px-5 py-2 backdrop-blur-md bg-white/5">
              <span className="w-8 h-[1px] bg-gold-500"></span>
              <span className="text-gold-400 text-xs font-bold tracking-[0.25em] uppercase">Est. 1912 • Polk Gulch</span>
              <span className="w-8 h-[1px] bg-gold-500"></span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-medium text-white leading-tight tracking-tight">
              San Francisco's <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-500 to-gold-700 italic pr-2">Freshest Catch</span>
            </h1>
          </ScrollReveal>
          
          <ScrollReveal delay={400}>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
              {RESTAURANT_INFO.description}
            </p>
          </ScrollReveal>

          {/* Cash Only Warning Badge for Hero */}
          <ScrollReveal delay={500}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/40 rounded-lg text-red-200 text-sm font-bold uppercase tracking-wider backdrop-blur-sm">
              <Wallet className="w-4 h-4" /> Cash Only
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={600} className="flex flex-col md:flex-row gap-6 justify-center pt-8">
            <button 
              onClick={() => scrollToSection('menu')}
              className="group relative bg-gold-500 text-dark-950 px-10 py-4 rounded-full font-bold overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(197,160,40,0.4)]"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative flex items-center gap-2">View Fresh Menu <ArrowRight className="w-4 h-4" /></span>
            </button>
            <button 
              onClick={() => scrollToSection('info')}
              className="px-10 py-4 rounded-full font-bold border border-white/20 hover:bg-white hover:text-dark-950 transition-all hover:scale-105"
            >
              Plan Your Visit
            </button>
          </ScrollReveal>
        </div>
        
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-float opacity-50">
          <ChevronDown className="w-6 h-6 text-white" />
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-32 px-6 relative z-10">
        <div className="container mx-auto">
          <ScrollReveal>
            <div className="text-center mb-20 space-y-6">
              <h2 className="text-4xl md:text-6xl font-serif font-medium text-white">The Daily Catch</h2>
              <div className="w-px h-16 bg-gradient-to-b from-gold-500 to-transparent mx-auto"></div>
              <p className="text-gray-400 max-w-xl mx-auto font-light text-lg">
                Fresh from the Pacific. Served straight up. No nonsense.
              </p>
            </div>
          </ScrollReveal>

          {/* Filters & Search - Glassmorphism */}
          <div className="sticky top-24 z-30 mb-16">
            <div className="bg-dark-850/70 backdrop-blur-xl border border-white/5 rounded-2xl p-2 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-4 max-w-5xl mx-auto">
              
              {/* Category Pills */}
              <div className="flex gap-1 overflow-x-auto w-full md:w-auto p-1 no-scrollbar">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap duration-300 ${
                      activeCategory === cat 
                        ? 'bg-gold-500 text-dark-950 shadow-lg' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-80 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-gold-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Find your craving..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-dark-900/50 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-gold-500/50 focus:bg-dark-900 transition-all text-white placeholder-gray-600"
                />
              </div>
            </div>
          </div>

          {/* Grid with specific key to reset animations on filter change */}
          <div key={activeCategory} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <DishCard 
                  key={item.id} 
                  item={item} 
                  index={index}
                  isRecommended={recommendedIds.includes(item.id)}
                />
              ))
            ) : (
              <div className="col-span-full py-32 text-center opacity-50">
                <p className="text-2xl font-serif text-gray-500">No dishes found matching your criteria.</p>
                <button 
                  onClick={() => {setSearchQuery(''); setActiveCategory('All');}}
                  className="mt-6 text-gold-500 hover:underline underline-offset-4"
                >
                  View Full Menu
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-32 bg-dark-900 relative border-t border-white/5">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent"></div>
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl font-serif font-medium text-center text-white mb-20">
              Locals Love Us
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {REVIEWS.map((review, i) => (
              <ScrollReveal key={review.id} delay={i * 150} className="h-full">
                <div className="bg-dark-850 p-10 rounded-3xl border border-white/5 relative hover:border-gold-500/20 transition-colors h-full flex flex-col">
                  <div className="absolute top-8 right-8 text-6xl text-gold-500/10 font-serif leading-none">”</div>
                  
                  <div className="flex items-center gap-4 mb-8">
                    <img src={review.avatar} alt={review.author} className="w-14 h-14 rounded-full object-cover border-2 border-dark-800 ring-2 ring-gold-500/20" />
                    <div>
                      <h4 className="font-bold text-white font-serif text-lg">{review.author}</h4>
                      <div className="flex gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-xs ${i < review.rating ? 'text-gold-500' : 'text-gray-700'}`}>★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-400 italic leading-relaxed relative z-10 flex-grow">
                    {review.text}
                  </p>
                  <p className="text-xs text-gray-600 font-bold tracking-widest uppercase mt-6">{review.date}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Info & Footer */}
      <section id="info" className="bg-dark-950 pt-32 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(212,175,55,0.05),transparent_40%)]"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          
          {/* VISIBLE LIVE DASHBOARD FEATURE */}
          <div className="mb-24 p-8 rounded-3xl bg-dark-900 border border-gold-500/20 shadow-[0_0_50px_rgba(0,0,0,0.3)] relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div>
                 <div className="flex items-center gap-2 text-gold-500 mb-2">
                   <Activity className="w-5 h-5 animate-pulse" />
                   <span className="text-sm font-bold tracking-widest uppercase">Live Status Dashboard</span>
                 </div>
                 <h3 className="text-2xl font-serif text-white">Real-Time Traffic Check</h3>
                 <p className="text-gray-400 text-sm mt-2">Powered by Gemini AI & Google Maps</p>
              </div>

              {/* Dynamic Display Area */}
              <div className="flex flex-col justify-center border-l border-white/5 pl-8 border-r lg:border-r-0 min-h-[100px]">
                 {liveStatus.loading ? (
                    <div className="flex items-center gap-3 text-gold-400 animate-pulse">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span className="font-mono">Connecting to satellite...</span>
                    </div>
                 ) : liveStatus.text ? (
                    <div className="animate-reveal">
                      <p className="text-white text-lg leading-snug mb-2 font-medium">"{liveStatus.text}"</p>
                      {liveStatus.source && (
                        <a href={liveStatus.source} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-gold-500 text-xs hover:underline">
                          View on Maps <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                 ) : (
                    <div className="flex flex-col gap-1">
                       <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">San Francisco Time</p>
                       <p className="text-xl font-mono text-white">
                         {currentTime.toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles', hour: '2-digit', minute: '2-digit' })}
                       </p>
                    </div>
                 )}
              </div>

              <div className="text-right">
                <button 
                  onClick={handleFetchLiveStatus}
                  disabled={liveStatus.loading}
                  className="inline-flex items-center gap-2 bg-gold-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-gold-500 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-gold-500/20 active:scale-95"
                >
                  <Zap className={`w-4 h-4 ${liveStatus.loading ? 'hidden' : 'block'}`} />
                  {liveStatus.loading ? 'Scanning...' : 'Scan Live Location'}
                </button>
              </div>
            </div>
          </div>

          {/* New Location Feature Row with Photo */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-24">
             {/* Left: Details */}
             <div className="space-y-12">
                {/* Brand & Description */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gold-500 flex items-center justify-center text-dark-950 font-bold font-serif text-xl">S</div>
                    <span className="text-3xl font-serif font-bold text-white">Swan</span>
                  </div>
                  <p className="text-gray-400 text-sm leading-loose max-w-md">
                    {RESTAURANT_INFO.description}
                  </p>
                  <div className="flex gap-4">
                    <SocialLink href="https://www.instagram.com/swan.oyster.official/p/CG0Jk0Khsu1/?hl=en" icon={<Instagram size={18} />} />
                  </div>
                </div>

                {/* Contact & Hours Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div>
                      <h4 className="text-white font-bold font-serif mb-4 flex items-center gap-2"><MapPin className="w-4 h-4 text-gold-500" /> Location</h4>
                      <p className="text-gray-400 text-sm mb-1">{RESTAURANT_INFO.address}</p>
                      <p className="text-gold-500 text-xs font-bold">Landmark: {RESTAURANT_INFO.landmark}</p>
                   </div>
                   <div>
                      <h4 className="text-white font-bold font-serif mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-gold-500" /> Hours</h4>
                      <p className="text-gray-400 text-sm mb-1">Mon - Sat: 08:00 AM - 02:30 PM</p>
                      <p className="text-red-400 text-xs font-bold">Sunday: Closed</p>
                   </div>
                   <div>
                      <h4 className="text-white font-bold font-serif mb-4 flex items-center gap-2"><Phone className="w-4 h-4 text-gold-500" /> Contact</h4>
                      <p className="text-gray-400 text-sm">{RESTAURANT_INFO.phone}</p>
                   </div>
                   <div>
                      <h4 className="text-white font-bold font-serif mb-4 flex items-center gap-2"><Wallet className="w-4 h-4 text-gold-500" /> Payment</h4>
                      <p className="text-red-400 font-bold text-sm">CASH ONLY</p>
                   </div>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-3">
                   {RESTAURANT_INFO.amenities.map(am => (
                      <span key={am} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400 flex items-center gap-2">
                         {am === 'Dogs Allowed' && <PawPrint className="w-3 h-3" />}
                         {am === 'Wheelchair Accessible' && <Accessibility className="w-3 h-3" />}
                         {am}
                      </span>
                   ))}
                </div>
             </div>

             {/* Right: The Real Photo Display */}
             <div className="relative group rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-dark-900">
                <div className="absolute top-4 left-4 z-10 bg-gold-500 text-dark-950 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                   Look for the Blue Awning
                </div>
                <img 
                  src={RESTAURANT_INFO.storefrontImage} 
                  alt="Swan Oyster Depot Storefront" 
                  className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent opacity-90"></div>
                <div className="absolute bottom-0 left-0 p-8">
                   <div className="flex items-center gap-2 text-gold-400 mb-2 font-bold text-xs uppercase tracking-widest">
                      <Users className="w-4 h-4" /> Expect a Line
                   </div>
                   <p className="text-white/80 text-sm italic">
                      "Usually a wait, but worth every second. Join the queue early for the freshest catch in the city."
                   </p>
                </div>
             </div>
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-600 text-xs tracking-wider uppercase">
            <p>&copy; {new Date().getFullYear()} Swan Oyster Depot. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-gold-500 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gold-500 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </section>

      {/* AI Concierge Component */}
      <AIChef 
        fullMenu={MENU_ITEMS} 
        onRecommend={(ids) => {
          setRecommendedIds(ids);
          scrollToSection('menu');
        }} 
      />

    </div>
  );
};

const SocialLink = ({ icon, href }: { icon: React.ReactNode, href: string }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold-500 hover:text-dark-950 transition-all duration-300 hover:-translate-y-1">
    {icon}
  </a>
);

export default App;