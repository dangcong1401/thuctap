import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function TaskDetail() {
  const { id } = useParams(); // Lấy ID từ URL
  const navigate = useNavigate();
  const [task, setTask] = useState(null);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const foundTask = savedTasks.find((t) => t.id.toString() === id);
    setTask(foundTask);
  }, [id]);

  if (!task) {
    return <p className="text-center text-red-500">Không tìm thấy công việc!</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold">{task.title}</h1>
      <p className="text-gray-600">{task.description}</p>
      <p className="mt-2">
        <strong>Trạng thái:</strong> <span className="font-semibold">{task.status}</span>
      </p>
      <p>
        <strong>Ngày tạo:</strong> {new Date(task.createdAt).toLocaleDateString()}
      </p>
      <p>
        <strong>Hạn chót:</strong> {task.dueDate || "Chưa đặt"}
      </p>
      <button
        onClick={() => navigate(-1)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Quay lại
      </button>
    </div>
  );
}

export default TaskDetail;
