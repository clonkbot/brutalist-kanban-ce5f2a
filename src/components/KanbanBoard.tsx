import React, { useState } from 'react';
import { Column, Task } from '../types';
import { TaskCard } from './TaskCard';

interface KanbanBoardProps {
  columns: Column[];
  tasks: Task[];
  onMoveTask: (taskId: string, newColumnId: string) => void;
  onAddTask: (columnId: string, title: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export function KanbanBoard({ columns, tasks, onMoveTask, onAddTask, onDeleteTask }: KanbanBoardProps) {
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [newTaskInputs, setNewTaskInputs] = useState<Record<string, string>>({});
  const [showInputs, setShowInputs] = useState<Record<string, boolean>>({});

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDrop = (columnId: string) => {
    if (draggedTask) {
      onMoveTask(draggedTask, columnId);
    }
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const handleAddTask = (columnId: string) => {
    const title = newTaskInputs[columnId]?.trim();
    if (title) {
      onAddTask(columnId, title);
      setNewTaskInputs(prev => ({ ...prev, [columnId]: '' }));
      setShowInputs(prev => ({ ...prev, [columnId]: false }));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {columns.map((column, index) => {
        const columnTasks = tasks.filter(t => t.columnId === column.id);
        const isOver = dragOverColumn === column.id;

        return (
          <div
            key={column.id}
            className={`
              relative bg-black border-4 border-white
              transition-transform duration-150
              ${isOver ? 'scale-[1.02] border-[#FFD600]' : ''}
            `}
            style={{
              animationDelay: `${index * 100}ms`,
            }}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDrop={() => handleDrop(column.id)}
          >
            {/* Column header with hazard stripes */}
            <div
              className="relative h-14 md:h-16 border-b-4 border-white overflow-hidden"
              style={{
                background: `repeating-linear-gradient(
                  -45deg,
                  ${column.color},
                  ${column.color} 10px,
                  #000 10px,
                  #000 20px
                )`,
              }}
            >
              <div className="absolute inset-0 flex items-center justify-between px-3 md:px-4 bg-black/60">
                <h2 className="font-anton text-lg md:text-xl text-white tracking-wider">
                  {column.title}
                </h2>
                <span
                  className="font-mono text-xs border-2 px-2 py-1"
                  style={{ borderColor: column.color, color: column.color }}
                >
                  {columnTasks.length}
                </span>
              </div>
            </div>

            {/* Tasks container */}
            <div className="p-3 md:p-4 space-y-3 md:space-y-4 min-h-[200px] md:min-h-[300px]">
              {columnTasks.map((task, taskIndex) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  columnColor={column.color}
                  onDragStart={() => handleDragStart(task.id)}
                  onDragEnd={handleDragEnd}
                  onDelete={() => onDeleteTask(task.id)}
                  isDragging={draggedTask === task.id}
                  style={{ animationDelay: `${(index * 100) + (taskIndex * 50)}ms` }}
                />
              ))}

              {/* Add task section */}
              {showInputs[column.id] ? (
                <div className="border-2 border-dashed border-white/40 p-3">
                  <input
                    type="text"
                    value={newTaskInputs[column.id] || ''}
                    onChange={(e) => setNewTaskInputs(prev => ({ ...prev, [column.id]: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTask(column.id)}
                    placeholder="TASK TITLE..."
                    className="w-full bg-transparent border-b-2 border-white/60 text-white font-mono text-sm py-2 placeholder:text-white/30 focus:outline-none focus:border-[#FFD600]"
                    autoFocus
                  />
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleAddTask(column.id)}
                      className="flex-1 bg-[#FFD600] text-black font-anton text-sm py-2 border-2 border-white hover:bg-white transition-colors min-h-[44px]"
                    >
                      ADD
                    </button>
                    <button
                      onClick={() => setShowInputs(prev => ({ ...prev, [column.id]: false }))}
                      className="px-4 border-2 border-white/40 text-white/60 font-mono text-sm hover:border-white hover:text-white transition-colors min-h-[44px]"
                    >
                      X
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowInputs(prev => ({ ...prev, [column.id]: true }))}
                  className="w-full border-2 border-dashed border-white/20 text-white/40 font-mono text-sm py-4 hover:border-white/60 hover:text-white/80 transition-colors min-h-[48px]"
                >
                  + NEW TASK
                </button>
              )}
            </div>

            {/* Corner decoration */}
            <div
              className="absolute -top-2 -right-2 w-4 h-4 border-2 border-white hidden md:block"
              style={{ backgroundColor: column.color }}
            />
          </div>
        );
      })}
    </div>
  );
}
