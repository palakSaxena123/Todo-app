import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import "./Todo.css";

const MyTodo = () => {
    const [newTask, setNewTask] = useState("");


    const getLocalData = () => {
        const list = localStorage.getItem("myTodo");
        if (list) {
            const parsedList = JSON.parse(list);
            return parsedList;
        } else {
            return [];
        }
    }

    const [tasks, setTasks] = useState(getLocalData());
    const [editIndex, setEditIndex] = useState(null);
    const [editTask, setEditTask] = useState("");
    const [editStatus, setEditStatus] = useState("false");
    const [isEditModalOpen, setEditModalOpen] = useState(false);

   
    useEffect(() => {
        localStorage.setItem('myTodo', JSON.stringify(tasks));
    }, [tasks]);

    function handleAdd() {
        if (newTask.trim() !== "") {
            setTasks([...tasks, { text: newTask, status: "false" }]);
            setNewTask("");
        }
    }

    function handleDelete(index) {
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
    }

    function handleEdit(index) {
        setEditIndex(index);
        setEditTask(tasks[index].text);
        setEditStatus(tasks[index].status);
        setEditModalOpen(true);
    }

    function SaveEdit() {
        if (editTask.trim() === "") {
            toast.error("Please enter a valid task");
            return;
        }

        const updatedTasks = tasks.map((task, idx) => {
            if (idx === editIndex) {
                return { text: editTask, status: editStatus };
            }
            return task;
        });

        setTasks(updatedTasks);
        setEditIndex(null);
        setEditTask('');
        setEditStatus("false");
        setEditModalOpen(false);
    }

    function CancelEdit() {
        setEditIndex(null);
        setEditTask('');
        setEditModalOpen(false);
    }

    function handleChangeStatus(index) {
        const updatedTasks = tasks.map((task, idx) => {
            if (idx === index) {
                return { ...task, status: task.status === "true" ? "false" : "true" };
            }
            return task;
        });
    
        setTasks(updatedTasks);
    }
    
    return (
        <>
            <div className='container'>
                <input type='text' placeholder='Enter your task' value={newTask} onChange={(e) => setNewTask(e.target.value)} />
                <button onClick={handleAdd}>Add</button>
            </div>
            {
                tasks.map((task, index) => (
                    <div key={index}>
                        <li>{task.text}</li>
                        <td>{task.status ? 'Completed' : 'Pending'}</td>
                        <button onClick={() => handleDelete(index)}>Delete</button>
                        <button onClick={() => handleEdit(index)}>Edit</button>
                        <button onClick={() => handleChangeStatus(index)}>Change Status</button>
                    </div>
                ))
            }

          
        </>
    );
}

export default MyTodo;
