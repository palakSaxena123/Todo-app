import React from 'react';
import debouce from 'lodash.debounce';

const Search = ({ onChange }) => {
  const debouncedChange = debouce(onChange, 300);

  const handleChange = (e) => {
    debouncedChange(e.target.value);
  };

  return (
    <div className='Search-box'>
      <input className='Search-input' type='text' placeholder='Search Task' onChange={handleChange} />
    </div>
  );
};

export default Search;
