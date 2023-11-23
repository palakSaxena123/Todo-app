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
          <button style={{backgroundColor:"#007bff",color:"white" ,padding: "8px 12px",border:"none"}} onClick={onConfirm}>Confirm</button>
          <button style={{color:"white", padding: "8px 12px",border:"none"}}className='deleteCancel' onClick={onClose}>Cancel</button>
        </div>
      </div>
  );
};
export default Modal;
