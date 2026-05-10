"use client";

import { useEffect, useState } from "react";

type Todo = {
  id: number;
  task: string;
  deleted: boolean;
}

export default function Todo(){
  const[todo,setTodo] = useState<Todo[]>([]);
  const[newTask,setNewTask] = useState("")
  // todo取得
  useEffect(() =>{
    fetchTodo();
  }, [])

  const fetchTodo = async () =>{
    const res = await fetch("http://localhost:8080/todo")
    const data = await res.json();
    setTodo(data)
  }

  const handleAddTodo = async () =>{
    await fetch("http://localhost:8080/todo",{
      method: "POST",
      headers:{
        "Content-Type":"application/json",
      },
      body: JSON.stringify({
        task: newTask,
        deleted: false,
      })
    })
    setNewTask("")
    fetchTodo()
  }

  const handleDeleted = async(todo:Todo) =>{
    await fetch(`http://localhost:8080/todo/${todo.id}`,{
      method: "DELETE",
    })
    fetchTodo()
  }

  return(
    <>
      <div className="p-4 mt-8 mx-32 flex justify-between gap-2">
        <input 
          type="text" 
          placeholder="タスク内容"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="border rounded-md p-4 w-84"
        />
        <button 
          onClick={()=>handleAddTodo()}
          className="p-4 bg-blue-500 rounded-md text-white font-bold active:bg-blue-800"
          >
          追加
        </button>
      </div>
      <div>
        {todo.map((todo)=>(
          <li 
            key={todo.id}
            className="border rounded-md shadow border-gray-300 p-2 mx-32 mt-2 flex items-center justify-between gap-2"
          >
            <p className="pl-16 text-2xl font-bold">{todo.task}</p>
            <button 
            onClick={() => handleDeleted(todo)}
            className="p-4 bg-red-500 rounded-md text-white font-bold active:bg-red-800"
            >
              削除
            </button>
          </li>
        ))}
      </div>
    </>
  )
}