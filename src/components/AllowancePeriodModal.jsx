import React, { useContext, useState } from 'react';
import { MainContext } from '../context/context';
import '../styles/responsibility-modal.css';
import '../styles/allowance-modal.css';

function AllowancePeriodModal({
  showAllowancePeriodModal,
  setShowAllowancePeriodModal,
  setTheAllowancePeriod,
}) {
  const { main } = useContext(MainContext);

  const initialPeriodType =
    main.state.profile.family.allowance_period_type === 'Weekly'
      ? 'weeks'
      : 'months';
  const initialDay = main.state.profile.family.allowance_day;

  const [periodType, setPeriodType] = useState(initialPeriodType);
  const [day, setDay] = useState(initialDay);

  const weekDays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  const handleDayChange = (event) => {
    setDay(event.target.value);
  };

  const handleSubmit = () => {
    console.log('Submitted', periodType, day);
    setTheAllowancePeriod({
      periodType: periodType === 'weeks' ? 'Weekly' : 'Monthly',
      allowanceDay: day,
    });
    setShowAllowancePeriodModal(false);
  };

  if (!showAllowancePeriodModal) return null;

  return (
    <div
      className="modal-overlay allowance-modal"
      onClick={() => setShowAllowancePeriodModal(false)}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="close-btn"
          onClick={() => setShowAllowancePeriodModal(false)}
        >
          X
        </button>
        <span>Day: </span>
        {periodType === 'weeks' ? (
          <select value={day} onChange={handleDayChange}>
            {weekDays.map((weekDay) => (
              <option key={weekDay} value={weekDay}>
                {weekDay}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="number"
            min="1"
            max="31"
            value={day}
            onChange={handleDayChange}
            required
          />
        )}
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
