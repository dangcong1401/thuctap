import React, { useState, useEffect } from 'react';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';

function Statistics() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    notStarted: 0,
  });

  useEffect(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'Hoàn thành').length;
    const inProgress = tasks.filter(task => task.status === 'Đang làm').length;
    const notStarted = tasks.filter(task => task.status === 'Chưa làm').length;

    setTaskStats({ total, completed, inProgress, notStarted });
  }, [tasks]);

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
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold mb-6">
              Thống Kê Công Việc
            </h1>

            {/* Bảng thống kê */}
            <div className="overflow-x-auto bg-white shadow rounded-lg mb-6">
              <table className="min-w-full border border-gray-200">
                <thead>
                  <tr className="bg-gray-100 text-left text-sm text-gray-700">
                    <th className="px-6 py-3">Tổng số công việc</th>
                    <th className="px-6 py-3">Đã hoàn thành</th>
                    <th className="px-6 py-3">Đang làm</th>
                    <th className="px-6 py-3">Chưa làm</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-center">
                    <td className="px-6 py-4 border">{taskStats.total}</td>
                    <td className="px-6 py-4 border text-green-500">{taskStats.completed}</td>
                    <td className="px-6 py-4 border text-yellow-500">{taskStats.inProgress}</td>
                    <td className="px-6 py-4 border text-red-500">{taskStats.notStarted}</td>
                  </tr>
                </tbody>
              </table>
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
                  {tasks.map(task => (
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

export default Statistics;
