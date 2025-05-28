import React, { useEffect, useState } from 'react';
import Create from './Create';
import './App.css';
import axios from 'axios';
import { BsCircleFill, BsFillCheckCircleFill, BsFillTrashFill, BsPencil } from 'react-icons/bs';

const Home = () => {
    const [todos, setTodos] = useState([]);
    const [updatetask, setUpdatetask] = useState('');
    const [taskid, setTaskid] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/get')
            .then(result => setTodos(result.data))
            .catch(err => console.log(err));
    }, []);

    const edit = (id) => {
        axios.put(`http://localhost:5000/edit/${id}`)
            .then(result => {
                console.log(result.data);
                const updatedTodos = todos.map(todo => {
                    if (todo._id === id) {
                        return { ...todo, done: !todo.done };
                    }
                    return todo;
                });
                setTodos(updatedTodos);
            })
            .catch(err => console.log(err));
    };

    const Update = (id, updatedTask) => {
        axios.put(`http://localhost:5000/update/${id}`, { task: updatedTask })
            .then(result => {
                console.log(result.data);
                const updatedTodos = todos.map(todo => {
                    if (todo._id === id) {
                        return { ...todo, task: updatedTask };
                    }
                    return todo;
                });
                setTodos(updatedTodos);
                setTaskid('');
                setUpdatetask('');
                window.location.reload();
            })
            .catch(err => console.log(err));
    };

    const Hdelete = (id) => {
        axios.delete(`http://localhost:5000/delete/${id}`)
            .then(result => {
                console.log(result.data);
                const updatedTodos = todos.filter(todo => todo._id !== id);
                setTodos(updatedTodos);
            })
            .catch(err => console.log(err));
    };

    return (
        <div className="app-container">
            <div className="todo-wrapper">
                <header className="app-header">
                    <h1 className="app-title">My Tasks</h1>
                    <p className="app-subtitle">Stay organized and productive</p>
                </header>
                
                <div className="create-section">
                    <Create />
                </div>

                <div className="tasks-container">
                    {todos.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📝</div>
                            <h3>No tasks yet</h3>
                            <p>Add your first task to get started!</p>
                        </div>
                    ) : (
                        <div className="tasks-grid">
                            {todos.map((todo) => (
                                <div className={`task-card ${todo.done ? 'completed' : ''}`} key={todo._id}>
                                    <div className="task-content">
                                        <div className="task-checkbox">
                                            {todo.done ? (
                                                <BsFillCheckCircleFill 
                                                    className="check-icon completed" 
                                                    onClick={() => edit(todo._id)}
                                                />
                                            ) : (
                                                <BsCircleFill 
                                                    className="check-icon pending" 
                                                    onClick={() => edit(todo._id)} 
                                                />
                                            )}
                                        </div>
                                        
                                        <div className="task-text">
                                            {taskid === todo._id ? (
                                                <input 
                                                    type="text" 
                                                    value={updatetask} 
                                                    onChange={e => setUpdatetask(e.target.value)}
                                                    className="task-input"
                                                    autoFocus
                                                />
                                            ) : (
                                                <span className={`task-label ${todo.done ? 'completed-text' : ''}`}>
                                                    {todo.task}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="task-actions">
                                        <button 
                                            className="action-btn edit-btn"
                                            onClick={() => {
                                                if (taskid === todo._id) {
                                                    Update(todo._id, updatetask);
                                                } else {
                                                    setTaskid(todo._id);
                                                    setUpdatetask(todo.task);
                                                }
                                            }}
                                            title={taskid === todo._id ? "Save" : "Edit"}
                                        >
                                            <BsPencil />
                                        </button>
                                        <button 
                                            className="action-btn delete-btn"
                                            onClick={() => Hdelete(todo._id)}
                                            title="Delete"
                                        >
                                            <BsFillTrashFill />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;