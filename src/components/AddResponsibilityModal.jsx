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
  const [repeatType, setRepeatType] = useState('none');
  const [repeatDetails, setRepeatDetails] = useState([]);

  const handleRepeatDetailsChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setRepeatDetails([...repeatDetails, value]);
    } else {
      setRepeatDetails(repeatDetails.filter((day) => day !== value));
    }
  };

  const repeatOptions = () => {
    switch (repeatType) {
      case 'weekly':
        return [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ].map((day) => (
          <label key={day}>
            <input
              type="checkbox"
              value={day}
              checked={repeatDetails.includes(day)}
              onChange={handleRepeatDetailsChange}
            />{' '}
            {day}
          </label>
        ));
      case 'monthly':
        return Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
          <label key={day}>
            <input
              type="checkbox"
              value={day}
              checked={repeatDetails.includes(String(day))}
              onChange={handleRepeatDetailsChange}
            />{' '}
            {day}
          </label>
        ));
      default:
        return null;
    }
  };

  const handleSubmit = () => {
    addResponsibility({
      title,
      description,
      difficulty,
      repeat: { type: repeatType, details: repeatDetails },
    });
    setShowAddResponsibilityModal(false);
  };

  useEffect(() => {
    setTitle('');
    setDescription('');
    setDifficulty(0);
    setRepeatType('none');
    setRepeatDetails([]);
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
          <label>Repeat:</label>
          <select
            value={repeatType}
            onChange={(e) => setRepeatType(e.target.value)}
          >
            <option value="none">Do not repeat</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          {repeatOptions()}
          <button onClick={handleSubmit}>Add Responsibility</button>
        </div>
      </div>
    </div>
  );
}

export default AddResponsibilityModal;
