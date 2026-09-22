"use client";

import { Droppable } from "@hello-pangea/dnd";
import { TaskCard } from "@/components/TaskCard";
import { EmptyState } from "@/components/EmptyState";
import { Plus, CircleDot, Clock, CheckCircle2 } from "lucide-react";

export function TaskColumn({
  id,
  title,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onMoveTask,
  isFiltered,
}) {
  const columnIcons = {
    todo: CircleDot,
    "in-progress": Clock,
    done: CheckCircle2,
  };

  const ColumnIcon = columnIcons[id] || CircleDot;

  return (
    <div className="panel-column flex flex-col rounded-3xl p-4 transition-all bg-slate-100/70 border border-slate-200/80 shadow-2xs">
      
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3.5 px-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-700">
            <ColumnIcon className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            {title}
          </h2>
          <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-white border border-slate-200 text-slate-700 shadow-2xs">
            {tasks.length}
          </span>
        </div>

        <button
          onClick={() => onAddTask(id)}
          className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-white transition-all cursor-pointer border border-transparent hover:border-slate-200"
          title={`Add task to ${title}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Droppable Drop Zone */}
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 min-h-[420px] rounded-2xl p-2 transition-all flex flex-col gap-3.5 ${
              snapshot.isDraggingOver
                ? "bg-slate-200/60 ring-2 ring-slate-400/40 border-slate-300 shadow-inner"
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
