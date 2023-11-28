import React from 'react';
import "../Form/Form.css";

const TodoForm = ({ values, handleChange, handleSubmit}) => {
  // console.log(values);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="input-field">
          <input
            type="text"
            className="Input-bar"
            placeholder="Enter Your Task"
            name="todo"
             value={values?.todo}
            onChange={handleChange}
            // onKeyUp={handleInputKeyUp}
            // onBlur={handleBlur}
          />
          <button className="Add-button" type='submit'>
            Add
          </button>
        </div>

        <div>
        <p>Current Value: {values.todo}</p>
      </div>
        {/* {todoFormik.errors.todo && todoFormik.touched.todo && (
          <div className="error">{todoFormik.errors.todo}</div>
        )} */}
      </form>
    </>
  );
}
export default TodoForm;