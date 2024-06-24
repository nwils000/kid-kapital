import React, { useContext, useEffect, useState } from 'react';
import { FiEdit } from 'react-icons/fi';
import '../styles/responsibility-modal.css';
import {
  completeResponsibility,
  completeWholeSeries,
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
        seriesId: currentResponsibility.series.id,
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
        seriesId: currentResponsibility.series.id,
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

  const completeResponsibilitySeries = async () => {
    try {
      completeWholeSeries({
        main,
        profileId: currentChildId,
        seriesId: currentResponsibility.series.id,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const repeatOptions = () => {
    if (repeatType === 'weekly') {
      return (
        <div>
          <p>Ensure correct days are checked based on repeat details</p>
          {[
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
          ))}
        </div>
      );
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

  function formatRepeatDays(currentResponsibility) {
    const repeatType = currentResponsibility.series.repeat_type;
    const repeatDays = currentResponsibility.series.repeat_days.split(',');

    if (repeatType === 'monthly') {
      return repeatDays.join(', ');
    } else if (repeatType === 'weekly') {
      const dayMap = {
        Sunday: 'Sun',
        Monday: 'Mon',
        Tuesday: 'Tue',
        Wednesday: 'Wed',
        Thursday: 'Thu',
        Friday: 'Fri',
        Saturday: 'Sat',
      };

      const mappedDays = repeatDays.map((day) => dayMap[day]);

      const weekOrder = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      mappedDays.sort((a, b) => weekOrder.indexOf(a) - weekOrder.indexOf(b));

      const formattedDays = mappedDays.join(', ');

      return formattedDays;
    }

    return '';
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

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
        {currentResponsibility.verified && (
          <p
            style={{ fontWeight: '500', textAlign: 'center', color: '#4cb2c2' }}
          >
            Approved
          </p>
        )}

        <div className="modal-body">
          {capitalizeFirstLetter(currentResponsibility.series.repeat_type) ===
          'None'
            ? 'Repeat: None'
            : `${capitalizeFirstLetter(
                currentResponsibility.series.repeat_type
              )}: `}
          {formatRepeatDays(currentResponsibility)}
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
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
              <p>Difficulty: {difficultyString}</p>

              {currentChildId === main.state.profile.id && (
                <>
                  {' '}
                  <button
                    style={{ marginLeft: 0 }}
                    className="complete-btn"
                    onClick={() => {
                      completeResponsibility({
                        id: currentResponsibility.id,
                        main,
                        completed: true,
                      });
                      setShowEditModal(false);
                    }}
                  >
                    Complete
                  </button>
                  {!currentResponsibility.single && (
                    <button
                      style={{ marginLeft: 0 }}
                      className="complete-btn"
                      onClick={() => {
                        completeResponsibilitySeries();
                        setShowEditModal(false);
                      }}
                    >
                      Complete series
                    </button>
                  )}
                </>
              )}
              {(!currentResponsibility.verified ||
                main.state.profile.parent) && (
                <button
                  style={{ marginLeft: 0 }}
                  className="edit-btn"
                  onClick={() => {
                    setIsEditing(true);
                    setRepeatType(currentResponsibility.series.repeat_type);
                  }}
                >
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
