import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit3 } from "lucide-react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";

function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Lấy trạng thái sidebar từ localStorage, nếu null thì mặc định là false
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    return JSON.parse(localStorage.getItem("sidebarOpen")) ?? false;
  });

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lưu trạng thái sidebar vào localStorage khi nó thay đổi
  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  // Lấy dữ liệu công việc từ localStorage
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const foundTask = savedTasks.find((t) => t.id.toString() === id);
    setTask(foundTask);
    setLoading(false);
  }, [id]);

  // Hiển thị loading khi dữ liệu đang tải
  if (loading) {
    return <p className="text-center text-gray-500 text-lg">⏳ Đang tải...</p>;
  }

  // Hiển thị thông báo nếu không tìm thấy công việc
  if (!task) {
    return (
      <div className="text-center mt-12">
        <p className="text-red-500 text-xl font-semibold">⚠️ Không tìm thấy công việc!</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-5 py-2 flex items-center gap-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-all"
        >
          <ArrowLeft size={18} />
          Về trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="relative flex flex-col flex-1 overflow-y-auto">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow px-6 py-8 w-full max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
             Chi Tiết Công Việc 📌
          </h1>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{task.title}</h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">{task.description}</p>

            <div className="mt-4 space-y-2">
              <p className="text-lg">
                <strong>Trạng thái:</strong>
                <span
                  className={`ml-2 px-3 py-1 rounded-md text-white font-semibold ${
                    task.status === "Hoàn thành" ? "bg-green-500" :
                    task.status === "Đang làm" ? "bg-yellow-500" : "bg-red-500"
                  }`}
                >
                  {task.status}
                </span>
              </p>
              <p className="text-lg">
                <strong>Ngày tạo:</strong> {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : "Không xác định"}
              </p>
              <p className="text-lg">
                <strong>Hạn chót:</strong> {task.dueDate || "Chưa đặt"}
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 flex items-center gap-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 transition-all"
              >
                <ArrowLeft size={18} />
                Quay lại
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default TaskDetail;
