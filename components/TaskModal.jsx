"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle } from "lucide-react";

export function TaskModal({ isOpen, onClose, onSave, taskToEdit, defaultStatus = "todo" }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState("medium");
  const [tag, setTag] = useState("Feature");
  const [dueDate, setDueDate] = useState("");
  const [errors, setErrors] = useState({});

  const tagPresets = ["Feature", "Bug", "Design", "DevOps", "UX", "Polish"];
  const MAX_TITLE_LENGTH = 100;
  const MAX_DESC_LENGTH = 500;
  const MAX_TAG_LENGTH = 30;

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || "");
      setDescription(taskToEdit.description || "");
      setStatus(taskToEdit.status || "todo");
      setPriority(taskToEdit.priority || "medium");
      setTag(taskToEdit.tag || "Feature");
      setDueDate(taskToEdit.dueDate || "");
    } else {
      setTitle("");
      setDescription("");
      setStatus(defaultStatus || "todo");
      setPriority("medium");
      setTag("Feature");
      const defaultDate = new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0];
      setDueDate(defaultDate);
    }
    setErrors({});
  }, [taskToEdit, defaultStatus, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      newErrors.title = "Task title is required.";
    } else if (trimmedTitle.length > MAX_TITLE_LENGTH) {
      newErrors.title = `Title cannot exceed ${MAX_TITLE_LENGTH} characters.`;
    }

    if (description.length > MAX_DESC_LENGTH) {
      newErrors.description = `Description cannot exceed ${MAX_DESC_LENGTH} characters.`;
    }

    if (tag.trim().length > MAX_TAG_LENGTH) {
      newErrors.tag = `Tag cannot exceed ${MAX_TAG_LENGTH} characters.`;
    }

    if (dueDate) {
      const parsedDate = new Date(dueDate);
      if (isNaN(parsedDate.getTime())) {
        newErrors.dueDate = "Please select a valid date.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSave({
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      tag: tag.trim() || "General",
      dueDate,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.25 }}
            className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl z-10 text-left"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {taskToEdit ? "Edit Task Details" : "Create New Task"}
              </h3>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-4" noValidate>
              
              {/* Title Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Title <span className="text-slate-900">*</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {title.length}/{MAX_TITLE_LENGTH}
                  </span>
                </div>
                <input
                  type="text"
                  value={title}
                  maxLength={MAX_TITLE_LENGTH}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
                  }}
                  placeholder="e.g. Build dashboard..."
                  className={`w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 border text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.title
                      ? "border-slate-500 focus:ring-slate-900/20"
                      : "border-slate-200 focus:border-slate-400 focus:ring-slate-900/10"
                  }`}
                  autoFocus
                />
                {errors.title && (
                  <p className="text-xs text-slate-900 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Description Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Description
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {description.length}/{MAX_DESC_LENGTH}
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={description}
                  maxLength={MAX_DESC_LENGTH}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (errors.description) setErrors((prev) => ({ ...prev, description: "" }));
                  }}
                  placeholder="Create responsive dashboard UI..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10 transition-all"
                />
                {errors.description && (
                  <p className="text-xs text-slate-900 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Status & Priority Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Status */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Section / Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-400 cursor-pointer"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Priority Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-400 cursor-pointer"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              {/* Tag & Due Date Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category Tag */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={tag}
                    maxLength={MAX_TAG_LENGTH}
                    onChange={(e) => {
                      setTag(e.target.value);
                      if (errors.tag) setErrors((prev) => ({ ...prev, tag: "" }));
                    }}
                    placeholder="Feature, Bug..."
                    className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400"
                  />
                  {errors.tag && (
                    <p className="text-xs text-slate-900 font-semibold mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.tag}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {tagPresets.map((p) => (
                      <button
                        type="button"
                        key={p}
                        onClick={() => {
                          setTag(p);
                          if (errors.tag) setErrors((prev) => ({ ...prev, tag: "" }));
                        }}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border cursor-pointer transition-all ${
                          tag === p
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => {
                      setDueDate(e.target.value);
                      if (errors.dueDate) setErrors((prev) => ({ ...prev, dueDate: "" }));
                    }}
                    className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-400 cursor-pointer"
                  />
                  {errors.dueDate && (
                    <p className="text-xs text-slate-900 font-semibold mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.dueDate}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  {taskToEdit ? "Save Changes" : "Create Task"}
                </button>
              </div>

            </form>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
