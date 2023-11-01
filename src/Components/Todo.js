import React, { useEffect, useState , useMemo} from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Todo.css';
import { Tooltip } from 'react-tooltip';
import Modal from './Model';
import debouce from "lodash.debounce";

const Todo = () => {
  const [todo, setTodo] = useState('');

  const getLocalData = () => {
    const list = localStorage.getItem('myTodo');
    if (list) {
      const parsedList = JSON.parse(list);
      return parsedList;
    } else {
      return [];
    }
  };

  const [todos, setTodos] = useState(getLocalData());
  const [editIndex, setEditIndex] = useState(null);
  const [editedTask, setEditedTask] = useState('');
  const [editedStatus, setEditedStatus] = useState('false');
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isStatusChangeModalOpen, setStatusChangeModalOpen] = useState(false);
  const [statusChangeIndex, setStatusChangeIndex] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [filteredTodos, setFilteredTodos] = useState([]);

  useEffect(() => {
    setFilteredTodos(todos); 
    localStorage.setItem('myTodo', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    handleSearch(); 
  }, [todos, searchValue]);

  const handleChange = (e) => {
    setSearchValue(e.target.value);
  };


  const debouncedResults = useMemo(() => {
    return debouce(handleChange, 300);
  }, []);
  
  // useEffect(() => {
  //   return () => {
  //     debouncedResults.cancel();
  //   };
  // });

  function handleAdd() {
    if (todo.trim() === '') {
      toast.error('Please enter a valid task');
      return;
    }
    if (isDuplicateTask(todo)) {
      toast.error('This task already exists.');
      return;
    }

    const newTask = {
      text: todo,
      status: false,
      created: new Date().toISOString(),
      modified: null,
    };

    setTodos([...todos, newTask]);
    setTodo('');
  }

  function handleDelete(index) {
    setDeleteIndex(index);
    setDeleteModalOpen(true);
  }

  function handleEdit(index) {
    openEditModal(index);
    setEditedTask(todos[index].text);
    setEditedStatus(todos[index].status ? 'true' : 'false');
    setEditModalOpen(true);
  }

  function handleSaveEdit() {
    if (editedTask.trim() === '') {
      toast.error('Please enter a valid task');
      return;
    }
    const updatedTodos = todos.map((task, idx) =>
      idx === editIndex
        ? {
            ...task,
            text: editedTask,
            status: editedStatus === 'true',
            modified: new Date().toISOString(),
          }
        : task
    );
    setTodos(updatedTodos);
    setEditIndex(null);
    setEditedTask('');
    setEditedStatus('false');
    setEditModalOpen(false);
  }

  function handleCancelEdit() {
    setEditIndex(null);
    setEditedTask('');
    setEditedStatus('false');
    setEditModalOpen(false);
  }

  const handleInputKeyUp = (event) => {
    if (event.key === 'Enter') {
      handleAdd();
    }
  }

  function toggleTaskStatus(index) {
    setStatusChangeIndex(index);
    setStatusChangeModalOpen(true);
  }

  const isDuplicateTask = (taskText) => {
    return todos.some((item) => item.text === taskText);
  }

  const openEditModal = (index) => {
    setEditIndex(index);
    setEditedTask(todos[index].text);
    setEditedStatus(todos[index].status ? 'true' : 'false');
    setEditModalOpen(true);
  }

  const closeEditModal = () => {
    setEditModalOpen(false);
  }

  function handleConfirmDelete() {
    if (deleteIndex !== null) {
      const updatedTodos = [...todos];
      updatedTodos.splice(deleteIndex, 1);
      setTodos(updatedTodos);
      setDeleteModalOpen(false);
      setDeleteIndex(null);
    }
  }

  function handleConfirmCancel() {
    setDeleteModalOpen(false);
  }

  function handleConfirmStatusChange() {
    if (statusChangeIndex !== null) {
      const updatedTodos = [...todos];
      updatedTodos[statusChangeIndex].status = !updatedTodos[statusChangeIndex].status;
      updatedTodos[statusChangeIndex].modified = new Date().toISOString();
      setTodos(updatedTodos);
      setStatusChangeModalOpen(false);
      setStatusChangeIndex(null);
    }
  }

  function handleCancelStatusChange(){
    setStatusChangeModalOpen(false);
    setStatusChangeIndex(null);
  }

  function handleSearch() {
    if (searchValue === '') {
      setFilteredTodos(todos);  
    } else {
      const filteredTasks = todos.filter((task) =>
        task.text.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredTodos(filteredTasks);
    }
  }
  
  return (
    <>
      <div className='container'>
        <input
          type='text'
          placeholder='Enter Your Task'
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          onKeyUp={handleInputKeyUp}
        />
        <button className='Add-button' onClick={handleAdd}>Add
        </button>
      </div>
      <div className='Search-box'>
      <input
        className='Search-input'
        type='text'
        placeholder='Search Task'
        // value={searchValue}
        onChange={debouncedResults} 
        
      />
    
      <table className='list-container'>
        <thead>
          <tr>
            <th className='header-cell'>Task</th>
            <th className='header-cell'>Created</th>
            <th className='header-cell'>Modified</th>
            <th className='header-cell'>Status</th>
            <th className='header-cell'>Action</th>
          </tr>
        </thead>
        <tbody className='table-body'>
          {filteredTodos.map((item, index) => (
            <tr key={index}>
              <td data-tip={item.text} data-full-tip={item.text}>
                {item.text.slice(0, 19)}
              </td>
              <td>{new Date(item.created).toLocaleString()} </td>
              <td>
                {item.modified
                  ? new Date(item.modified).toLocaleString()
                  : new Date(item.created).toLocaleString()}
              </td>
              <td>{item.status ? 'Completed' : 'Pending'}</td>
              <tr>
                <td>
                  <button className='delete-button' onClick={() => handleDelete(index)}>
                    Delete
                  </button>
                </td>
                <td>
                  <button className='edit-button' onClick={() => handleEdit(index)}>
                    Edit
                  </button>
                </td>
                <td>
                  <button className='toggle-button' onClick={() => toggleTaskStatus(index)}>
                    Change Status
                  </button>
                </td>
              </tr>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      {isEditModalOpen && (
        <div className='edit-modal'>
          <label>
            <h3>Edit Task</h3>
            <input type='text' value={editedTask} onChange={(e) => setEditedTask(e.target.value)} />
          </label>
          <label>
            <h3>Status</h3>
            <select
              className='status'
              value={editedStatus}
              onChange={(e) => setEditedStatus(e.target.value)}
            >
              <option value='false'>Pending</option>
              <option value='true'>Completed</option>
            </select>
          </label>
          <div className='button-container'>
            <button style={{ backgroundColor: ' #007bff' }} onClick={handleSaveEdit}>Save</button>
            <button style={{ backgroundColor: 'red' }} onClick={handleCancelEdit}>
              Cancel
            </button>
          </div>
        </div>
      )}
      {deleteModalOpen && (
        <Modal
          isOpen={deleteModalOpen}
          onClose={handleConfirmCancel}
          onConfirm={handleConfirmDelete}
          title='Delete Task'
          message='Are you sure you want to delete this task?'
        />
      )}
      {isStatusChangeModalOpen && (
        <Modal
          isOpen={isStatusChangeModalOpen}
          onClose={handleCancelStatusChange}
          onConfirm={handleConfirmStatusChange}
          title='Change Status'
          message='Are you sure you want to change the status of this task?'
        />
      )}
      <Tooltip place='right' type='dark' effect='solid' />
    </>
  );
};

export default Todo;

