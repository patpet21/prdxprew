
import React, { useState } from 'react';
import { Button } from '../ui/Button';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export const TasksTab: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', text: 'Review updated compliance documents', completed: false },
    { id: '2', text: 'Schedule meeting with legal counsel', completed: true },
    { id: '3', text: 'Prepare quarterly financial report', completed: false },
  ]);
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (!newTask.trim()) return;
    const task: Task = {
      id: Date.now().toString(),
      text: newTask,
      completed: false,
    };
    setTasks([task, ...tasks]);
    setNewTask('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') addTask();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-display">Task Management</h2>
          <p className="text-slate-500 text-sm">Track your tokenization workflow and daily operations.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex gap-4 mb-8">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a new task..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
          />
          <Button onClick={addTask} className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-200">
            Add Task
          </Button>
        </div>

        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <span className="text-4xl block mb-2 opacity-50">📝</span>
              <p>No tasks yet. Add one to get started!</p>
            </div>
          ) : (
            tasks.map(task => (
              <div 
                key={task.id} 
                className={`group flex items-center justify-between p-4 rounded-xl border transition-all ${
                  task.completed 
                    ? 'bg-slate-50 border-slate-100' 
                    : 'bg-white border-slate-200 hover:border-indigo-200 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      task.completed 
                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                        : 'border-slate-300 hover:border-indigo-500 text-transparent'
                    }`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <span className={`text-sm font-medium transition-colors ${
                    task.completed ? 'text-slate-400 line-through' : 'text-slate-700'
                  }`}>
                    {task.text}
                  </span>
                </div>
                
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete Task"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
        
        {tasks.length > 0 && (
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-400 flex justify-between">
                <span>{tasks.filter(t => !t.completed).length} pending</span>
                <span>{tasks.filter(t => t.completed).length} completed</span>
            </div>
        )}
      </div>
    </div>
  );
};
