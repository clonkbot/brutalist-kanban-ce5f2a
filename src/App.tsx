import React, { useState, useCallback } from 'react';
import { KanbanBoard } from './components/KanbanBoard';
import { Task, Column } from './types';

const initialColumns: Column[] = [
  { id: 'backlog', title: 'BACKLOG', color: '#FFD600' },
  { id: 'in-progress', title: 'IN PROGRESS', color: '#FF3D00' },
  { id: 'review', title: 'REVIEW', color: '#00E676' },
  { id: 'done', title: 'DONE', color: '#FFFFFF' },
];

const initialTasks: Task[] = [
  { id: '1', columnId: 'backlog', title: 'DESIGN SYSTEM OVERHAUL', description: 'Rebuild component library from scratch', priority: 'high' },
  { id: '2', columnId: 'backlog', title: 'DATABASE MIGRATION', description: 'Move to PostgreSQL cluster', priority: 'medium' },
  { id: '3', columnId: 'in-progress', title: 'API REFACTOR', description: 'RESTful endpoints cleanup', priority: 'high' },
  { id: '4', columnId: 'in-progress', title: 'UNIT TESTS', description: 'Coverage target: 80%', priority: 'low' },
  { id: '5', columnId: 'review', title: 'AUTH MODULE', description: 'OAuth2 implementation review', priority: 'medium' },
  { id: '6', columnId: 'done', title: 'CI/CD PIPELINE', description: 'Automated deployment complete', priority: 'low' },
];

function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [columns] = useState<Column[]>(initialColumns);

  const moveTask = useCallback((taskId: string, newColumnId: string) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, columnId: newColumnId } : task
    ));
  }, []);

  const addTask = useCallback((columnId: string, title: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      columnId,
      title: title.toUpperCase(),
      description: '',
      priority: 'medium',
    };
    setTasks(prev => [...prev, newTask]);
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  }, []);

  return (
    <div className="min-h-screen bg-[#1A1A1A] relative overflow-hidden">
      {/* Noise texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Grid lines background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #fff 1px, transparent 1px),
            linear-gradient(to bottom, #fff 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Header */}
      <header className="relative z-10 border-b-4 border-white bg-black">
        <div className="px-4 md:px-8 py-4 md:py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#FFD600] border-4 border-white transform -rotate-6" />
            <h1 className="font-anton text-3xl md:text-5xl text-white tracking-tight">
              KANBAN<span className="text-[#FF3D00]">.</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <span className="font-mono text-xs md:text-sm text-white/60 hidden sm:block">SYS://BOARD_001</span>
            <div className="h-3 w-3 bg-[#00E676] animate-pulse border border-white" />
          </div>
        </div>
      </header>

      {/* Board */}
      <main className="relative z-10 p-4 md:p-8">
        <KanbanBoard
          columns={columns}
          tasks={tasks}
          onMoveTask={moveTask}
          onAddTask={addTask}
          onDeleteTask={deleteTask}
        />
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-8 md:mt-12 pb-6 px-4 md:px-8">
        <div className="border-t border-white/10 pt-4">
          <p className="font-mono text-[10px] md:text-xs text-white/30 text-center">
            Requested by @web-user · Built by @clonkbot
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
