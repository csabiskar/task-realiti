"use client";

import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { INITIAL_TASKS } from "@/data/initialTasks";

const STORAGE_KEY = "task-board-tasks";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Load tasks from localStorage on initial render
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (Array.isArray(parsed)) {
          setTasks(parsed);
        } else {
          setTasks(INITIAL_TASKS);
        }
      } else {
        setTasks(INITIAL_TASKS);
      }
    } catch (err) {
      setTasks(INITIAL_TASKS);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save tasks to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } catch (err) {
        console.error("Failed to save tasks to localStorage", err);
      }
    }
  }, [tasks, isLoaded]);

  // Helper for celebration effect when finishing a task
  const checkConfetti = (oldStatus, newStatus) => {
    if (oldStatus !== "done" && newStatus === "done") {
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.65 },
        });
      } catch (e) {}
    }
  };

  // Create a new task (defaults to 'todo')
  const addTask = (taskData) => {
    const title = taskData.title ? taskData.title.trim() : "";
    if (!title) return;

    const now = Date.now();
    const newTask = {
      id: `task-${now}`,
      title: title,
      description: taskData.description ? taskData.description.trim() : "",
      status: "todo",
      priority: taskData.priority || "medium",
      tag: taskData.tag ? taskData.tag.trim() : "Feature",
      dueDate: taskData.dueDate || "",
      createdAt: now,
      updatedAt: now,
    };

    setTasks((current) => [newTask, ...current]);
  };

  // Update existing task details
  const updateTask = (taskId, fields) => {
    setTasks((current) =>
      current.map((task) => {
        if (task.id === taskId) {
          const nextStatus = fields.status || task.status;
          checkConfetti(task.status, nextStatus);

          return {
            ...task,
            ...fields,
            title: fields.title ? fields.title.trim() : task.title,
            description: fields.description !== undefined ? fields.description.trim() : task.description,
            status: nextStatus,
            updatedAt: Date.now(),
          };
        }
        return task;
      })
    );
  };

  // Move task to another stage (todo / in-progress / done)
  const moveTask = (taskId, newStatus) => {
    setTasks((current) =>
      current.map((task) => {
        if (task.id === taskId) {
          checkConfetti(task.status, newStatus);
          return {
            ...task,
            status: newStatus,
            updatedAt: Date.now(),
          };
        }
        return task;
      })
    );
  };

  // Remove task from board
  const deleteTask = (taskId) => {
    setTasks((current) => current.filter((task) => task.id !== taskId));
  };

  // Handle Drag and Drop reordering across columns
  const reorderTasks = (source, destination) => {
    if (!destination) return;

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

    setTasks((current) => {
      const itemsInSource = current.filter((t) => t.status === sourceCol);
      const itemsInDest = sourceCol === destCol ? itemsInSource : current.filter((t) => t.status === destCol);
      const otherItems = current.filter((t) => t.status !== sourceCol && t.status !== destCol);

      const [movedTask] = itemsInSource.splice(source.index, 1);
      if (!movedTask) return current;

      checkConfetti(movedTask.status, destCol);
      movedTask.status = destCol;
      movedTask.updatedAt = Date.now();

      if (sourceCol === destCol) {
        itemsInSource.splice(destination.index, 0, movedTask);
        return [...otherItems, ...itemsInSource];
      } else {
        itemsInDest.splice(destination.index, 0, movedTask);
        return [...otherItems, ...itemsInSource, ...itemsInDest];
      }
    });
  };

  // Reset to sample tasks
  const resetDemoTasks = () => {
    setTasks(INITIAL_TASKS);
  };

  // Clear all tasks from board
  const clearAllTasks = () => {
    setTasks([]);
  };

  // Search filter logic
  const query = searchQuery.trim().toLowerCase();
  const filteredTasks = tasks.filter((t) => {
    if (!query) return true;
    return (
      t.title.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query) ||
      (t.tag && t.tag.toLowerCase().includes(query))
    );
  });

  // Simple statistics
  const todoCount = tasks.filter((t) => t.status === "todo").length;
  const inProgressCount = tasks.filter((t) => t.status === "in-progress").length;
  const doneCount = tasks.filter((t) => t.status === "done").length;
  const totalCount = tasks.length;
  const completionRate = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  return {
    tasks: filteredTasks,
    totalCount,
    todoCount,
    inProgressCount,
    doneCount,
    completionRate,
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
  };
}
