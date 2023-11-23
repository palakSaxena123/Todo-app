import React from 'react';

const AddTask = ({ formik, handleInputKeyUp}) => {
  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="input-field">
        <input
          type="text"
          className="Input-bar"
          placeholder="Enter Your Task"
          name="todo"
          value={formik.values.todo}
          onChange={formik.handleChange}
          onKeyUp={handleInputKeyUp}
          onBlur={formik.handleBlur}
        />
        <button className="Add-button" type="submit">
          Add
        </button>
      </div>
      {formik.errors.todo && formik.touched.todo && (
        <div className="error">{formik.errors.todo}</div>
      )}
    </form>
  );
};

export default AddTask;
