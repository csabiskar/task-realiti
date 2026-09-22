"use client";

import { Droppable } from "@hello-pangea/dnd";
import { TaskCard } from "@/components/TaskCard";
import { EmptyState } from "@/components/EmptyState";
import { Plus, CircleDot, Clock, CheckCircle2 } from "lucide-react";

export function Column({
  id,
  title,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onMoveTask,
  isFiltered,
}) {
  const columnStyles = {
    todo: {
      badge: "bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
      accent: "bg-indigo-500",
      icon: CircleDot,
    },
    "in-progress": {
      badge: "bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900",
      accent: "bg-amber-500",
      icon: Clock,
    },
    done: {
      badge: "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
      accent: "bg-emerald-500",
      icon: CheckCircle2,
    },
  };

  const style = columnStyles[id] || columnStyles.todo;
  const ColumnIcon = style.icon;

  return (
    <div className="flex flex-col h-full bg-slate-100/60 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-4 transition-all shadow-sm">
      
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-xl border ${style.badge}`}>
            <ColumnIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {title}
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-xs">
                {tasks.length}
              </span>
            </h2>
          </div>
        </div>

        {/* Quick Add button in header */}
        <button
          onClick={() => onAddTask(id)}
          className="p-1.5 rounded-xl text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all"
          title={`Add task to ${title}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Droppable Container */}
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 min-h-[420px] rounded-2xl p-2 transition-colors flex flex-col gap-3.5 ${
              snapshot.isDraggingOver
                ? "bg-indigo-50/50 dark:bg-indigo-950/20 ring-2 ring-indigo-500/30 ring-dashed"
                : ""
            }`}
          >
            {tasks.length > 0 ? (
              tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                  onMove={onMoveTask}
                />
              ))
            ) : (
              <EmptyState
                columnStatus={id}
                onAddTask={onAddTask}
                isFiltered={isFiltered}
              />
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

    </div>
  );
}
