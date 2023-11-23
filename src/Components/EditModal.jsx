import React from 'react'

const EditModal = ({formikEdit,handleSaveEdit,handleInputKeyUp,handleCancelEdit,}) => {
  return (
    <>
    <div className='edit-modal'>
            <form onSubmit={(e) => {e.preventDefault();
              handleSaveEdit(); }}>
              <label>
                <h3>Edit Task</h3>
                <input type='text' name='task' value={formikEdit.values.task} onChange={formikEdit.handleChange}  onKeyUp={handleInputKeyUp} onBlur={formikEdit.handleBlur} />
                {formikEdit.errors.task && formikEdit.touched.task && (
                  <div className="error">{formikEdit.errors.task}</div>
                )}
              </label>
              <label>
                <h3>Status</h3>
                <select className='status' name='status'
                    value={formikEdit.values.status}
                  onChange={formikEdit.handleChange}>
                  <option value='false'>Pending</option>
                  <option value='true'>Completed</option>
                </select>
              </label>
              <div className='button-container'>
                <button type="submit" style={{ backgroundColor: ' #007bff', color: "white" }}>Save</button>
                <button style={{ backgroundColor: 'red', color: "white" }} onClick={handleCancelEdit}>Cancel</button>
              </div>
            </form>
          </div>
    </>
  )
}

export default EditModal;