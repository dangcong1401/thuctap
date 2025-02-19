import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import { Edit, CheckCircle, Trash2 } from 'lucide-react';


function Dashboard() {
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const[filteredTasks, setFilteredTasks] = useState([]);
  const handleChange = (event) => {
    const value = event.target.value;
    setFilter(value);
  };
  
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTask, setNewTask] = useState({
    title: '', description: '', status: 'Chưa làm', createdAt: '', dueDate: '', updatedAt: ''
  });
  const [filter, setFilter] = useState('Tất cả');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleThemeToggle = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleAddOrUpdateTask = () => {
    if (newTask.title && newTask.description) {
      const now = new Date().toISOString();
      if (editingTaskId) {
        setTasks(tasks.map(task => task.id === editingTaskId ? { ...newTask, updatedAt: now } : task));
        setEditingTaskId(null);
      } else {
        setTasks([...tasks, { ...newTask, id: Date.now(), createdAt: now, updatedAt: now }]);
      }
      setNewTask({ title: '', description: '', status: 'Chưa làm', createdAt: '', dueDate: '', updatedAt: '' });
    }
  };

  const handleEditTask = (id) => {
    const taskToEdit = tasks.find(task => task.id === id);
    if (taskToEdit) {
      setNewTask({ ...taskToEdit });
      setEditingTaskId(id);
    }
  };
  

  const handleCompleteTask = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, status: 'Hoàn thành', updatedAt: new Date().toISOString() } : task));
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  useEffect(() => {
    setFilteredTasks(tasks.filter(task => filter === 'Tất cả' || task.status === filter));
  }, [tasks, filter]);
  

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Danh Sách Công Việc</h1>
              <button onClick={handleThemeToggle} className="text-gray-800 dark:text-gray-100 p-2 rounded-full">
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </button>
            </div>
            <div className="mb-8">
              <input type="text" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} placeholder="Tiêu đề công việc" className="px-4 py-2 border border-gray-300 rounded-md w-full mb-2" />
              <textarea value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} placeholder="Mô tả công việc" className="px-4 py-2 border border-gray-300 rounded-md w-full mb-2" />
              <input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-md w-full mb-2" />
              <select value={newTask.status} onChange={(e) => setNewTask({ ...newTask, status: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-md w-full mb-2">
                <option value="Chưa làm">Chưa làm</option>
                <option value="Đang làm">Đang làm</option>
                <option value="Hoàn thành">Hoàn thành</option>
              </select>
              <button onClick={handleAddOrUpdateTask} className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">
                  {editingTaskId ? 'Cập nhật' : 'Thêm công việc'}
              </button>
            </div>
            <div className="mb-4">
              Tìm kiếm <br></br>
              <select onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-md w-50 mb-2">     
                <option value="Tất cả">Tất cả</option>
                <option value="Chưa làm">Chưa làm</option>
                <option value="Đang làm">Đang làm</option>
                <option value="Hoàn thành">Hoàn thành</option>
              </select>      
                </div>
            <div className="overflow-x-auto bg-white shadow rounded-lg">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100 text-left text-sm text-gray-700">
                    <th className="px-6 py-3">Tiêu đề</th>
                    <th className="px-6 py-3">Mô tả</th>
                    <th className="px-6 py-3">Trạng thái</th>
                    <th className="px-6 py-3">Ngày tạo</th>
                    <th className="px-6 py-3">Hạn chót</th>
                    <th className="px-6 py-3">Cập nhật gần nhất</th>
                    <th className="px-6 py-3 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map(task => (
                    <tr key={task.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4"><Link to={`/task/${task.id}`} className="text-blue-500 underline">{task.title}</Link></td>
                      <td className="px-6 py-4">{task.description}</td>
                      <td className={`px-6 py-4 font-semibold ${task.status === 'Hoàn thành' ? 'text-green-500' : task.status === 'Đang làm' ? 'text-yellow-500' : 'text-red-500'}`}>{task.status}</td>
                      <td className="px-6 py-4">{task.createdAt ? new Date(task.createdAt).toLocaleString() : 'N/A'}</td>
                      <td className="px-6 py-4">{task.dueDate || 'Chưa đặt'}</td>
                      <td className="px-6 py-4">{task.updatedAt ? new Date(task.updatedAt).toLocaleString() : 'N/A'}</td>
                      <td className="px-6 py-4 text-center flex gap-2 justify-center">
                        <button onClick={() => handleEditTask(task.id)} className="text-blue-500 hover:text-blue-700">
                        <Edit size={20} />
                        </button>
                        <button onClick={() => handleCompleteTask(task.id)} className="text-green-500 hover:text-green-700">
                        <CheckCircle size={20} />
                        </button>
                        <button onClick={() => handleDeleteTask(task.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={20} />
                        </button>
                        </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;