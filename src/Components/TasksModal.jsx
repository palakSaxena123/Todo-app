import React from 'react';
import EditModal from './EditModal';
import Modal from './Model';
import Archive from './Archive';

const TasksModal = ({ 
    formikEdit,
    handleInputKeyUp,
    handleSaveEdit,
    handleCancelEdit,
    isEditModalOpen,
    deleteModalOpen,
    isStatusChangeModalOpen,
    handleConfirmDelete,
    handleConfirmCancel,
    handleConfirmStatusChange,
    handleCancelStatusChange,
    archivedModelOpen,
    setArchivedModelOpen,
    archiveLocalStorageData,
    archivedTasks
      }) => {
  return (
    <div>
        {isEditModalOpen && (
          <EditModal
          formikEdit={formikEdit}
          handleInputKeyUp={handleInputKeyUp}
          handleSaveEdit={handleSaveEdit}
          handleCancelEdit={handleCancelEdit}
          />       
        )}
        {deleteModalOpen && (
          <Modal
            isOpen={deleteModalOpen}
            onClose={handleConfirmCancel}
            onConfirm={handleConfirmDelete}
            title='Delete Task'
            message='Are you sure you want to delete this task?'
          />
        )}
        {isStatusChangeModalOpen && (
          <Modal
            isOpen={isStatusChangeModalOpen}
            onClose={handleCancelStatusChange}
            onConfirm={handleConfirmStatusChange}
            title='Change Status'
            message='Are you sure you want to change the status of this task?'
          />
        )}
      {archivedModelOpen && archivedTasks.length > 0 && (
        <Archive
          archivedTasks={archivedTasks}
          archivedModelOpen={archivedModelOpen}
          onClose={() => {
            setArchivedModelOpen(false);
            archiveLocalStorageData();
          }}
        />
      )}
    </div>
  )
}
export default TasksModal;