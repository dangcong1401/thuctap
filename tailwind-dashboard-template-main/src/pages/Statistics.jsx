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
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Main Content */}
      <div className="relative flex flex-col flex-1 overflow-y-auto">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <main className="grow px-6 py-8 w-full max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
             Thống Kê Công Việc📊
          </h1>

          {/* Bộ lọc tìm kiếm */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="🔍 Tìm kiếm công việc..."
              className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/2 focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/4 focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">🔄 Tất cả trạng thái</option>
              <option value="Hoàn thành">✅ Hoàn thành</option>
              <option value="Đang làm">⏳ Đang làm</option>
              <option value="Chưa làm">❌ Chưa làm</option>
            </select>
          </div>

          {/* Cards thống kê */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Tổng số công việc", value: taskStats.total, color: "bg-gray-500" },
              { label: "Đã hoàn thành", value: taskStats.completed, color: "bg-green-500" },
              { label: "Đang làm", value: taskStats.inProgress, color: "bg-yellow-500" },
              { label: "Chưa làm", value: taskStats.notStarted, color: "bg-red-500" },
            ].map((stat, index) => (
              <div key={index} className={`p-4 rounded-lg text-white shadow-md ${stat.color}`}>
                <h3 className="text-lg font-semibold">{stat.label}</h3>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Danh sách công việc */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  {["Tiêu đề", "Mô tả", "Trạng thái", "Ngày tạo", "Hạn chót", "Cập nhật", "Hành động"].map(
                    (header, index) => (
                      <th key={index} className="px-6 py-3 text-sm">{header}</th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <tr key={task.id} className="border-b hover:bg-gray-100">
                      <td className="px-6 py-4">
                        <Link to={`/task/${task.id}`} className="text-blue-600 hover:underline font-medium">
                          {task.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4">{task.description}</td>
                      <td className={`px-6 py-4 font-semibold ${statusStyles[task.status] || "text-gray-500"}`}>
                        {task.status}
                      </td>
                      <td className="px-6 py-4">{new Date(task.createdAt || Date.now()).toLocaleDateString()}</td>
                      <td className="px-6 py-4">{task.dueDate ? new Date(task.dueDate).toLocaleDateString("vi-VN") : "Chưa đặt"}</td>
                      <td className="px-6 py-4">{task.updatedAt ? new Date(task.updatedAt).toLocaleString() : "N/A"}</td>
                      <td className="px-6 py-4 text-center flex gap-2 justify-center">
                        <button onClick={() => handleEditTask(task)} className="text-blue-500 hover:text-blue-700 transition">
                          <FaEdit size={18} />
                        </button>
                        <button onClick={() => handleCompleteTask(task.id)} className="text-green-500 hover:text-green-700 transition">
                          <FaCheckCircle size={18} />
                        </button>
                        <button onClick={() => handleDeleteTask(task.id)} className="text-red-500 hover:text-red-700 transition">
                          <FaTrash size={18} />
                        </button>
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

          {/* Modal chỉnh sửa */}
          {editingTask && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-[90%] sm:w-96 transform transition-all scale-95 animate-fadeIn">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        📝 Chỉnh Sửa Công Việc
      </h2>

      {/* Input tiêu đề */}
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">Tiêu đề</label>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={editingTask.title}
          onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
        />
      </div>

      {/* Textarea mô tả */}
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">Mô tả</label>
        <textarea
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          rows="3"
          value={editingTask.description}
          onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
        />
      </div>

      {/* Select trạng thái */}
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">Trạng thái</label>
        <select
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={editingTask.status}
          onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}
        >
          <option value="Chưa làm">❌ Chưa làm</option>
          <option value="Đang làm">⏳ Đang làm</option>
          <option value="Hoàn thành">✅ Hoàn thành</option>
        </select>
      </div>

      {/* Nút bấm */}
      <div className="flex justify-end gap-2 mt-5">
        <button
          onClick={() => setEditingTask(null)}
          className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg transition"
        >
          Hủy
        </button>
        <button
          onClick={() => handleSaveEdit()}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition shadow-md"
        >
          💾 Lưu
        </button>
      </div>
    </div>
  </div>
)}

        </main>
      </div>
    </div>
  );
}

export default Statistics;
