"use client";

import { Search, X, RotateCcw, Trash2 } from "lucide-react";

export function BoardSummary({
  totalCount,
  todoCount,
  inProgressCount,
  doneCount,
  searchQuery,
  setSearchQuery,
  onResetDemo,
  onClearAll,
}) {
  return (
    <div className="w-full mb-6 space-y-4">
      
      {/* Dynamic Board Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="panel-card p-3.5 rounded-2xl flex items-center justify-between bg-white border border-slate-200">
          <span className="text-xs font-semibold text-slate-500">All Tasks</span>
          <span className="text-sm font-bold text-slate-900 px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200">
            {totalCount}
          </span>
        </div>

        <div className="panel-card p-3.5 rounded-2xl flex items-center justify-between bg-white border border-slate-200">
          <span className="text-xs font-semibold text-slate-500">To Do</span>
          <span className="text-sm font-bold text-slate-900 px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200">
            {todoCount}
          </span>
        </div>

        <div className="panel-card p-3.5 rounded-2xl flex items-center justify-between bg-white border border-slate-200">
          <span className="text-xs font-semibold text-slate-500">In Progress</span>
          <span className="text-sm font-bold text-slate-900 px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200">
            {inProgressCount}
          </span>
        </div>

        <div className="panel-card p-3.5 rounded-2xl flex items-center justify-between bg-white border border-slate-200">
          <span className="text-xs font-semibold text-slate-500">Done</span>
          <span className="text-sm font-bold text-slate-900 px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200">
            {doneCount}
          </span>
        </div>
      </div>

      {/* Search Bar & Action Controls */}
      <div className="panel-card p-3 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white border border-slate-200">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-10 pr-9 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Demo & Clear Buttons */}
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={onResetDemo}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-1.5 transition-all cursor-pointer"
            title="Reset sample tasks"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
            <span>Sample Tasks</span>
          </button>

          {totalCount > 0 && (
            <button
              onClick={onClearAll}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-1.5 transition-all cursor-pointer"
              title="Clear all tasks"
            >
              <Trash2 className="w-3.5 h-3.5 text-slate-600" />
              <span>Clear Board</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
