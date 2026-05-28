import React from 'react';
import Link from 'next/link';
import { FaPlus, FaListCheck, FaChevronRight } from 'react-icons/fa6';

const HeroSection = () => {
  return (
    <div className="glass-card p-8 flex flex-col justify-between h-[510px] shadow-2xl relative overflow-hidden group border border-cherry/10">
      
      {/* 🔮 Subtle Glowing Radial Circles for Ambient Background Lights */}
      <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-cherry/5 dark:bg-cherry/10 blur-3xl group-hover:bg-cherry/10 dark:group-hover:bg-cherry/15 transition-all duration-700"></div>
      <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-cherry/5 dark:bg-cherry/5 blur-3xl group-hover:bg-cherry/10 transition-all duration-700"></div>

      <div className="relative z-10 flex flex-col h-full justify-between">
        
        {/* 📝 Heading & Subheading Section */}
        <div>
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-cherry/10 text-cherry mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-cherry animate-pulse" />
            <span>Developer Pipeline Active</span>
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-none bg-gradient-to-r from-stone-900 via-cherry to-stone-900 dark:from-stone-50 dark:via-cherry dark:to-stone-50 bg-clip-text text-transparent">
            Track with Precision.<br />Resolve with Speed.
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm md:text-base leading-relaxed mt-4 max-w-[360px]">
            Welcome to your bug-tracking command center. Log, assign, and squash issues using our streamlined developer pipeline.
          </p>
        </div>

        {/* 💻 Center Mock Console Graphic */}
        <div className="w-full glass-card p-5 rounded-2xl border border-cherry/10 scale-95 group-hover:scale-100 transition-all duration-500 shadow-md bg-white/20 dark:bg-black/30 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-cherry/10 text-cherry">
              <FaListCheck className="text-xl animate-float" />
            </div>
            <div>
              <p className="text-xs text-stone-400 dark:text-stone-500">Pipeline Status</p>
              <p className="text-sm font-bold text-stone-800 dark:text-stone-200">100% Operational</p>
            </div>
          </div>
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></div>
        </div>

        {/* 🎯 Interactive Call To Action Buttons */}
        <div className="flex flex-col space-y-3 w-full mt-4">
          <Link 
            href="/Issues/new" 
            className="group/btn w-full bg-cherry text-white hover:bg-cherry-glow transition-all duration-300 px-6 py-3.5 rounded-full font-bold text-xs shadow-lg shadow-cherry/20 hover:scale-[1.02] hover:-translate-y-0.5 flex items-center justify-center space-x-2 border border-cherry/20 select-none"
          >
            <FaPlus className="text-xs" />
            <span>Report New Issue</span>
            <FaChevronRight className="text-[10px] transform group-hover/btn:translate-x-1 transition-transform duration-300" />
          </Link>
          
          <Link
            href="/Issues"
            className="w-full border border-stone-300 dark:border-stone-700 hover:border-cherry hover:text-cherry dark:hover:border-cherry dark:hover:text-cherry transition-all duration-300 px-6 py-3.5 rounded-full font-bold text-xs bg-transparent flex items-center justify-center space-x-2 text-stone-700 dark:text-stone-300 hover:scale-[1.02] hover:-translate-y-0.5 select-none"
          >
            <FaListCheck className="text-xs" />
            <span>Manage Active Issues</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default HeroSection;
