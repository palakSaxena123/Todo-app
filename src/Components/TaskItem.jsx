import React from 'react';

const TaskItem = ({ task, index, handleDelete, handleEdit, handleArchive, toggleTaskStatus }) => {
  const { text, created, modified } = task; 

  return (
    <tr key={index}>
      <td data-tip={text} data-full-tip={text}>
        {text.slice(0, 19)}
      </td>
      <td>{new Date(created).toLocaleString()} </td>
      <td>
        {modified
          ? new Date(modified).toLocaleString()
          : new Date(created).toLocaleString()}
      </td>
      <td>{task.status ? 'Completed' : 'Pending'}</td>
      <td style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        <button className='delete-button' onClick={() => handleDelete(index)}> Delete</button>
        <button className='edit-button' onClick={() => handleEdit(index)}> Edit</button>
        {task.status === true ? (
          <button className='toggle-button' onClick={() => handleArchive(index)}> Archive</button>
        ) : (
          <button className='toggle-button' onClick={() => toggleTaskStatus(index)}>Change Status</button>
        )}
      </td>
    </tr>
  );
};
export default TaskItem;
