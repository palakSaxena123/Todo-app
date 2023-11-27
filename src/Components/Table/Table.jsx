import React from 'react';
import TaskItem from '../TaskItem/TaskItem';
import Pagination from '../Pagination/Pagination';
import "../Table/table.css";

const Table = ({ todos, Currentposts, postPerPage, currentPage, setCurrentPage, handleDelete, handleEdit, handleArchive, toggleTaskStatus }) => {
  return (
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
          {Currentposts.map((item, index) => (
            <TaskItem
              key={index}
              task={item}
              index={index}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
              handleArchive={handleArchive}
              toggleTaskStatus={toggleTaskStatus}
            />
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
  );
};

export default Table;
