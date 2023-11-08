import React, { useEffect, useState, useMemo } from 'react';
import { useFormik } from 'formik';
import './Todo.css';
import { Tooltip } from 'react-tooltip';
import Modal from './Model';
import debouce from 'lodash.debounce';
import userSchema from './Validation';
import Pagination from './Pagination';
// import * as Yup from 'yup';

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
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage, setPostPerPage] = useState(5);

  const IndexOflastPage = currentPage * postPerPage;
  const IndexOfFirstpage = IndexOflastPage - postPerPage;
  const Currentpost = todos.slice(IndexOfFirstpage, IndexOflastPage)

  const formik = useFormik({
    initialValues: {
      todo: '',
    },
    validationSchema: userSchema(todos),
    onSubmit: (values) => {
      if (isDuplicateTask(values.todo)) {
        formik.setFieldError('todo', 'This task already exists');
        return;
      }
      handleAdd();

    },
  });

  const formikEdit = useFormik({
    initialValues: {
      task: '',
      status: 'false',
    },
    validationSchema: userSchema(todos),
    onSubmit: (values) => {
      if (isDuplicateTask(values.task)) {
        formikEdit.setFieldError('task', 'This task already exists');
        return;
      }
      handleSaveEdit(values);
    },

  });

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


  function handleAdd() {
    const newTaskText = formik.values.todo.trim();
    if (newTaskText === '') {
      formik.setFieldError('todo', 'Todo is required');
      return;
    }

    if (isDuplicateTask(newTaskText)) {
      formik.setFieldError('todo', 'This task already exists');
      return;
    }

    const newTask = {
      text: newTaskText,
      status: false,
      created: new Date().toISOString(),
      modified: null,
    };

    setTodos([...todos, newTask]);
    formik.resetForm();
  }

  const debouncedResults = useMemo(() => {
    return debouce(handleChange, 300);
  }, []);

  function handleDelete(index) {
    setDeleteIndex(index);
    setDeleteModalOpen(true);
  }

  // function handleEdit(index) {
  //   openEditModal(index);
  //   setEditedTask(todos[index].text);
  //   setEditedStatus(todos[index].status ? 'true' : 'false');
  //   setEditModalOpen(true);
  // }
  function handleEdit(index) {
    openEditModal(index);
    const currentTask = todos[index];
    formikEdit.setValues({
      task: currentTask.text,
      status: currentTask.status ? 'true' : 'false',
    });

    setEditIndex(index);
    setEditModalOpen(true);
  }
  function handleSaveEdit() {
    const editedTaskText = formikEdit.values.task.trim();

    if (editedTaskText === '') {
      formikEdit.setFieldError('task', 'Task cannot be empty');
      return;
    }

    const isDuplicate = todos.some((task, idx) => {
      return idx !== editIndex && task.text === editedTaskText;
    });

    if (isDuplicate) {
      formikEdit.setFieldError('task', 'This task already exists');
      return;
    }


    const updatedTodos = todos.map((task, idx) =>
      idx === editIndex
        ? {
          ...task,
          text: editedTaskText,
          status: formikEdit.values.status === 'true',
          modified: new Date().toISOString(),
        }
        : task
    );

    setTodos(updatedTodos);
    setEditIndex(null);
    setEditModalOpen(false);
  }

  function handleCancelEdit() {
    setEditIndex(null);
    setEditModalOpen(false);
  }
  const handleInputKeyUp = (event) => {
    if (event.key === 'Enter') {
      const trimmedValue = formik.values.todo.trim();
      if (trimmedValue !== '') {
        handleAdd();
      }
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
  function handleCancelStatusChange() {
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
        <form onSubmit={formik.handleSubmit}>
          <div className='input-field'>
            <input
              type='text'
              className='Input-bar'
              placeholder='Enter Your Task'
              name='todo'
              value={formik.values.todo}
              onChange={formik.handleChange}
              onKeyUp={handleInputKeyUp}
              onBlur={formik.handleBlur}
            />
            <button className='Add-button' type="submit">
              Add
            </button>
          </div>
          {formik.errors.todo && formik.touched.todo && (
            <div className="error">{formik.errors.todo}</div>
          )}
        </form>
      </div>
      <div className='Search-box'>
        <input
          className='Search-input'
          type='text'
          placeholder='Search Task'
          onChange={debouncedResults}
        />
        <div className='Table'>
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
   
              {Currentpost .map((item, index) => (
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
                  <td style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                  }}>
                    <button className='delete-button' onClick={() => handleDelete(index)}>
                      Delete
                    </button>
                    <button className='edit-button' onClick={() => handleEdit(index)}>
                      Edit
                    </button>
                    <button className='toggle-button' onClick={() => toggleTaskStatus(index)}>
                      Change Status
                    </button>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
          <Pagination
        postPerPage={postPerPage}
        totalPage={todos.length}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
        </div>
        {isEditModalOpen && (
          <div className='edit-modal'>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSaveEdit();
            }}>
              <label>
                <h3>Edit Task</h3>
                <input
                  type='text'
                  name='task'
                  value={formikEdit.values.task}
                  onChange={formikEdit.handleChange}
                  onKeyUp={handleInputKeyUp}
                  onBlur={formikEdit.handleBlur}
                />
                {formikEdit.errors.task && formikEdit.touched.task && (
                  <div className="error">{formikEdit.errors.task}</div>
                )}
              </label>
              <label>
                <h3>Status</h3>
                <select
                  className='status'
                  name='status'
                  value={formikEdit.values.status}
                  onChange={formikEdit.handleChange}
                >
                  <option value='false'>Pending</option>
                  <option value='true'>Completed</option>
                </select>
              </label>
              <div className='button-container'>
                <button type="submit">Save</button>
                <button style={{ backgroundColor: 'red' }} onClick={handleCancelEdit}>
                  Cancel
                </button>
              </div>
            </form>
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
      </div>
    </>
  );
};

export default Todo;