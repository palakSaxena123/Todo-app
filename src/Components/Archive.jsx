import React from 'react';
import { RxCross2 } from "react-icons/rx";

const Archive = ({ archivedTasks, onClose }) => {
  return (
    <div className='archive-model'>
      <RxCross2 style={{marginLeft:"95%"}}  onClick={onClose}/>
   
      {archivedTasks.map((task, index) => (
        <div key={index} className='archived-label'>
          <p>Task: {task.text}</p>
          <p>Created: {task.created}</p>
          {task.modified && <p>Modified: {task.modified}</p>}
          <p>Status: {task.status ? 'Completed' : 'Pending'}</p>
        </div>
      ))}
    </div>
  );
};

export default Archive;
