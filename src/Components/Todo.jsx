import React, { useEffect, useState, useMemo } from 'react';
import { useFormik } from 'formik';
import './Todo.css';
import { Tooltip } from 'react-tooltip';
import userSchema from './Validation';
import { BiArchiveIn } from "react-icons/bi";
import {getLocalData} from "../util/util"
import Table from './Table';
import Search from './Search';
import AddTask from './AddTask';
import TasksModal from './TasksModal';

const Todo = () => {
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
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage, setPostPerPage] = useState(5);
  const [showArchive, setShowArchive] = useState(() => {
    const archiveTask = localStorage.getItem('archivedTasks');
    return archiveTask ? JSON.parse(archiveTask).length : 0;
  });
  const [archivedTasks, setArchivedTasks] = useState([]);
  const [archivedModelOpen, setArchivedModelOpen] = useState(false);
  const IndexOflastPage = currentPage * postPerPage;
  const IndexOfFirstpage = IndexOflastPage - postPerPage;
  const Currentposts = filteredTodos.slice(IndexOfFirstpage, IndexOflastPage);

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

  const handleSearchChange = (value) => {
    setSearchValue(value);
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
      modified: false,
    };
    setTodos([...todos, newTask]);
    formik.resetForm();
  }
  function handleDelete(indexonPage) {
    const index = IndexOfFirstpage + indexonPage;
    setDeleteIndex(index);
    setDeleteModalOpen(true);
  }
  function handleEdit(idOfEdit) {
    const index = IndexOfFirstpage + idOfEdit;
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
      idx === editIndex ? {
          ...task,
          text: editedTaskText,
          status: formikEdit.values.status === 'true',
          modified: new Date().toISOString(),
        }  : task 
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
   }}}
  function toggleTaskStatus(ToggleId) {
    const index = IndexOfFirstpage + ToggleId;
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
    }}
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
  function handleArchive(index) {
    const updatedTodos = [...todos];
    const archivedTask = updatedTodos.splice(IndexOfFirstpage + index, 1)[0];
    setTodos(updatedTodos);
    setArchivedTasks([...archivedTasks, archivedTask]);
    setShowArchive(showArchive + 1);
   archiveLocalStorageData();
  }
  const archiveLocalStorageData = () => {
    localStorage.setItem('archivedTasks', JSON.stringify(archivedTasks));
  };
  useEffect(() => {
    const archiveTask = localStorage.getItem('archivedTasks');
    if (archiveTask) {
      setArchivedTasks(JSON.parse(archiveTask)); 
      setShowArchive(JSON.parse(archiveTask).length);
    }
  }, []);
  function addToArchive() {
    setArchivedModelOpen(true);
  }
  return (
    <>
       <div className='container'>
       <AddTask formik={formik} handleInputKeyUp={handleInputKeyUp} handleAdd={handleAdd} />
         <div className='archive-container'>
        <BiArchiveIn style={{ marginLeft: "300px", marginBottom: "90px", width: "20px", height: "30px" }} onClick={addToArchive} />
          {showArchive > 0 && (
            <span className="archived-count">{showArchive}</span>
          )}
        </div>
      </div>
        <Search  onChange={handleSearchChange}  />
        <Table
        todos={todos}
        Currentposts={Currentposts}
        postPerPage={postPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        handleArchive={handleArchive}
        toggleTaskStatus={toggleTaskStatus}
      />      
      <TasksModal
        formikEdit={formikEdit}
        handleInputKeyUp={handleInputKeyUp}
        handleDelete={handleDelete}
        handleSaveEdit={handleSaveEdit}
        handleCancelEdit={handleCancelEdit}
        isEditModalOpen={isEditModalOpen}
        deleteModalOpen={deleteModalOpen}
        isStatusChangeModalOpen={isStatusChangeModalOpen}
        statusChangeIndex={statusChangeIndex}
        handleConfirmDelete={handleConfirmDelete}
        handleConfirmCancel={handleConfirmCancel}
        handleConfirmStatusChange={handleConfirmStatusChange}
        handleCancelStatusChange={handleCancelStatusChange}
        archivedModelOpen={archivedModelOpen}
        archivedTasks={archivedTasks} 
        setArchivedModelOpen={setArchivedModelOpen} 
        archiveLocalStorageData={archiveLocalStorageData} 
      />
        <Tooltip place='right' type='dark' effect='solid' />
    </>
  );
};
export default Todo;