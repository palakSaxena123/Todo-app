import React, { useEffect, useState} from 'react';
import "../Todo/Todo.css";
import { Tooltip } from 'react-tooltip';
import { BiArchiveIn } from "react-icons/bi";
import {getLocalData} from "../../util/util";
import Table from "../Table/Table";
import Search from '../Search/Search';
import TasksModal from '../Model/TasksModal';
import FormModel from '../Form/FormModel';
import AddTodo from '../button/AddTodo';

const Todo = () => {
  const [state, setState] = useState({
    todos: getLocalData(),
    editIndex: null,
    editedTask: '',
    editedStatus: 'false',
    isEditModalOpen: false,
    deleteIndex: null,
    deleteModalOpen: false,
    isStatusChangeModalOpen: false,
    statusChangeIndex: null,
    searchValue: '',
    filteredTodos: [],
    currentPage: 1,
    postPerPage: 5,
    showArchive: (() => {
      const archiveTask = localStorage.getItem('archivedTasks');
      return archiveTask ? JSON.parse(archiveTask).length : 0;
    })(),
    archivedTasks: [],
    archivedModelOpen: false,
  });
  const {
    todos,editIndex,isEditModalOpen,deleteIndex,deleteModalOpen,isStatusChangeModalOpen,statusChangeIndex,searchValue,filteredTodos,
    currentPage,postPerPage,showArchive,archivedTasks,archivedModelOpen } = state;
  const IndexOflastPage = currentPage * postPerPage;
  const IndexOfFirstpage = IndexOflastPage - postPerPage;
  const Currentposts = filteredTodos.slice(IndexOfFirstpage, IndexOflastPage);

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      filteredTodos: todos,
    }));
    localStorage.setItem('myTodo', JSON.stringify(todos));
  }, [todos]);
 
  useEffect(() => {
    handleSearch();
  }, [todos, searchValue]);

  const handleSearchChange = (value) => {
    setState((prevState) => ({
    ...prevState,
    searchValue: value,
  }));
  };
  function handleDelete(indexonPage) {
    const index = IndexOfFirstpage + indexonPage;
    setState((prevState)=>({
      ...prevState,
      deleteIndex : index,
      deleteModalOpen: true
    }))
  }
  function handleEdit(idOfEdit) {
    const index = IndexOfFirstpage + idOfEdit;
    openEditModal(index);
    const currentTask = todos[index];
    formikEdit.setValues({
      task: currentTask.text,
      status: currentTask.status ? 'true' : 'false',
    });
    setState((prevState)=>({
      ...prevState,
      editIndex :index,
      isEditModalOpen: true
    }))
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
      setState((prevState)=>({
        ...prevState,
        todos : updatedTodos,
        editIndex : null,
        isEditModalOpen :false
      }))
  }
  function handleCancelEdit() {
    setState((prevState)=>({
      ...prevState,
      editIndex : null,
      isEditModalOpen : false
    }))
  }
  function toggleTaskStatus(ToggleId) {
    const index = IndexOfFirstpage + ToggleId;
    setState((prevState)=>({
      ...prevState,
      statusChangeIndex : index,
      isStatusChangeModalOpen : true
    }))
  }
  // const isDuplicateTask = (taskText) => {
  //   return todos.some((item) => item.text === taskText);
  // }
  
  const openEditModal = (index) => {
    setState((prevState)=>({
      ...prevState,
      editIndex : index,
      editedTask : todos[index].text,
      editedStatus : todos[index].status? 'true' : 'false',
      isEditModalOpen : true
    }))
  }
  function handleConfirmDelete() {
    if (deleteIndex !== null) {
      const updatedTodos = [...todos];
      updatedTodos.splice(deleteIndex, 1);
      setState((prevState)=>({
        ...prevState,
        todos : updatedTodos,
        deleteModalOpen : false,
        deleteIndex : null
      }))
    }
  }
  function handleConfirmCancel() {
    setState((prevState)=>({
      ...prevState,
      deleteModalOpen : false
    }))
  }
  function handleConfirmStatusChange() {
    if (statusChangeIndex !== null) {
      const updatedTodos = [...todos];
      updatedTodos[statusChangeIndex].status = !updatedTodos[statusChangeIndex].status;
      updatedTodos[statusChangeIndex].modified = new Date().toISOString();
      setState((prevState)=>({
        ...prevState,
        todos : updatedTodos,
        isStatusChangeModalOpen : false,
        statusChangeIndex : null
      }))
    }}
  function handleCancelStatusChange() {
    setState((prevState)=>({
      ...prevState,
      statusChangeIndex : null,
      isStatusChangeModalOpen : false
    }))
  }
  function handleSearch() {
    setState((prevState) => {
      if (prevState.searchValue === '') {
        return {
          ...prevState,
          filteredTodos: prevState.todos,
        };
      } else {
        const filteredTasks = prevState.todos.filter((task) =>
          task.text.toLowerCase().includes(prevState.searchValue.toLowerCase())
        );
        return {
          ...prevState,
          filteredTodos: filteredTasks,
        };
      }
    });
  }
  function handleArchive(index) {
    setState((prevState) => {
      const updatedTodos = [...prevState.todos];
      const archivedTask = updatedTodos.splice(index, 1)[0];
      return {
        ...prevState,
        todos: updatedTodos,
        archivedTasks: [...prevState.archivedTasks, archivedTask],
        showArchive: prevState.showArchive + 1,
      };
    }, archiveLocalStorageData);
  }
  const archiveLocalStorageData = () => {
    localStorage.setItem('archivedTasks', JSON.stringify(archivedTasks));
  };
  useEffect(() => {
    const archiveTask = localStorage.getItem('archivedTasks');
    if (archiveTask) {
      setState((prevState) => ({
        ...prevState,
        archivedTasks: JSON.parse(archiveTask),
        showArchive: JSON.parse(archiveTask).length,
      }));
    }
  }, []);
  function addToArchive() {
    setState((prevState)=>({
      ...prevState,
      archivedModelOpen: true
    }))
  }
  const handlePageChange = (page) => {
    setState((prevState) => ({ ...prevState, currentPage: page }));
  };
  const { todoFormik: formik, editFormik: formikEdit } = FormModel(todos, handleSaveEdit);
  return (
    <>
       <div className='archive-container'>
        <BiArchiveIn style={{ marginLeft: "300px", marginBottom: "90px", width: "20px", height: "30px" }} onClick={addToArchive} />
          {showArchive > 0 && (
            <span className="archived-count">{showArchive}</span>
          )}
        </div>
        <AddTodo/>
        <Search onChange={handleSearchChange} />
     
        <Table
        todos={todos}
        Currentposts={Currentposts}
        postPerPage={postPerPage}
        currentPage={currentPage}
        setCurrentPage={handlePageChange}
        // handleAdd = {handleAdd}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        handleArchive={handleArchive}
        toggleTaskStatus={toggleTaskStatus}
      />      
      <TasksModal
        formikEdit={formikEdit}
        // handleInputKeyUp={handleInputKeyUp}
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
        setArchivedModelOpen={(value) => setState((prevState) => ({ ...prevState, archivedModelOpen: value }))}
        archiveLocalStorageData={archiveLocalStorageData} 
      />
        <Tooltip place='right' type='dark' effect='solid' />
    </>
  );
};
export default Todo;
