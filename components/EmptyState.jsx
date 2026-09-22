"use client";

import { CheckSquare, Plus } from "lucide-react";

export function EmptyState({ columnStatus, onAddTask, isFiltered }) {
  const columnTitles = {
    todo: "To Do",
    "in-progress": "In Progress",
    done: "Done",
  };

  const title = isFiltered
    ? "No matching tasks"
    : columnStatus === "done"
    ? "Nothing completed yet"
    : `No tasks in ${columnTitles[columnStatus] || "this column"}`;

  const subtitle = isFiltered
    ? "Try clearing search filter."
    : columnStatus === "todo"
    ? "Create a task to get started."
    : columnStatus === "in-progress"
    ? "Move tasks here when you start working."
    : "Completed tasks will appear here.";

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl border border-dashed border-slate-200 bg-white/60">
      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 mb-3">
        <CheckSquare className="w-5 h-5 stroke-[1.75]" />
      </div>

      <h4 className="text-xs font-bold text-slate-800 mb-1">{title}</h4>
      <p className="text-[11px] text-slate-500 max-w-[200px] mb-4">{subtitle}</p>

      {!isFiltered && (
        <button
          onClick={() => onAddTask(columnStatus)}
          className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Task</span>
        </button>
      )}
    </div>
  );
}
