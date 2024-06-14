import React, { useContext, useState } from 'react';
import '../styles/responsibility-modal.css';
import { MainContext } from '../context/context';

function AllowancePeriodModal({
  showAllowancePeriodModal,
  setShowAllowancePeriodModal,
  setTheAllowancePeriod,
}) {
  const { main } = useContext(MainContext);
  const [periodType, setPeriodType] = useState(
    main.state.profile.family.allowance_period_type === 'Weekly'
      ? 'weeks'
      : 'months'
  );
  const [day, setDay] = useState(main.state.profile.family.allowance_day);

  const handleSubmit = () => {
    console.log(
      'ASDSDA',
      main.state.profile.family.allowance_period_type,
      main.state.profile.family.allowance_day
    );
    setTheAllowancePeriod({
      periodType: periodType === 'weeks' ? 'Weekly' : 'Monthly',
      allowanceDay: day,
    });
    setShowAllowancePeriodModal(false);
  };

  if (!showAllowancePeriodModal) return null;

  return (
    <div
      className="modal-overlay"
      onClick={() => setShowAllowancePeriodModal(false)}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="close-btn"
          onClick={() => setShowAllowancePeriodModal(false)}
        >
          X
        </button>
        <span>day </span>
        <input
          type="number"
          min="1"
          max={periodType === 'weeks' ? 7 : 31}
          value={day}
          onChange={(e) => setDay(e.target.value)}
          required
        />
        <label> of the </label>
        <select
          value={periodType}
          onChange={(e) => setPeriodType(e.target.value)}
        >
          <option value="weeks">Week</option>
          <option value="months">Month</option>
        </select>
        <button onClick={handleSubmit}>Set Period</button>
      </div>
    </div>
  );
}

export default AllowancePeriodModal;
