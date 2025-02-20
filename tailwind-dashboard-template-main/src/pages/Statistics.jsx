import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';

function Statistics() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [filteredTasks, setFilteredTasks] = useState(tasks);

  useEffect(() => {
    setFilteredTasks(
      tasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.status.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, tasks]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Tiêu đề trang */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                Thống Kê Công Việc
              </h1>
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Bảng danh sách công việc */}
            <div className="overflow-x-auto bg-white shadow rounded-lg">
              <table className="min-w-full border border-gray-200">
                <thead>
                  <tr className="bg-gray-100 text-left text-sm text-gray-700">
                    <th className="px-6 py-3">Tiêu đề</th>
                    <th className="px-6 py-3">Mô tả</th>
                    <th className="px-6 py-3">Trạng thái</th>
                    <th className="px-6 py-3">Ngày tạo</th>
                    <th className="px-6 py-3">Hạn chót</th>
                    <th className="px-6 py-3">Cập nhật gần nhất</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.length > 0 ? (
                    filteredTasks.map(task => (
                      <tr key={task.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4">{task.title}</td>
                        <td className="px-6 py-4">{task.description}</td>
                        <td className={`px-6 py-4 font-semibold ${
                          task.status === 'Hoàn thành' ? 'text-green-500' : 
                          task.status === 'Đang làm' ? 'text-yellow-500' : 
                          'text-red-500'
                        }`}>
                          {task.status}
                        </td>
                        <td className="px-6 py-4">{task.createdAt ? new Date(task.createdAt).toLocaleString() : 'N/A'}</td>
                        <td className="px-6 py-4">{task.dueDate || 'Chưa đặt'}</td>
                        <td className="px-6 py-4">{task.updatedAt ? new Date(task.updatedAt).toLocaleString() : 'N/A'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-gray-500">Không tìm thấy công việc</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Statistics;
