import React, { useEffect, useState } from 'react';
import '../styles/responsibility-modal.css';

function AddResponsibilityModal({
  showAddResponsibilityModal,
  setShowAddResponsibilityModal,
  addResponsibility,
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState(0);

  const handleSubmit = () => {
    addResponsibility({
      title,
      description,
      difficulty,
    });
    setShowAddResponsibilityModal(false);
  };

  useEffect(() => {
    setTitle('');
    setDescription('');
    setDifficulty(0);
  }, [showAddResponsibilityModal]);

  if (!showAddResponsibilityModal) return null;

  return (
    <div
      className="modal-overlay"
      onClick={() => setShowAddResponsibilityModal(false)}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="close-btn"
          onClick={() => setShowAddResponsibilityModal(false)}
        >
          X
        </button>
        <div>
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
          <label>Difficulty:</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(Number(e.target.value))}
          >
            <option value={0}>Too Easy</option>
            <option value={1}>Very Easy</option>
            <option value={2}>Easy</option>
            <option value={3}>Medium</option>
            <option value={4}>Hard</option>
            <option value={5}>Very Hard</option>
            <option value={6}>Extremely Hard</option>
          </select>
          <button onClick={handleSubmit}>Add Responsibility</button>
        </div>
      </div>
    </div>
  );
}

export default AddResponsibilityModal;
