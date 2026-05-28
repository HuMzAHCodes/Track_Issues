import React from 'react';
import Link from 'next/link';
import { FaPlus, FaGithub } from 'react-icons/fa6';

const HeroSection = () => {
  return (
    <div className="glass-card p-8 flex flex-col justify-between h-[510px] shadow-2xl relative overflow-hidden group border border-cherry/10">
      
      {/* 🔮 Subtle Glowing Radial Circles for Ambient Background Lights */}
      <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-cherry/5 dark:bg-cherry/10 blur-3xl group-hover:bg-cherry/10 dark:group-hover:bg-cherry/15 transition-all duration-700"></div>
      <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-cherry/5 dark:bg-cherry/5 blur-3xl group-hover:bg-cherry/10 transition-all duration-700"></div>

      <div className="relative z-10 flex flex-col h-full justify-between">
        
        {/* 📝 Heading & Subheading Section */}
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-none bg-gradient-to-r from-stone-900 via-cherry to-stone-900 dark:from-stone-50 dark:via-cherry dark:to-stone-50 bg-clip-text text-transparent">
            Clean Code.<br />Bulletproof Apps.
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm md:text-base leading-relaxed mt-4 max-w-[340px]">
            A developer-first bug tracker designed to keep your production pipeline clean, stable, and your users happy.
          </p>
        </div>

        {/* 💻 Sleek Mock Terminal / Code Box in the Center */}
        <div className="w-full glass-card p-4 rounded-xl border border-cherry/10 scale-95 group-hover:scale-100 transition-all duration-500 shadow-md bg-white/20 dark:bg-black/30">
          <div className="flex space-x-1.5 mb-3 border-b border-stone-200/40 dark:border-stone-800/40 pb-2 flex-row">
            <div className="w-2.5 h-2.5 rounded-full bg-cherry/40"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40"></div>
          </div>
          <pre className="text-[11px] md:text-xs text-stone-500 dark:text-stone-400 font-mono select-none">
            <code>
              <span className="text-cherry dark:text-rose-400">const</span> app = <span className="text-amber-700 dark:text-amber-400">squashBugs</span>();<br />
              <span className="text-stone-400 dark:text-stone-500">// Status: 100% stable</span><br />
              console.<span className="text-cherry dark:text-rose-400">log</span>(app.status);
            </code>
          </pre>
        </div>

        {/* 🎯 Interactive Call To Action Buttons */}
        <div className="flex flex-row space-x-3 w-full mt-4">
          <Link 
            href="/Issues/new" 
            className="flex-grow bg-cherry text-white hover:bg-cherry-glow transition-all duration-300 px-5 py-3 rounded-full font-bold text-xs shadow-lg shadow-cherry/25 hover:scale-105 hover:-translate-y-0.5 flex items-center justify-center space-x-2 border border-cherry/20 text-center select-none"
          >
            <FaPlus className="text-xs" />
            <span>Create Ticket</span>
          </Link>
          <a 
            href="https://github.com/HuMzAHCodes/Track_Issues" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-grow border border-stone-300 dark:border-stone-700 hover:border-cherry hover:text-cherry dark:hover:border-cherry dark:hover:text-cherry transition-all duration-300 px-5 py-3 rounded-full font-bold text-xs bg-transparent flex items-center justify-center space-x-2 text-stone-700 dark:text-stone-300 hover:scale-105 hover:-translate-y-0.5 text-center select-none"
          >
            <FaGithub className="text-sm" />
            <span>Github Repo</span>
          </a>
        </div>

      </div>
    </div>
  );
};

export default HeroSection;
