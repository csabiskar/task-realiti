"use client";

import { Search, X, SlidersHorizontal, ArrowUpDown, RotateCcw, Trash2, ShieldAlert } from "lucide-react";

export function FilterBar({
  searchQuery,
  setSearchQuery,
  priorityFilter,
  setPriorityFilter,
  sortBy,
  setSortBy,
  onResetDemo,
  onClearAll,
  totalTasksCount,
}) {
  return (
    <div className="w-full bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-3.5 backdrop-blur-lg shadow-sm transition-all mb-6">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks by title, tag, or description..."
            className="w-full pl-10 pr-9 py-2 text-sm rounded-xl bg-slate-100/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Priority Filter */}
          <div className="flex items-center gap-1.5 bg-slate-100/80 dark:bg-slate-950/80 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 ml-2" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-300 pr-2 py-1 focus:outline-none cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">🔴 Urgent</option>
              <option value="high">🟠 High</option>
              <option value="medium">🔵 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
          </div>

          {/* Sorting */}
          <div className="flex items-center gap-1.5 bg-slate-100/80 dark:bg-slate-950/80 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 ml-2" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-300 pr-2 py-1 focus:outline-none cursor-pointer"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="priority">Sort: Priority</option>
              <option value="dueDate">Sort: Due Date</option>
            </select>
          </div>

          {/* Quick Demo Data / Clear Buttons */}
          <div className="flex items-center gap-1.5 ml-auto lg:ml-0">
            <button
              onClick={onResetDemo}
              className="px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-all"
              title="Reset sample tasks"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Load Sample Tasks</span>
            </button>

            {totalTasksCount > 0 && (
              <button
                onClick={onClearAll}
                className="px-2.5 py-1.5 text-xs font-medium rounded-xl border border-rose-200 dark:border-rose-950/80 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-1 transition-all"
                title="Clear all tasks from board"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear Board</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
