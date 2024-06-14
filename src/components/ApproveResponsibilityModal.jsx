import React, { useContext, useEffect, useState } from 'react';
import { FiEdit } from 'react-icons/fi';
import '../styles/responsibility-modal.css';
import { approveResponsibility } from '../api-calls/api';
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
  const [difficulty, setDifficulty] = useState(0);
  const [difficultyString, setDifficultyString] = useState('');
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    const approveIt = async () => {
      try {
        let editedResponsibility = await approveResponsibility({
          id: currentResponsibility.id,
          difficulty,
          main,
          approved,
        });

        console.log(editedResponsibility);

        setCurrentResponsibility(editedResponsibility.data);
        setIsEditing(false);
      } catch (e) {
        console.log(e);
      }
    };
    approveIt();
  }, [approved]);

  useEffect(() => {
    if (showApproveModal) {
      setDifficulty(currentResponsibility.difficulty);
      setTitle(currentResponsibility.title);
      setDescription(currentResponsibility.description);
      setApproved(currentResponsibility.verified);

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
  }, [showApproveModal, currentResponsibility]);

  //   useEffect(() => {set}, [currentResponsibility])

  const handleSave = async () => {
    try {
      let editedResponsibility = await approveResponsibility({
        id: currentResponsibility.id,
        difficulty,
        main,
        approved,
      });

      console.log(editedResponsibility);

      setCurrentResponsibility(editedResponsibility.data);
      setIsEditing(false);
    } catch (e) {
      console.log(e);
    }
  };

  if (!showApproveModal) return null;

  return (
    <div
      className="modal-overlay"
      onClick={() => {
        setShowApproveModal(false);
        setIsEditing(false);
      }}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <p style={{ textAlign: 'center', color: '#1DA1F2' }}>
          Awaiting Your Approval...
        </p>
        <button
          className="close-btn"
          onClick={() => {
            setShowApproveModal(false);
            setIsEditing(false);
          }}
        >
          X
        </button>
        <div className="modal-body">
          <div className="title-section">
            <h3>{title}</h3>
          </div>

          <div className="description-section">
            <p>{description}</p>

            {isEditing ? (
              <select
                className="difficulty-select"
                defaultValue={difficulty}
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
            ) : (
              <p>{difficultyString}</p>
            )}
          </div>
          <div className="buttons-section">
            {!isEditing && (
              <button
                className="edit-btn"
                onClick={() => {
                  setIsEditing(true);
                }}
              >
                <FiEdit /> Edit
              </button>
            )}

            {!isEditing && (
              <div>
                <button
                  className="complete-btn"
                  onClick={() => {
                    setApproved(true);
                    setShowApproveModal(false);
                  }}
                >
                  Mark as Approved
                </button>
              </div>
            )}

            {isEditing && (
              <>
                <button className="save-btn" onClick={() => handleSave()}>
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApproveResponsibilityModal;
