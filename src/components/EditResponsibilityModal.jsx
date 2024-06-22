import React, { useContext, useEffect, useState } from 'react';
import { FiEdit } from 'react-icons/fi';
import '../styles/responsibility-modal.css';
import {
  completeResponsibility,
  deleteResponsibilitySeries,
  editResponsibilitySeries,
} from '../api-calls/api';
import { MainContext } from '../context/context';

function EditResponsibilityModal({
  showEditModal,
  setShowEditModal,
  currentResponsibility,
  editResponsibility,
  handleDeleteResponsibility,
  parentalControl,
  currentChildId,
}) {
  const { main } = useContext(MainContext);

  const [title, setTitle] = useState(currentResponsibility.title);
  const [description, setDescription] = useState(
    currentResponsibility.description
  );
  const [isEditing, setIsEditing] = useState(false);
  const [difficulty, setDifficulty] = useState(
    currentResponsibility.difficulty || 0
  );
  const [repeatType, setRepeatType] = useState('none');
  const [repeatDetails, setRepeatDetails] = useState([]);
  const [difficultyString, setDifficultyString] = useState('');

  useEffect(() => {
    console.log(currentResponsibility);
  }, [currentResponsibility]);

  useEffect(() => {
    if (showEditModal) {
      setDifficulty(currentResponsibility.difficulty);
      setTitle(currentResponsibility.title);
      setDescription(currentResponsibility.description);
      updateDifficultyString(currentResponsibility.difficulty);
      setRepeatType('none');
      setRepeatDetails([]);
    }
  }, [showEditModal, currentResponsibility]);

  const updateDifficultyString = (difficultyLevel) => {
    const difficulties = [
      'Too Easy',
      'Very Easy',
      'Easy',
      'Medium',
      'Hard',
      'Very Hard',
      'Extremely Hard',
    ];
    setDifficultyString(difficulties[difficultyLevel] || '');
  };

  useEffect(() => {
    updateDifficultyString(difficulty);
  }, [difficulty]);

  const handleSubmit = () => {
    editResponsibility({
      id: currentResponsibility.id,
      title,
      description,
      difficulty,
      completed: currentResponsibility.completed,
    });
    setIsEditing(false);
  };

  const handleDelete = async (deleteSeries = false) => {
    if (deleteSeries) {
      console.log(currentResponsibility);
      await deleteResponsibilitySeries({
        seriesId: currentResponsibility.series,
        main,
      });
      setIsEditing(false);
      setShowEditModal(false);
    } else {
      handleDeleteResponsibility(
        currentResponsibility.id,
        currentResponsibility.profile
      );
    }
    setIsEditing(false);
    setShowEditModal(false);
  };

  const handleEditTheSeries = async () => {
    if (repeatType === 'none') {
      alert('You have to select days for this responsibility to repeat');
    } else {
      await editResponsibilitySeries({
        seriesId: currentResponsibility.series,
        main,
        title,
        startDate: currentResponsibility.startDate,
        repeatInfo: {
          type: repeatType,
          details: repeatDetails,
        },
        description,
        difficulty,
        verified: currentResponsibility.verified,
        profileId: currentResponsibility.profile,
      });
    }
    setIsEditing(false);
  };

  const handleRepeatDetailsChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setRepeatDetails([...repeatDetails, value]);
    } else {
      setRepeatDetails(repeatDetails.filter((day) => day !== value));
    }
  };

  const repeatOptions = () => {
    if (repeatType === 'weekly') {
      return [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ].map((day) => (
        <label key={day} className="day-checkbox">
          <input
            type="checkbox"
            value={day}
            checked={repeatDetails.includes(day)}
            onChange={handleRepeatDetailsChange}
          />
          {day}
        </label>
      ));
    } else if (repeatType === 'monthly') {
      return (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {' '}
          {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
            <label key={day} className="day-checkbox">
              <input
                type="checkbox"
                value={day.toString()}
                checked={repeatDetails.includes(day.toString())}
                onChange={handleRepeatDetailsChange}
              />
              {day}
            </label>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!showEditModal) return null;

  const modalClass = currentResponsibility.verified
    ? 'modal-content verified'
    : 'modal-content';

  return (
    <div
      className="modal-overlay"
      onMouseDown={() => {
        setIsEditing(false);
        setShowEditModal(false);
      }}
    >
      <div className={modalClass} onMouseDown={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={() => setShowEditModal(false)}>
          X
        </button>
        <div className="modal-body">
          {isEditing &&
          (!currentResponsibility.verified || main.state.profile.parent) ? (
            <>
              <input
                className="title-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
              />
              <textarea
                className="description-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
              />
              <select
                className="difficulty-select"
                value={difficulty}
                onChange={(e) => setDifficulty(Number(e.target.value))}
              >
                {[
                  'Too Easy',
                  'Very Easy',
                  'Easy',
                  'Medium',
                  'Hard',
                  'Very Hard',
                  'Extremely Hard',
                ].map((option, index) => (
                  <option key={index} value={index}>
                    {option}
                  </option>
                ))}
              </select>
              <select
                className="repeat-type-select"
                value={repeatType}
                onChange={(e) => setRepeatType(e.target.value)}
              >
                <option value="none">Do not repeat</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              {repeatOptions()}

              {repeatType !== 'none' && !currentResponsibility.single ? (
                <div>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(false)}
                  >
                    Delete this
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(true)}
                  >
                    Delete series
                  </button>
                  <button className="edit-btn" onClick={handleEditTheSeries}>
                    Apply changes to series
                  </button>
                </div>
              ) : repeatType !== 'none' && currentResponsibility.single ? (
                <div>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(false)}
                  >
                    Delete
                  </button>
                  <button className="edit-btn" onClick={handleEditTheSeries}>
                    Save changes
                  </button>
                </div>
              ) : repeatType === 'none' && !currentResponsibility.single ? (
                <div>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(false)}
                  >
                    Delete this
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(true)}
                  >
                    Delete series
                  </button>
                  <button className="edit-btn" onClick={handleSubmit}>
                    Save changes
                  </button>
                </div>
              ) : (
                <div>
                  <button className="save-btn" onClick={handleSubmit}>
                    Save changes
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(false)}
                  >
                    delete
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <h3>{title}</h3>
              <p>{description}</p>
              <p>{difficultyString}</p>

              {currentChildId === main.state.profile.id && (
                <button
                  className="complete-btn"
                  onClick={() =>
                    completeResponsibility({
                      id: currentResponsibility.id,
                      main,
                      completed: true,
                    })
                  }
                >
                  Mark as Completed
                </button>
              )}
              {(!currentResponsibility.verified ||
                main.state.profile.parent) && (
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                  <FiEdit /> Edit
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditResponsibilityModal;
