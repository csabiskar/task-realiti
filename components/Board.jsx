"use client";

import { useState, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { Column } from "@/components/Column";
import { CircleDot, Clock, CheckCircle2 } from "lucide-react";

export function Board({
  tasks,
  onReorder,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onMoveTask,
  isFiltered,
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState("todo");

  // Prevent SSR hydration mismatches with DragDropContext
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const columns = [
    { id: "todo", title: "To Do" },
    { id: "in-progress", title: "In Progress" },
    { id: "done", title: "Done" },
  ];

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    onReorder(source, destination);
  };

  if (!isMounted) {
    return (
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 py-6 animate-pulse">
        {columns.map((col) => (
          <div
            key={col.id}
            className="h-96 rounded-3xl bg-slate-200/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800"
          />
        ))}
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      
      {/* Mobile Tab Navigation */}
      <div className="flex md:hidden items-center p-1 bg-slate-200/70 dark:bg-slate-900/70 rounded-2xl border border-slate-200 dark:border-slate-800 mb-6">
        {columns.map((col) => {
          const count = getTasksByStatus(col.id).length;
          const isActive = activeMobileTab === col.id;
          return (
            <button
              key={col.id}
              onClick={() => setActiveMobileTab(col.id)}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                isActive
                  ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span>{col.title}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-700 text-[10px]">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Desktop 3-Column Grid Layout */}
      <div className="hidden md:grid grid-cols-3 gap-6 items-start">
        {columns.map((col) => (
          <Column
            key={col.id}
            id={col.id}
            title={col.title}
            tasks={getTasksByStatus(col.id)}
            onAddTask={onAddTask}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            onMoveTask={onMoveTask}
            isFiltered={isFiltered}
          />
        ))}
      </div>

      {/* Mobile Active Column Layout */}
      <div className="block md:hidden">
        {columns
          .filter((col) => col.id === activeMobileTab)
          .map((col) => (
            <Column
              key={col.id}
              id={col.id}
              title={col.title}
              tasks={getTasksByStatus(col.id)}
              onAddTask={onAddTask}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              onMoveTask={onMoveTask}
              isFiltered={isFiltered}
            />
          ))}
      </div>

    </DragDropContext>
  );
}
