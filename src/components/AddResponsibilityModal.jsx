import React, { useState } from 'react';
import '../styles/responsibility-modal.css';

function AddResponsibilityModal({
  showAddResponsibilityModal,
  setShowAddResponsibilityModal,
  addResponsibility,
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    addResponsibility(title, description);
    setShowAddResponsibilityModal(false);
  };

  if (!showAddResponsibilityModal) return null;

  return (
    <div
      className="modal-overlay"
      onClick={() => setShowAddResponsibilityModal(false)}
    >
      <div className="modal-content">
        <button
          className="close-btn"
          onClick={() => setShowAddResponsibilityModal(false)}
        >
          X
        </button>
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <button onClick={handleSubmit}>Add Responsibility</button>
        </div>
      </div>
    </div>
  );
}

export default AddResponsibilityModal;
