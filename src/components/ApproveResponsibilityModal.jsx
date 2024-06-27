import React, { useContext, useEffect, useState } from 'react';
import { FiEdit } from 'react-icons/fi';
import '../styles/responsibility-modal.css';
import {
  approveResponsibility,
  approveWholeSeries,
  deleteResponsibility,
  deleteResponsibilitySeries,
} from '../api-calls/api';
import { MainContext } from '../context/context';

function ApproveResponsibilityModal({
  showApproveModal,
  setShowApproveModal,
  currentResponsibility,
  setCurrentResponsibility,
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
  const [difficultyString, setDifficultyString] = useState('');
  const [approved, setApproved] = useState(false);
  const [approvedSeries, setApprovedSeries] = useState(false);
  const [justApprove, setJustApprove] = useState(false);
  const [repeatType, setRepeatType] = useState('none');
  const [repeatDetails, setRepeatDetails] = useState([]);

  useEffect(() => {
    if (showApproveModal) {
      setDifficulty(currentResponsibility.difficulty);
      setTitle(currentResponsibility.title);
      setDescription(currentResponsibility.description);
      setApproved(currentResponsibility.verified);
      updateDifficultyString(currentResponsibility.difficulty);
      setRepeatDetails([]);
    }
  }, [showApproveModal, currentResponsibility]);

  useEffect(() => {
    handleSave();
  }, [approved]);

  useEffect(() => {
    handleSave();
  }, [approvedSeries]);

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

  const handleSave = async () => {
    if (approvedSeries && justApprove) {
      await approveWholeSeries({
        profile: currentResponsibility.profile,
        id: currentResponsibility.id,
        seriesId: currentResponsibility.series.id,
        title,
        description,
        difficulty,
        startDate: currentResponsibility.startDate,
        main,
        approved,
        repeatType,
        repeatDetails,
        justApprove: true,
      });
      setIsEditing(false);
      setApprovedSeries(false);
      setShowApproveModal(false);
      setJustApprove(false);
      return;
    }
    if (repeatType !== 'none' && approvedSeries) {
      let editedResponsibility = await approveWholeSeries({
        profile: currentResponsibility.profile,
        id: currentResponsibility.id,
        seriesId: currentResponsibility.series.id,
        title,
        description,
        difficulty,
        startDate: currentResponsibility.startDate,
        main,
        approved,
        repeatInfo: {
          type: repeatType,
          details: repeatDetails,
        },
      });
      setCurrentResponsibility(editedResponsibility.data);
      setIsEditing(false);
    }
    if (repeatType === 'none' && approved) {
      let editedResponsibility = await approveResponsibility({
        id: currentResponsibility.id,
        title,
        description,
        difficulty,
        main,
        approved,
      });
      setCurrentResponsibility(editedResponsibility.data);
      setIsEditing(false);
    }
    if (approved) {
      setApproved(false);
      setShowApproveModal(false);
    }
    if (approvedSeries) {
      setApprovedSeries(false);
      setShowApproveModal(false);
    }
    setIsEditing(false);
  };

  const handleDelete = async (deleteSeries = false) => {
    if (deleteSeries) {
      await deleteResponsibilitySeries({
        seriesId: currentResponsibility.series.id,
        main,
      });
    } else {
      await deleteResponsibility({
        main: main,
        profileId: currentResponsibility.profile,
        id: currentResponsibility.id,
      });
    }
    setShowApproveModal(false);
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
    return repeatType === 'weekly' ? (
      <div>
        <p style={{ textAlign: 'center' }}>
          Ensure correct days are checked based on repeat details
        </p>
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
    ) : repeatType === 'monthly' ? (
      <div
        style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
      >
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
    ) : null;
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

  if (!showApproveModal) return null;

  return (
    <div
      className="modal-overlay"
      onMouseDown={() => {
        setShowApproveModal(false);
        setIsEditing(false);
      }}
    >
      <div className="modal-content" onMouseDown={(e) => e.stopPropagation()}>
        <p style={{ textAlign: 'center', color: '#1DA1F2' }}>
          Awaiting Your Approval...
        </p>

        <div className="modal-body">
          {capitalizeFirstLetter(currentResponsibility.series.repeat_type) ===
          'None'
            ? 'Repeat: None'
            : `${capitalizeFirstLetter(
                currentResponsibility.series.repeat_type
              )}: `}
          {formatRepeatDays(currentResponsibility)}
          {isEditing ? (
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
              {repeatType === 'none' ? (
                <>
                  <button
                    className="save-btn"
                    onClick={() => {
                      setApproved(true);
                      handleSave();
                    }}
                  >
                    Save changes & approve
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(false)}
                  >
                    Delete this
                  </button>
                </>
              ) : (
                <>
                  {' '}
                  <button
                    className="save-btn"
                    onClick={() => {
                      setApprovedSeries(true);
                      handleSave();
                    }}
                  >
                    Save changes & approve series
                  </button>
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
                </>
              )}
            </>
          ) : (
            <>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
              <p>{difficultyString}</p>
              <button
                className="edit-btn"
                onClick={() => {
                  setIsEditing(true);
                  setRepeatType(currentResponsibility.series.repeat_type);
                }}
              >
                <FiEdit /> Edit
              </button>
              {currentResponsibility.single && (
                <button
                  className="complete-btn"
                  onClick={() => {
                    setApproved(true);
                  }}
                >
                  Mark as approved
                </button>
              )}
              {!currentResponsibility.single && (
                <>
                  {' '}
                  <button
                    className="complete-btn"
                    onClick={() => {
                      setApproved(true);
                    }}
                  >
                    Mark as approved
                  </button>
                  <button
                    className="complete-btn"
                    onClick={() => {
                      setJustApprove(true);
                      setApprovedSeries(true);
                    }}
                  >
                    Approve Series
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ApproveResponsibilityModal;
