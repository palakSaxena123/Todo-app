import React from 'react';

const Modal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
   
    <div className="model">
      <label className='model-label'>
        <h3>{title}</h3>
        <p>{message}</p>
        </label>
        <div className='btns'>
          <button style={{backgroundColor:"#007bff"}} onClick={onConfirm}>Confirm</button>
          <button className='deleteCancel' onClick={onClose}>Cancel</button>
        </div>
      </div>
   
  );
};

export default Modal;
