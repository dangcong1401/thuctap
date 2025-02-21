import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import { Edit, CheckCircle, Trash2 } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Dashboard() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'Chưa làm', dueDate: '' });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [filter, setFilter] = useState('Tất cả');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddOrUpdateTask = () => {
    if (!newTask.title.trim()) {
      toast.error('⚠️ Vui lòng nhập tiêu đề công việc!', { position: "top-right", autoClose: 2000 });
      return;
    }
    if (!newTask.description.trim()) {
      toast.error('⚠️ Vui lòng nhập mô tả công việc!', { position: "top-right", autoClose: 2000 });
      return;
    }
  
    // Kiểm tra định dạng ngày hợp lệ theo format yyyy-mm-dd
    if (!newTask.dueDate || isNaN(new Date(newTask.dueDate).getTime())) {
      toast.error('⚠️ Ngày không hợp lệ!', { position: "top-right", autoClose: 2000 });
      return;
    }

  
    const now = new Date().toISOString();
    if (editingTaskId) {
      const updatedTasks = tasks.map(task => task.id === editingTaskId ? { ...task, ...newTask, updatedAt: now } : task);
      setTasks(updatedTasks);
      setEditingTaskId(null);
      toast.success('✏️ Công việc đã được cập nhật!', { position: "top-right", autoClose: 2000 });
    } else {
      const updatedTasks = [...tasks, { ...newTask, id: Date.now(), createdAt: now, updatedAt: now }];
      setTasks(updatedTasks);
      toast.success('📝 Công việc đã được thêm thành công!', { position: "top-right", autoClose: 2000 });
    }
    setNewTask({ title: '', description: '', status: 'Chưa làm', dueDate: '' });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Sidebar />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header />
        <main className="grow">
          <div className="px-6 sm:px-8 lg:px-12 py-10 w-full max-w-5xl mx-auto">
            {/* Tiêu đề */}
            <div className="sm:flex sm:justify-between sm:items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                Thêm Công Việc 📋
              </h1>
            </div>
  
            {/* Form thêm công việc */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 space-y-4">
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Tiêu đề công việc"
                className="px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
  
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Mô tả công việc"
                className="px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
  
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
  
              <select
                value={newTask.status}
                onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                className="px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition focus:ring-2 focus:ring-blue-500"
              >
                <option value="Chưa làm">Chưa làm</option>
                <option value="Đang làm">Đang làm</option>
                <option value="Hoàn thành">Hoàn thành</option>
              </select>
  
              <button
                onClick={handleAddOrUpdateTask}
                className="w-full py-3 text-lg font-semibold bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition focus:ring-2 focus:ring-blue-500"
              >
                {editingTaskId ? 'Cập nhật' : 'Thêm công việc'}
              </button>
            </div>
          </div>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
  
}

export default Dashboard;