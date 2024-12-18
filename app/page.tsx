"use client"; // Mark this file as a client component
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TaskModel } from "@/models/page";
import axios from 'axios';
import Image from "next/image";

const TodoList = () => {
  const [tasks, setTasks] = useState<TaskModel[]>([]);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    // Fetch todos from Express backend
    const fetchTodos = async () => {
      try {
        const response = await axios.get(`${API_URL}/tasks`);
        setTasks(response.data); // Set the fetched todos in the state
      } catch (error) {
        console.error('Error fetching todos', error);
      }
    };
    
    fetchTodos();
  }, []);

  const handleDelete = async (id: number) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this task?');

    if (isConfirmed) {
      try {
        await axios.delete(`${API_URL}/tasks/${id}`);
        setTasks(tasks.filter((t) => t.id !== id)); // Remove deleted todo from state
      } catch (error) {
        console.error('Error deleting todo:', error);
      }
    } else {
      console.log("Task Deletion Cancelled.")
    }
  };

  const handleToggleCompleted = async (id: number) => {
    try {
      const taskUpdate = tasks.find((t) => t.id === id);
      if (!taskUpdate) return;

      const updatedTodo = await axios.put(`${API_URL}/tasks/${id}`, {
        completed: !taskUpdate.completed,
      });

      // Update state with the new completion status
      setTasks(
        tasks.map((t) =>
          t.id === id ? { ...t, completed: updatedTodo.data.completed } : t
        )
      );
    } catch (error) {
      console.error('Error toggling completion status:', error);
    }
  };

  const handleCreate = (task?: TaskModel) => {
    const query = task
      ? `?id=${task.id}&title=${task.title}&completed=${task.completed}&color=${encodeURIComponent(task.color)}&createdAt=${task.createdAt}`
      : "";
    router.push(`/task${query}`);
  };

  return (
    <div className="min-h-screen text-white bg-bgCol">
      {/* Header */}
      <header className="flex justify-center items-center p-6 bg-black relative h-52 shrink-0">
        <Image src="/todoLogo.svg" alt="todo-logo" width={226} height={48} />
        <button
          onClick={() => handleCreate()}
          className="text-sm flex justify-center items-center h-12 bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded-lg absolute -bottom-5 w-1/2 min-w-[400px] max-w-[736px]"
        >
          Create Task
          <span>
            <Image src="/roundPlus.svg" alt="round-plus" width="15" height="15" className="ml-2" />
          </span>
        </button>
      </header>

      {/* Main Content */}
      <div className="container mx-auto pt-20 w-1/2 min-w-[400px] max-w-[736px]">
        {/* Tasks and Completed Sections */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <h2 className="font-bold text-primary text-sm">Tasks</h2>
            <span className="ml-2 bg-darkGray px-2 py-0 rounded-full">
              <p className="text-sm text-gray-400">{tasks.length}</p>
            </span>
          </div>
          <div className="flex items-center">
            <h2 className="font-bold text-secondary text-sm">Completed</h2>
            <span className="ml-2 bg-darkGray px-2 py-0 rounded-full">
              <p className="text-sm text-gray-400">{tasks.length ? `${tasks.filter((v) => v.completed).length} de ${tasks.length}` : 0}</p>
            </span>
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-4 p-12 border-t border-solid border-darkGray">
            <Image src="/note.svg" alt="note" width="56" height="56" />
            <p className="text-grey font-bold text-base">You don't have any tasks registered yet.</p>
            <p className="text-grey text-base">Create tasks and organize your to-do items.</p>
          </div>
        ) : (
          <ul className="space-y-4 max-h-[500px] overflow-y-auto">
            {tasks.map((todo) => (
              <li
                key={todo.id}
                className={`p-4 rounded-lg flex items-center bg-lightDark border border-darkGray`}
              >
                {todo.completed ? (
                  <span className="shrink-0 cursor-pointer" onClick={() => handleToggleCompleted(todo.id)}>
                    <Image src="/checked.svg" alt="checked" width="18" height="18" />
                  </span>
                ) : (
                  <span className="rounded-full w-4 h-4 border-2 border-lightBlue shrink-0 cursor-pointer" onClick={() => handleToggleCompleted(todo.id)}></span>
                )}
                <span className="text-white ml-2 cursor-pointer" onClick={() => handleCreate(todo)}>{todo.title}</span>
                <span className="ml-auto cursor-pointer shrink-0" onClick={() => handleDelete(todo.id)}>
                  <Image src="/trash.svg" alt="trash" width="15" height="15" />
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default TodoList;