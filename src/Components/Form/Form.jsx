import React from 'react';
import { FormikData } from "./FormModel";
import "../Form/Form.css";

const Form = ({ isDuplicateTask, handleAdd }) => {
  const { todoFormik, handleInputKeyUp } = FormikData(isDuplicateTask, handleAdd);


  return (
    <>
      <form onSubmit={todoFormik.handleSubmit}>
        <div className="input-field">
          <input
            type="text"
            className="Input-bar"
            placeholder="Enter Your Task"
            name="todo"
            value={todoFormik.values.todo}
            onChange={todoFormik.handleChange}
            onKeyUp={handleInputKeyUp}
            onBlur={todoFormik.handleBlur}
          />
          <button className="Add-button"  type='submit'>
            Add
          </button>
        </div>
        {todoFormik.errors.todo && todoFormik.touched.todo && (
          <div className="error">{todoFormik.errors.todo}</div>
        )}
      </form>
    </>
  );
}

export default Form;