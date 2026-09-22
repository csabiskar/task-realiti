"use client";

import { useState, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import { INITIAL_TASKS } from "@/data/initialTasks";

const STORAGE_KEY = "task-board-tasks";
const VALID_STATUSES = ["todo", "in-progress", "done"];

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Load and validate tasks from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Validate task objects
          const validTasks = parsed.filter(
            (item) =>
              item &&
              typeof item === "object" &&
              typeof item.id === "string" &&
              typeof item.title === "string" &&
              VALID_STATUSES.includes(item.status)
          );

          if (validTasks.length > 0) {
            setTasks(validTasks);
          } else {
            setTasks(INITIAL_TASKS);
          }
        } else {
          setTasks(INITIAL_TASKS);
        }
      } else {
        setTasks(INITIAL_TASKS);
      }
    } catch (e) {
      console.error("Error parsing tasks from localStorage:", e);
      setTasks(INITIAL_TASKS);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever tasks change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } catch (e) {
        console.error("Error saving tasks to localStorage:", e);
      }
    }
  }, [tasks, isLoaded]);

  const triggerConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.65 },
        colors: ["#0f172a", "#334155", "#64748b", "#94a3b8", "#cbd5e1"],
      });
    } catch (e) {
      // ignore
    }
  }, []);

  // Add new task - strictly validates title & defaults to 'todo'
  const addTask = useCallback(({ title, description, priority, tag, dueDate }) => {
    const trimmedTitle = title ? title.trim() : "";
    if (!trimmedTitle) return null;

    const now = Date.now();
    const newTask = {
      id: `task-${now}-${Math.random().toString(36).substring(2, 6)}`,
      title: trimmedTitle,
      description: description ? description.trim() : "",
      status: "todo",
      priority: priority && ["urgent", "high", "medium", "low"].includes(priority) ? priority : "medium",
      tag: tag ? tag.trim() : "General",
      dueDate: dueDate || "",
      createdAt: now,
      updatedAt: now,
    };

    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }, []);

  // Update existing task
  const updateTask = useCallback((taskId, updatedFields) => {
    const now = Date.now();
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const validStatus = updatedFields.status && VALID_STATUSES.includes(updatedFields.status)
            ? updatedFields.status
            : t.status;

          const isCompleting = t.status !== "done" && validStatus === "done";
          if (isCompleting) triggerConfetti();

          return {
            ...t,
            ...updatedFields,
            title: updatedFields.title ? updatedFields.title.trim() : t.title,
            description: updatedFields.description !== undefined ? updatedFields.description.trim() : t.description,
            status: validStatus,
            updatedAt: now,
          };
        }
        return t;
      })
    );
  }, [triggerConfetti]);

  // Move task to a new status stage
  const moveTask = useCallback((taskId, newStatus) => {
    if (!VALID_STATUSES.includes(newStatus)) return;
    const now = Date.now();

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          if (t.status !== "done" && newStatus === "done") {
            triggerConfetti();
          }
          return {
            ...t,
            status: newStatus,
            updatedAt: now,
          };
        }
        return t;
      })
    );
  }, [triggerConfetti]);

  // Delete task
  const deleteTask = useCallback((taskId) => {
    if (!taskId) return;
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }, []);

  // Drag and drop reordering across or within columns
  const reorderTasks = useCallback((source, destination) => {
    if (!destination) return;

    const sourceColId = source.droppableId;
    const destColId = destination.droppableId;
    const sourceIdx = source.index;
    const destIdx = destination.index;

    if (!VALID_STATUSES.includes(sourceColId) || !VALID_STATUSES.includes(destColId)) return;

    setTasks((prevTasks) => {
      const sourceList = prevTasks.filter((t) => t.status === sourceColId);
      const destList =
        sourceColId === destColId
          ? sourceList
          : prevTasks.filter((t) => t.status === destColId);
      const otherTasks = prevTasks.filter(
        (t) => t.status !== sourceColId && t.status !== destColId
      );

      const [movedItem] = sourceList.splice(sourceIdx, 1);
      if (!movedItem) return prevTasks;

      const updatedMovedItem = {
        ...movedItem,
        status: destColId,
        updatedAt: Date.now(),
      };

      if (movedItem.status !== "done" && destColId === "done") {
        triggerConfetti();
      }

      if (sourceColId === destColId) {
        sourceList.splice(destIdx, 0, updatedMovedItem);
        return [...otherTasks, ...sourceList];
      } else {
        destList.splice(destIdx, 0, updatedMovedItem);
        return [...otherTasks, ...sourceList, ...destList];
      }
    });
  }, [triggerConfetti]);

  const clearAllTasks = useCallback(() => {
    setTasks([]);
  }, []);

  const resetDemoTasks = useCallback(() => {
    setTasks(INITIAL_TASKS);
  }, []);

  // Filtering with query sanitization
  const sanitizedQuery = searchQuery.trim().toLowerCase();
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      !sanitizedQuery ||
      t.title.toLowerCase().includes(sanitizedQuery) ||
      t.description.toLowerCase().includes(sanitizedQuery) ||
      (t.tag && t.tag.toLowerCase().includes(sanitizedQuery));
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate Column Stats dynamically
  const todoCount = tasks.filter((t) => t.status === "todo").length;
  const inProgressCount = tasks.filter((t) => t.status === "in-progress").length;
  const doneCount = tasks.filter((t) => t.status === "done").length;
  const totalCount = tasks.length;
  const completionRate = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  return {
    tasks: filteredTasks,
    rawTasks: tasks,
    totalCount,
    todoCount,
    inProgressCount,
    doneCount,
    completionRate,
    isLoaded,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    addTask,
    updateTask,
    moveTask,
    deleteTask,
    reorderTasks,
    clearAllTasks,
    resetDemoTasks,
  };
}
