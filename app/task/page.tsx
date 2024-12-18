"use client"; // Mark this file as a client component
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TaskModel } from "@/models/page";
import axios from 'axios';
import Image from "next/image";

const COL_OPTIONS = [
  "#FF3B30",
  "#FF9500",
  "#FFCC00",
  "#34C759",
  "#007AFF",
  "#5856D6",
  "#AF52DE",
  "#FF2D55",
  "#A2845E"
]

export default function TaskForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [form, setForm] = useState<TaskModel>({
    id: 0,
    title: "",
    color: "#FF3B30",
    completed: false,
    createdAt: "",
    updatedAt: ""
  });

  useEffect(() => {
    // Pre-fill the form if editing
    const id = searchParams.get("id");
    const title = searchParams.get("title");
    const color = searchParams.get("color") || "";
    const completed = searchParams.get("completed");
    const createdAt = searchParams.get("createdAt");

    if (id) {
      setForm({
        id: Number(id),
        title: title || "",
        color: decodeURIComponent(color) || "#f3f4f6",
        completed: completed === "true",
        createdAt: createdAt || Date.now().toString(),
        updatedAt: Date.now().toString()
      });
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const newTodo = { title: form.title, color: form.color, completed: form.completed };

      if (!form.id) {
        await axios.post(`${API_URL}/tasks`, newTodo).then(() => {
          router.push("/");
        });
      } else {
        await axios.put(`${API_URL}/tasks/${form.id}`, {
          ...newTodo
        }).then(() => {
          router.push("/");
        });
      }
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  return (
    <div className="min-h-screen text-white bg-bgCol">
      {/* Header */}
      <header className="flex justify-center items-center p-6 bg-black h-52 shrink-0">
        <Image src="/todoLogo.svg" alt="todo-logo" width="200" height="400" />
      </header>

      {/* Main Content */}
      <div className="container mx-auto pt-16 w-1/2 min-w-[400px] max-w-[736px]">
        <div className="cursor-pointer w-fit" onClick={(e) => {
          e.preventDefault();
          router.push("/");
        }}>
          <Image src="/arrow-left.svg" alt="arrow-left" width="20" height="20" />
        </div>

        <form onSubmit={handleSubmit} className="mt-8">
          <div>
            <label className="block text-lightBlue font-bold text-sm mb-2">Title:</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full h-12 p-2 rounded-md bg-lightDark border border-darkGray outline-none text-white placeholder:text-grey focus:border-white"
              placeholder="Ex. Brush you teeth"
              autoFocus
            />
          </div>

          <div className="mt-8">
            <label className="block text-lightBlue font-bold text-sm mb-2">Color:</label>
            <div className="flex justify-between items-center">
              {COL_OPTIONS.map((col) => (
                <span 
                  className="w-14 h-14 rounded-full cursor-pointer border-2" 
                  style={{ background: col, borderColor: col === form.color ? "white" : col }}
                  onClick={() => {
                    setForm({...form, color: col})
                  }}
                  key={col}
                ></span>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full text-sm flex justify-center items-center h-12 bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded-lg mt-10"
          >
            {form.id ? "Save" : "Add Task"}
            <span>
              {!form.id ? (
                <Image src="/roundPlus.svg" alt="round-plus" width="15" height="15" className="ml-2" />
              ) : (
                <Image src="/mdi_check-bold.svg" alt="mdi_check-bold" width="15" height="15" className="ml-2" />
              )}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
