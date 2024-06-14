import React, { useEffect, useState } from 'react';
import '../styles/responsibility-modal.css';

function ResponsibilityModal({
  showResponsibilityModal,
  setShowResponsibilityModal,
  currentResponsibility,
  currentChildName,
}) {
  const [title, setTitle] = useState(currentResponsibility.title);
  const [description, setDescription] = useState(
    currentResponsibility.description
  );
  const [difficultyString, setDifficultyString] = useState('');

  useEffect(() => {
    if (showResponsibilityModal) {
      setTitle(currentResponsibility.title);
      setDescription(currentResponsibility.description);
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
  }, [showResponsibilityModal, currentResponsibility]);

  useEffect(() => {
    console.log('CHILD NAME', currentChildName);
  }, [currentChildName]);

  if (!showResponsibilityModal) return null;

  return (
    <div
      className="modal-overlay"
      onClick={() => {
        setShowResponsibilityModal(false);
      }}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="close-btn"
          onClick={() => {
            setShowResponsibilityModal(false);
          }}
        >
          X
        </button>
        <div className="modal-body">
          {currentChildName ? <p>{currentChildName}</p> : null}
          <div className="title-section">
            <h3>{title}</h3>
          </div>

          <div className="description-section">
            <p>{description}</p>

            <p>{difficultyString}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResponsibilityModal;
