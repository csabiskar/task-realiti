"use client";

import { useState, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { TaskColumn } from "@/components/TaskColumn";

export function TaskBoard({
  tasks,
  onReorder,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onMoveTask,
  isFiltered,
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const columns = [
    { id: "todo", title: "To Do" },
    { id: "in-progress", title: "In Progress" },
    { id: "done", title: "Done" },
  ];

  const getTasksByStatus = (status) => {
    return tasks.filter((t) => t.status === status);
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    onReorder(source, destination);
  };

  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        {columns.map((col) => (
          <div
            key={col.id}
            className="h-96 rounded-3xl bg-zinc-900 border border-zinc-800"
          />
        ))}
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {columns.map((col) => (
          <TaskColumn
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
