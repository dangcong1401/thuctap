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
    
    // Kiểm tra định dạng ngày theo nn/mm/yyyy
    const datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    if (!datePattern.test(newTask.dueDate)) {
      toast.error('⚠️ Ngày không hợp lệ!', { position: "top-right", autoClose: 2000 });
      return;
    }

  
    const now = new Date().toISOString();
    if (editingTaskId) {
      const updatedTasks = tasks.map(task => task.id === editingTaskId ? { ...newTask, updatedAt: now } : task);
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
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="sm:flex sm:justify-between sm:items-center mb-3">
              <h1 className="text-2xl md:text-3xl text-dark green-800 font-bold">Danh Sách Công Việc</h1>
            </div>
            <div className="mb-3">
              <input type="text" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} placeholder="Tiêu đề công việc" className="px-4 py-2 border border-gray-300 rounded-md w-full mb-3" />
              <textarea value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} placeholder="Mô tả công việc" className="px-4 py-2 border border-gray-300 rounded-md w-full mb-3" />
              <input 
                type="text" 
                value={newTask.dueDate} 
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} 
                placeholder="Nhập ngày (nn/mm/yyyy)" 
                className="px-4 py-2 border border-gray-300 rounded-md w-full mb-3" 
              />

              <select value={newTask.status} onChange={(e) => setNewTask({ ...newTask, status: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-md w-full mb-3">
                <option value="Chưa làm">Chưa làm</option>
                <option value="Đang làm">Đang làm</option>
                <option value="Hoàn thành">Hoàn thành</option>
              </select>
              <button onClick={handleAddOrUpdateTask} className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">
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
