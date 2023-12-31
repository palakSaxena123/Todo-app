import React from 'react';
import './Pagination.css';

const Pagination = ({ postPerPage, totalPage, currentPage, setCurrentPage }) => {
  const showPagination = totalPage > 0;

  if (!showPagination) {
    return null;
  }

  return (
    <>
      <div className='pagination-container'>
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} >
          Previous
        </button>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === Math.ceil(totalPage / postPerPage)}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default Pagination;