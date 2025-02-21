import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit3, Home } from "lucide-react";

function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const foundTask = savedTasks.find((t) => t.id.toString() === id);
    setTask(foundTask);
    setLoading(false);
  }, [id]);

  if (loading) {
    return <p className="text-center text-gray-500 text-lg">⏳ Đang tải...</p>;
  }

  if (!task) {
    return (
      <div className="text-center mt-12">
        <p className="text-red-500 text-xl font-semibold">⚠️ Không tìm thấy công việc!</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-5 py-2 flex items-center gap-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-all"
        >
          <Home size={18} />
          Về trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-3">{task.title}</h1>
      <p className="text-gray-600 text-lg">{task.description}</p>

      <div className="mt-4 space-y-2">
        <p className="text-lg">
          <strong>Trạng thái:</strong>{" "}
          <span
            className={`px-3 py-1 rounded-md text-white font-semibold ${
              task.status === "Hoàn thành"
                ? "bg-green-500"
                : task.status === "Đang làm"
                ? "bg-orange-500"
                : "bg-red-500"
            }`}
          >
            {task.status}
          </span>
        </p>
        <p className="text-lg">
          <strong>Ngày tạo:</strong>{" "}
          {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : "Không xác định"}
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
  );
}

export default TaskDetail;
