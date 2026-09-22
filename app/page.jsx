"use client";

import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BoardSummary } from "@/components/BoardSummary";
import { TaskBoard } from "@/components/TaskBoard";
import { TaskModal } from "@/components/TaskModal";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";

export default function Home() {
  const {
    tasks,
    totalCount,
    todoCount,
    inProgressCount,
    doneCount,
    isLoaded,
    searchQuery,
    setSearchQuery,
    addTask,
    updateTask,
    moveTask,
    deleteTask,
    reorderTasks,
    clearAllTasks,
    resetDemoTasks,
  } = useTasks();

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState("todo");
  const [deletingTask, setDeletingTask] = useState(null);

  const handleOpenCreateModal = (columnStatus = "todo") => {
    setEditingTask(null);
    setDefaultStatus(columnStatus);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (taskData) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingTask) {
      deleteTask(deletingTask.id);
      setDeletingTask(null);
    }
  };

  const isFiltered = Boolean(searchQuery);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-slate-900 selection:text-white transition-colors duration-200">
      
      {/* Human Header */}
      <Header onOpenCreateModal={() => handleOpenCreateModal("todo")} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Board Summary & Search Bar */}
        <BoardSummary
          totalCount={totalCount}
          todoCount={todoCount}
          inProgressCount={inProgressCount}
          doneCount={doneCount}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onResetDemo={resetDemoTasks}
          onClearAll={clearAllTasks}
        />

        {/* Board Skeleton or Task Board */}
        {!isLoaded ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-96 rounded-3xl bg-slate-200/60 border border-slate-200"
              />
            ))}
          </div>
        ) : (
          <TaskBoard
            tasks={tasks}
            onReorder={reorderTasks}
            onAddTask={handleOpenCreateModal}
            onEditTask={handleOpenEditModal}
            onDeleteTask={(id) => {
              const target = tasks.find((t) => t.id === id);
              if (target) setDeletingTask(target);
            }}
            onMoveTask={moveTask}
            isFiltered={isFiltered}
          />
        )}

      </main>

      {/* Footer */}
      <Footer />

      {/* Create / Edit Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        taskToEdit={editingTask}
        defaultStatus={defaultStatus}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingTask)}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDeleteConfirm}
        taskTitle={deletingTask?.title}
      />

    </div>
  );
}
