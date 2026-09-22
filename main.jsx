import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('tasks')) || []
    } catch {
      return []
    }
  })
  const [text, setText] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  function addTask(e) {
    e.preventDefault()
    const title = text.trim()
    if (!title) return
    setTasks([{ id: Date.now(), title, completed: false }, ...tasks])
    setText('')
  }

  function toggleTask(id) {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  function deleteTask(id) {
    setTasks(tasks.filter(t => t.id !== id))
  }

  const visibleTasks = tasks.filter(task =>
    filter === 'all' ? true :
    filter === 'active' ? !task.completed :
    task.completed
  )

  const completed = tasks.filter(t => t.completed).length

  return (
    <main className="app">
      <section className="card">
        <header>
          <p className="eyebrow">React Project</p>
          <h1>Task Manager</h1>
          <p className="subtitle">A simple task tracker built with React and localStorage.</p>
        </header>

        <form onSubmit={addTask} className="task-form">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Enter a new task..."
            aria-label="New task"
          />
          <button type="submit">Add Task</button>
        </form>

        <div className="toolbar">
          <div className="filters">
            {['all', 'active', 'completed'].map(item => (
              <button
                key={item}
                type="button"
                className={filter === item ? 'selected' : ''}
                onClick={() => setFilter(item)}
              >
                {item[0].toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>
          <span>{completed}/{tasks.length} completed</span>
        </div>

        <ul className="task-list">
          {visibleTasks.length === 0 ? (
            <li className="empty">No tasks here. Add one above.</li>
          ) : visibleTasks.map(task => (
            <li key={task.id} className={task.completed ? 'done' : ''}>
              <label>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />
                <span>{task.title}</span>
              </label>
              <button type="button" className="delete" onClick={() => deleteTask(task.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>
)
