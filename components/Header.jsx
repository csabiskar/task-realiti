"use client";

import { CheckSquare, Plus } from "lucide-react";

export function Header({ onOpenCreateModal }) {
  return (
    <header className="w-full border-b border-slate-200 bg-white sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        
        {/* Brand & Breadcrumb */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <CheckSquare className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold text-slate-900 tracking-tight">
              TaskFlow
            </h1>
            <span className="text-slate-300 font-light">/</span>
            <span className="text-xs font-medium text-slate-500">
              Project Board
            </span>
          </div>
        </div>

        {/* Human Action Button */}
        <button
          onClick={onOpenCreateModal}
          className="px-3.5 py-2 text-xs font-medium rounded-lg bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>

      </div>
    </header>
  );
}
