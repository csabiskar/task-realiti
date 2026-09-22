"use client";

import { motion } from "framer-motion";
import { Draggable } from "@hello-pangea/dnd";
import { GripVertical, Edit3, Trash2, Calendar, Tag, AlertTriangle } from "lucide-react";

export function TaskCard({ task, index, onEdit, onDelete, onMove }) {
  const priorityLabels = {
    urgent: "Urgent",
    high: "High",
    medium: "Medium",
    low: "Low",
  };

  const priorityLabel = priorityLabels[task.priority] || "Medium";

  // Overdue calculation: True if due date is before today (at midnight) AND task is NOT completed ('done')
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isOverdue =
    task.dueDate &&
    task.status !== "done" &&
    new Date(task.dueDate) < today;

  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="outline-none focus:outline-none"
        >
          <motion.div
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className={`panel-card rounded-2xl p-4 flex flex-col justify-between gap-3 text-left transition-all cursor-grab active:cursor-grabbing select-none ${
              snapshot.isDragging
                ? "task-dragging shadow-2xl ring-2 ring-slate-900 border-slate-900 opacity-95 scale-[1.02] rotate-1"
                : isOverdue
                ? "border-slate-400 bg-slate-50/50 hover:border-slate-900"
                : "hover:border-slate-300 hover:shadow-sm"
            }`}
          >
            {/* Card Top Header: Badges & Overdue Alert */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                {/* Priority badge */}
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  {priorityLabel}
                </span>

                {/* Overdue Badge if deadline is crossed */}
                {isOverdue && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-900 text-white shadow-2xs">
                    <AlertTriangle className="w-3 h-3 text-white" />
                    Overdue
                  </span>
                )}

                {/* Tag badge */}
                {task.tag && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-50 text-slate-600 border border-slate-200">
                    <Tag className="w-2.5 h-2.5 text-slate-400" />
                    {task.tag}
                  </span>
                )}
              </div>

              {/* Grip Cue Icon */}
              <div className="text-slate-300 hover:text-slate-600 p-0.5">
                <GripVertical className="w-4 h-4" />
              </div>
            </div>

            {/* Title & Description */}
            <div>
              <h3
                className={`text-sm font-bold tracking-tight text-slate-900 leading-snug line-clamp-2 ${
                  task.status === "done" ? "line-through text-slate-400" : ""
                }`}
              >
                {task.title}
              </h3>

              {task.description && (
                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {task.description}
                </p>
              )}
            </div>

            {/* Footer Info: Due Date & Status Control & Quick Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
              
              {/* Status Dropdown Selector */}
              <div
                className="flex items-center gap-1.5"
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                <select
                  value={task.status}
                  onChange={(e) => {
                    e.stopPropagation();
                    onMove(task.id, e.target.value);
                  }}
                  className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-2.5 py-1 focus:outline-none focus:border-slate-400 focus:bg-white cursor-pointer transition-all hover:bg-slate-100"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              {/* Right Footer Group: Due Date, Edit & Delete */}
              <div
                className="flex items-center gap-2"
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Due Date Badge */}
                {task.dueDate && (
                  <div
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-medium text-[11px] ${
                      isOverdue
                        ? "bg-slate-900 text-white font-bold shadow-2xs"
                        : "text-slate-400"
                    }`}
                    title={isOverdue ? "Deadline crossed! Overdue task." : `Due date: ${task.dueDate}`}
                  >
                    <Calendar className="w-3 h-3" />
                    <span>{formattedDate}</span>
                  </div>
                )}

                <div className="w-px h-3 bg-slate-200" />

                {/* Edit Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(task);
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Edit task"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(task.id);
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Delete task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </Draggable>
  );
}