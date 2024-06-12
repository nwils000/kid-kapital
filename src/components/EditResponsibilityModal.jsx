import React, { useContext, useEffect, useState } from 'react';
import { FiEdit } from 'react-icons/fi';
import '../styles/responsibility-modal.css';
import { completeResponsibility, fetchUser } from '../api-calls/api';
import { MainContext } from '../context/context';

function EditResponsibilityModal({
  showEditModal,
  setShowEditModal,
  currentResponsibility,
  setCurrentResponsibility,
  editResponsibility,
  handleDeleteResponsibility,
}) {
  const { main } = useContext(MainContext);

  const [title, setTitle] = useState(currentResponsibility.title);
  const [description, setDescription] = useState(
    currentResponsibility.description
  );
  const [isEditing, setIsEditing] = useState(false);
  const [difficulty, setDifficulty] = useState(0);
  const [difficultyString, setDifficultyString] = useState('');
  const [completed, setCompleted] = useState(false);

  const completeIt = async (complete) => {
    try {
      let editedResponsibility = await completeResponsibility({
        id: currentResponsibility.id,
        main,
        completed: complete,
      });

      fetchUser({ accessToken: main.state.accessToken, main });
      setCurrentResponsibility(editedResponsibility.data);
      setCompleted(editedResponsibility.data.completed);
      setIsEditing(false);
      setShowEditModal(false);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (showEditModal) {
      setDifficulty(currentResponsibility.difficulty);
      setTitle(currentResponsibility.title);
      setDescription(currentResponsibility.description);
      setCompleted(currentResponsibility.completed);
      switch (currentResponsibility.difficulty) {
        case 0:
          setDifficultyString('Too Easy');
          break;
        case 1:
          setDifficultyString('Very Easy');
          break;
        case 2:
          setDifficultyString('Easy');
          break;
        case 3:
          setDifficultyString('Medium');
          break;
        case 4:
          setDifficultyString('Hard');
          break;
        case 5:
          setDifficultyString('Very Hard');
          break;
        case 6:
          setDifficultyString('Extremely Hard');
          break;
      }
    }
  }, [showEditModal, currentResponsibility]);

  const handleSubmit = () => {
    editResponsibility({
      id: currentResponsibility.id,
      title,
      description,
      difficulty,
      completed,
    });

    setIsEditing(false);
  };

  const handleDelete = () => {
    handleDeleteResponsibility(currentResponsibility.id);
    setShowEditModal(false);
  };

  if (!showEditModal) return null;

  const modalClass = currentResponsibility.verified
    ? 'modal-content verified'
    : 'modal-content';

  return (
    <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
      <div className={modalClass} onClick={(e) => e.stopPropagation()}>
        {currentResponsibility.verified ? (
          <p style={{ color: 'rgb(49, 154, 199)', textAlign: 'center' }}>
            Parent approved
          </p>
        ) : (
          <p style={{ color: 'rgb(49, 154, 199)', textAlign: 'center' }}>
            Waiting for parent approval
          </p>
        )}
        <button className="close-btn" onClick={() => setShowEditModal(false)}>
          X
        </button>
        <div className="modal-body">
          {isEditing && !currentResponsibility.verified ? (
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
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value={0}>Too Easy</option>
                <option value={1}>Very Easy</option>
                <option value={2}>Easy</option>
                <option value={3}>Medium</option>
                <option value={4}>Hard</option>
                <option value={5}>Very Hard</option>
                <option value={6}>Extremely Hard</option>
              </select>
              <button className="save-btn" onClick={() => handleSubmit()}>
                Save Changes
              </button>
              <button className="delete-btn" onClick={() => handleDelete()}>
                Delete
              </button>
            </>
          ) : (
            <>
              <h3>{title}</h3>
              <p>{description}</p>
              <p>{difficultyString}</p>
              {currentResponsibility.verified ? (
                <button
                  className="complete-btn"
                  onClick={() => completeIt(true)}
                >
                  Mark as Completed
                </button>
              ) : (
                <div>
                  <button
                    className="complete-btn"
                    onClick={() => completeIt(true)}
                  >
                    Mark as Completed
                  </button>
                </div>
              )}
              {!currentResponsibility.verified && (
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
