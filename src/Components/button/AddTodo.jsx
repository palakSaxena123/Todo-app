import React from 'react';
import { Link } from 'react-router-dom';
import "../button/addTodo.css"

const AddTodo = () => {
  return (
    <>
      <nav>
        <button className='Add-todo-btn'>
          <Link className="btn-txt" to="/todo/add">
            Add Todo
          </Link>
        </button>
      </nav>
    </>
  );
};

export default AddTodo;
