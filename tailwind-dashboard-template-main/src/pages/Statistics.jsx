import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaCheckCircle, FaTrash } from "react-icons/fa";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import Swal from "sweetalert2";

function Statistics() {
  const [editingTask, setEditingTask] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Khởi tạo state từ localStorage
  const getStoredTasks = () => JSON.parse(localStorage.getItem("tasks")) || [];
  const [tasks, setTasks] = useState(getStoredTasks);

  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    notStarted: 0,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateTaskStats(tasks);
  }, [tasks]);

  const updateTaskStats = (tasks) => {
    const stats = {
      total: tasks.length,
      completed: tasks.filter((task) => task.status === "Hoàn thành").length,
      inProgress: tasks.filter((task) => task.status === "Đang làm").length,
      notStarted: tasks.filter((task) => task.status === "Chưa làm").length,
    };
    setTaskStats(stats);
  };

  const handleEditTask = (task) => {
    setEditingTask({ ...task });
  };
  
  const handleSaveEdit = () => {
    if (!editingTask) return;
  
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === editingTask.id
          ? {
              ...task,
              title: editingTask.title,
              description: editingTask.description,
              status: editingTask.status,
              updatedAt: new Date().toISOString(), // Cập nhật thời gian chỉnh sửa
            }
          : task
      );
  
      localStorage.setItem("tasks", JSON.stringify(updatedTasks)); // Lưu vào localStorage
      return updatedTasks;
    });
  
    setEditingTask(null); // Đóng modal chỉnh sửa
  };
  
  
  const handleCompleteTask = useCallback((taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: "Hoàn thành", updatedAt: new Date().toISOString() } : task
      )
    );
  }, []);

  const handleDeleteTask = useCallback((taskId) => {
    Swal.fire({
      title: "Xác nhận xóa?",
      text: "Bạn có chắc chắn muốn xóa công việc này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
        Swal.fire("Đã xóa!", "Công việc đã được xóa thành công.", "success");
      }
    });
  }, []);

  const statusStyles = {
    "Hoàn thành": "text-green-500",
    "Đang làm": "text-yellow-500",
    "Chưa làm": "text-red-500",
  };

  // Lọc danh sách công việc theo tìm kiếm
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter ? task.status === statusFilter : true;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold mb-6">
              Thống Kê Công Việc
            </h1>

            {/* Thanh tìm kiếm */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <input
                type="text"
                placeholder="Tìm kiếm theo tiêu đề hoặc mô tả..."
                className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/4"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="Hoàn thành">Hoàn thành</option>
                <option value="Đang làm">Đang làm</option>
                <option value="Chưa làm">Chưa làm</option>
              </select>
            </div>

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
            <div className="overflow-x-auto bg-white shadow rounded-lg mb-3">
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
                    {filteredTasks.length > 0 ? (
                      filteredTasks.map((task) => (
                        <tr key={task.id} className="border-b hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <Link to={`/task/${task.id}`} className="text-blue-500 underline">
                              {task.title}
                            </Link>
                          </td>
                          <td className="px-6 py-4">{task.description}</td>
                          <td className={`px-6 py-4 font-semibold ${statusStyles[task.status] || "text-gray-500"}`}>
                            {task.status}
                          </td>
                          <td className="px-6 py-4">{new Date(task.createdAt || Date.now()).toLocaleDateString()}</td>
                          <td className="px-6 py-4">{task.dueDate? new Date(task.dueDate).toLocaleDateString("vi-VN"): "Chưa đặt"}</td>
                          <td className="px-6 py-4">{task.updatedAt ? new Date(task.updatedAt).toLocaleString() : "N/A"}</td>
                          <td className="px-6 py-4 text-center flex gap-2 justify-center">
                            <button onClick={() => handleEditTask(task)} className="text-blue-500"><FaEdit size={20} /></button>
                            <button onClick={() => handleCompleteTask(task.id)} className="text-green-500"><FaCheckCircle size={20} /></button>
                            <button onClick={() => handleDeleteTask(task.id)} className="text-red-500"><FaTrash size={20} /></button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center py-4 text-gray-500">
                          Không có công việc nào phù hợp với tìm kiếm của bạn.
                        </td>
                      </tr>
                    )}
                 </tbody>

              </table>
            </div>
            {editingTask && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-lg font-bold mb-4">Chỉnh Sửa Công Việc</h2>
                    <input 
                        type="text" 
                        className="border p-2 w-full mb-3" 
                        value={editingTask.title} 
                        onChange={(e) => setEditingTask({...editingTask, title: e.target.value})} 
                    />
                    <textarea 
                        className="border p-2 w-full mb-3" 
                        value={editingTask.description} 
                        onChange={(e) => setEditingTask({...editingTask, description: e.target.value})} 
                    />
                    <select 
                        className="border p-2 w-full mb-3" 
                        value={editingTask.status} 
                        onChange={(e) => setEditingTask({...editingTask, status: e.target.value})}
                    >
                        <option value="Chưa làm">Chưa làm</option>
                        <option value="Đang làm">Đang làm</option>
                        <option value="Hoàn thành">Hoàn thành</option>
                    </select>
                    <div className="flex justify-end gap-2">
                        <button 
                        onClick={() => setEditingTask(null)} 
                        className="px-4 py-2 bg-gray-400 text-white rounded-md"
                        >
                        Hủy
                        </button>
                        <button 
                        onClick={() => handleSaveEdit()} 
                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                        >
                        Lưu
                        </button>
                    </div>
                    </div>
                </div>
                )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Statistics;
