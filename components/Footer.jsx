"use client";

import { SquareCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800">TaskFlow</span>
          <span>•</span>
          <span>Lightweight Task Board</span>
        </div>

        <div>
          <span>Built with Next.js & Tailwind CSS</span>
        </div>

      </div>
    </footer>
  );
}
