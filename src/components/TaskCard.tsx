import React, { useState } from 'react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  columnColor: string;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDelete: () => void;
  isDragging: boolean;
  style?: React.CSSProperties;
}

const priorityConfig = {
  high: { label: 'HIGH', bg: '#FF3D00', border: '#FF3D00' },
  medium: { label: 'MED', bg: '#FFD600', border: '#FFD600' },
  low: { label: 'LOW', bg: '#00E676', border: '#00E676' },
};

export function TaskCard({ task, columnColor, onDragStart, onDragEnd, onDelete, isDragging, style }: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const priority = priorityConfig[task.priority];

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative bg-[#1A1A1A] border-3 border-white cursor-grab active:cursor-grabbing
        transition-all duration-150 animate-fade-in
        ${isDragging ? 'opacity-50 scale-95 rotate-2' : ''}
        ${isHovered ? 'translate-x-1 -translate-y-1' : ''}
      `}
      style={{
        borderWidth: '3px',
        boxShadow: isHovered
          ? `-6px 6px 0 0 ${columnColor}`
          : '-4px 4px 0 0 rgba(255,255,255,0.2)',
        ...style,
      }}
    >
      {/* Priority indicator */}
      <div
        className="absolute -top-1 -left-1 px-2 py-0.5 font-mono text-[10px] text-black font-bold border border-black"
        style={{ backgroundColor: priority.bg }}
      >
        {priority.label}
      </div>

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className={`
          absolute -top-1 -right-1 w-6 h-6 bg-black border-2 border-white
          text-white font-mono text-xs flex items-center justify-center
          hover:bg-[#FF3D00] hover:border-[#FF3D00] transition-colors
          ${isHovered ? 'opacity-100' : 'opacity-0 md:opacity-0'}
          opacity-100 md:opacity-0 md:group-hover:opacity-100
        `}
        style={{ opacity: isHovered ? 1 : undefined }}
      >
        X
      </button>

      <div className="p-3 md:p-4 pt-4 md:pt-5">
        <h3 className="font-anton text-base md:text-lg text-white leading-tight mb-2">
          {task.title}
        </h3>
        {task.description && (
          <p className="font-mono text-xs text-white/50 leading-relaxed">
            {task.description}
          </p>
        )}

        {/* Task ID */}
        <div className="mt-3 pt-2 border-t border-white/10">
          <span className="font-mono text-[10px] text-white/30">
            ID_{task.id.padStart(4, '0')}
          </span>
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className="h-1"
        style={{ backgroundColor: columnColor }}
      />
    </div>
  );
}
