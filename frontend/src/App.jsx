import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'http://localhost:5000/api/tasks'

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API)
      setTasks(res.data)
    } catch (err) {
      console.error('Error fetching tasks:', err)
    }
  }

  const addTask = async () => {
    if (!title.trim()) return
    try {
      const res = await axios.post(API, { title })
      setTasks([...tasks, res.data])
      setTitle('')
    } catch (err) {
      console.error('Error adding task:', err)
    }
  }

  const toggleTask = async (task) => {
    try {
      const res = await axios.put(`${API}/${task._id}`, {
        completed: !task.completed
      })
      setTasks(tasks.map(t => (t._id === task._id ? res.data : t)))
    } catch (err) {
      console.error('Error updating task:', err)
    }
  }

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API}/${id}`)
      setTasks(tasks.filter(t => t._id !== id))
    } catch (err) {
      console.error('Error deleting task:', err)
    }
  }

  const deleteAllTasks = async () => {
    try {
      await Promise.all(tasks.map(task => axios.delete(`${API}/${task._id}`)))
      setTasks([])
    } catch (err) {
      console.error('Error deleting all tasks:', err)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#222]">
      {/* Container for both left and right panels */}
      <div className="flex flex-col md:flex-row w-full h-auto md:h-[80%] md:w-[90%]">
        {/* Left Panel - To-Do List */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#fdf6e3] p-6 md:p-10 font-serif shadow-md rounded-lg">
            <h1 className="text-3xl md:text-4xl font-bold italic text-center mb-6 text-[#2f2f2f]">
              The To-Do List
            </h1>
  
            <label className="block mb-2 text-base md:text-lg font-semibold text-[#2f2f2f]">
              Enter the Task:
            </label>
  
            <div className="flex flex-col sm:flex-row mb-4 gap-2">
              <input
                className="flex-grow border px-4 py-2 rounded text-gray-900 bg-white placeholder-gray-500"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Add a task..."
              />
              <button
                onClick={addTask}
                className="bg-[#5b3e2b] text-white px-4 py-2 rounded hover:bg-[#432e1f] transition"
              >
                Add Task
              </button>
            </div>
  
            {tasks.map(task => (
              <div
                key={task._id}
                className="flex justify-between items-center bg-[#f7f7f7] p-3 mb-2 rounded border"
              >
                <span
                  className={`cursor-pointer break-words ${
                    task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                  }`}
                  onClick={() => toggleTask(task)}
                >
                  {task.title}
                </span>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
  
            {tasks.length > 0 && (
              <button
                onClick={deleteAllTasks}
                className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
              >
                Delete All Tasks
              </button>
            )}
          </div>
        </div>
  
        {/* Right Panel - Info Section */}
        <div className="hidden md:flex w-full md:w-1/2 flex-col items-center justify-center text-center text-white p-10">
          <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
          <p className="text-lg">
            Start managing your tasks efficiently with this To-Do List App.
          </p>
        </div>
      </div>
    </div>
  )
}

export default App

