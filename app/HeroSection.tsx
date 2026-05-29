"use client";

import React from 'react';
import Link from 'next/link';
import { FaArrowRightLong } from 'react-icons/fa6';

interface Props {
  open: number;
  inProgress: number;
  closed: number;
}

const HeroSection = ({ open, inProgress, closed }: Props) => {
  const total = open + inProgress + closed;
  const resolvedPercent = total > 0 ? Math.round((closed / total) * 100) : 0;

  // Format total count (e.g., 1200 -> 1.2K)
  const formatCount = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div
      className="animate-entrance bg-cherry rounded-[24px] p-8 flex flex-col md:flex-row items-center justify-between h-[510px] shadow-2xl relative overflow-hidden group border border-cherry/20 text-white"
      style={{ ['--entrance-duration' as string]: '1200ms' }}
    >
      
      {/* 🔮 Background Glow mesh */}
      <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-white/5 blur-3xl transition-all duration-700"></div>

      {/* 📝 Left Content Column */}
      <div className="flex flex-col justify-between h-full z-10 w-full md:w-1/2 text-left">
        <div>
          <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter leading-none">
            TRACK.
          </h1>
          <p className="text-stone-300 font-extrabold uppercase tracking-widest text-[11px] mt-1.5">
            FIX. SHIP.
          </p>
          <p className="text-white/80 text-sm leading-relaxed mt-6 max-w-[280px] font-medium">
            One board for every bug, sprint, and deadline.
          </p>
        </div>

        <div>
          <Link 
            href="/Issues/new" 
            className="inline-flex items-center space-x-2 border border-white/20 hover:border-white/80 hover:bg-white/10 text-white font-bold text-[11px] tracking-wider uppercase py-3 px-6 rounded-full transition-all duration-300 select-none hover:scale-105 active:scale-95"
          >
            <span>Start Free</span>
            <FaArrowRightLong className="text-xs" />
          </Link>
        </div>
      </div>

      {/* 🎯 Right Visual Circle Geometry */}
      <div className="relative flex items-center justify-center w-full md:w-1/2 h-full min-h-[260px] md:min-h-0 z-10">
        
        {/* Rotating Dashed Outer Ring */}
        <div 
          className="absolute w-[250px] h-[250px] rounded-full border border-dashed border-white/25"
          style={{
            animation: 'spin 40s linear infinite'
          }}
        />

        {/* Outer Solid Cream Geometry Circle */}
        <div className="w-[220px] h-[220px] rounded-full bg-cream flex items-center justify-center shadow-2xl transform group-hover:scale-105 transition-transform duration-500">
          
          {/* Inner Dark Red Circle */}
          <div className="w-[170px] h-[170px] rounded-full bg-cherry flex flex-col items-center justify-center text-center p-4">
            
            {/* Resolved Percentage */}
            <span className="text-4xl font-black tracking-tight text-white">
              {resolvedPercent}%
            </span>
            <span className="text-[9px] font-bold text-stone-300 uppercase tracking-widest mt-1">
              Resolved
            </span>
            
            {/* Elegant Divider Line */}
            <div className="w-12 h-[1px] bg-white/20 my-2.5" />
            
            {/* Total Issues count */}
            <span className="text-3xl font-black tracking-tight text-white">
              {formatCount(total)}
            </span>
            <span className="text-[9px] font-bold text-stone-300 uppercase tracking-widest mt-1">
              Issues
            </span>

          </div>
        </div>
      </div>

      {/* Tailwind inline animation style if not defined globally */}
      <style jsx global>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

    </div>
  );
};

export default HeroSection;
