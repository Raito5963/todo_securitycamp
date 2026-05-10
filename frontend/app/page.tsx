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
      <div className="flex items-center gap-2">
        <input 
          type="text" 
          placeholder="タスク内容"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={()=>handleAddTodo()}>
          追加
        </button>
      </div>
      <div>
        {todo.map((todo)=>(
          <li 
            key={todo.id}
            className="flex items-center gap-2"
          >
            <p>{todo.task}</p>
            <button onClick={() => handleDeleted(todo)}>
              削除
            </button>
          </li>
        ))}
      </div>
    </>
  )
}