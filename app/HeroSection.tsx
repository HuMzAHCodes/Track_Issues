"use client";

import React, { useState, useEffect } from 'react';
import { FaTerminal, FaBug, FaArrowsRotate, FaCircleCheck } from 'react-icons/fa6';

const HeroSection = () => {
  const [scanning, setScanning] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    "System initialized.",
    "Database connection secure.",
    "NextAuth JWT provider online."
  ]);
  const [scanProgress, setScanProgress] = useState(100);

  // Status cells represent app modules (Green = Healthy, Amber = Alert, Red = Bug!)
  const [modules, setModules] = useState([
    { name: "Auth Service", status: "healthy" },
    { name: "Prisma DB Engine", status: "healthy" },
    { name: "Next.js Core", status: "healthy" },
    { name: "API endpoints", status: "bug" },
    { name: "Middleware checks", status: "healthy" },
    { name: "Google OAuth", status: "healthy" },
    { name: "SMTP Mailer", status: "healthy" },
    { name: "Recharts Renderer", status: "healthy" },
    { name: "CSS Theme Engine", status: "healthy" },
  ]);

  const triggerScan = () => {
    if (scanning) return;
    setScanning(true);
    setScanProgress(0);
    setLogs(prev => [...prev, "Checking systems..."]);
  };

  useEffect(() => {
    if (!scanning) return;

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanning(false);
          setLogs(prevLogs => [
            ...prevLogs,
            "Scan complete: 1 issue detected in [API endpoints]."
          ]);
          return 100;
        }
        return prev + 20;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [scanning]);

  // Keep logs showing only the latest 4 lines
  const visibleLogs = logs.slice(-4);

  return (
    <div className="glass-card p-6 flex flex-col justify-between h-[510px] shadow-2xl relative overflow-hidden group border border-cherry/10">
      
      {/* Glow Effects */}
      <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-cherry/5 blur-3xl group-hover:bg-cherry/10 transition-all duration-700"></div>
      
      {/* 🧭 Visual Scanner Header */}
      <div className="flex items-center justify-between border-b border-cherry/10 pb-4">
        <div className="flex items-center space-x-2.5">
          <FaBug className="text-cherry text-lg animate-bounce" />
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            System Bug Scanner
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`h-2.5 w-2.5 rounded-full ${scanning ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
          <span className="text-[11px] font-semibold text-stone-600 dark:text-stone-300">
            {scanning ? 'SCANNING...' : 'SYSTEM SECURE'}
          </span>
        </div>
      </div>

      {/* 📊 Visual Matrix Grid (Visual representation of bugs) */}
      <div className="my-4">
        <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-2">Module Map Status</p>
        <div className="grid grid-cols-3 gap-2.5">
          {modules.map((mod, idx) => {
            let color = "bg-emerald-500/20 border-emerald-500/30 text-emerald-600 dark:text-emerald-400";
            if (mod.status === "bug") {
              color = "bg-cherry/20 border-cherry/30 text-cherry animate-pulse";
            }
            return (
              <div 
                key={idx} 
                className={`p-3 border rounded-xl flex flex-col items-center justify-center text-center transition-all duration-300 relative overflow-hidden ${color}`}
              >
                {/* Visual scan sweep bar */}
                {scanning && (
                  <div 
                    className="absolute inset-x-0 h-0.5 bg-cherry/30 shadow-md animate-infinite" 
                    style={{
                      animation: 'float 1.5s infinite ease-in-out',
                      top: `${scanProgress}%`
                    }}
                  />
                )}
                <span className="text-[11px] font-bold tracking-tight truncate max-w-[80px]">{mod.name}</span>
                <span className="text-[9px] opacity-80 mt-1 uppercase font-semibold">
                  {mod.status === "bug" ? "FAILING" : "OK"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 📟 Dynamic Diagnostic logs console */}
      <div className="glass-card bg-black/80 dark:bg-black/90 p-4 rounded-xl border border-stone-800 font-mono text-[10px] text-stone-400 flex flex-col space-y-1.5 h-32 overflow-hidden select-none">
        <div className="flex items-center space-x-1.5 text-stone-500 border-b border-stone-900 pb-1.5 mb-1.5">
          <FaTerminal className="text-xs" />
          <span>diagnostic_log.sh</span>
        </div>
        {visibleLogs.map((log, i) => (
          <div key={i} className="flex items-start space-x-1">
            <span className="text-cherry select-none">&gt;</span>
            <span className="truncate">{log}</span>
          </div>
        ))}
      </div>

      {/* 🎮 Scanner controls */}
      <div className="flex space-x-3 mt-4">
        <button 
          onClick={triggerScan}
          disabled={scanning}
          className={`flex-grow transition-all duration-300 px-5 py-3 rounded-full font-bold text-xs flex items-center justify-center space-x-2 border select-none ${
            scanning 
              ? 'bg-stone-500/10 text-stone-500 border-stone-500/20 cursor-not-allowed' 
              : 'bg-cherry text-white hover:bg-cherry-glow border-cherry/20 hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          <FaArrowsRotate className={`text-xs ${scanning ? 'animate-spin' : ''}`} />
          <span>{scanning ? `Scanning... ${scanProgress}%` : 'Run Diagnostics'}</span>
        </button>
        
        <div className="px-5 py-3 rounded-full bg-white/10 dark:bg-stone-900/40 border border-stone-300 dark:border-stone-800 flex items-center justify-center space-x-1.5 text-stone-700 dark:text-stone-300 text-xs font-bold">
          <FaCircleCheck className="text-emerald-500" />
          <span>Ready</span>
        </div>
      </div>

    </div>
  );
};

export default HeroSection;
