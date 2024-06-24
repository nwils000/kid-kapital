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
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
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
      onMouseDown={() => setShowAllowancePeriodModal(false)}
    >
      <div className="modal-content" onMouseDown={(e) => e.stopPropagation()}>
        <h2 style={{ textAlign: 'center', marginBottom: 10 }}>
          Set Allowance Period
        </h2>
        <div style={{ width: 'fit-content', margin: 'auto' }}>
          <span>Day: </span>
          {periodType === 'weeks' ? (
            <select value={day} onChange={handleDayChange}>
              {weekDays.map((weekDay) => (
                <option key={weekDay} value={weekDays.indexOf(weekDay)}>
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
        </div>
        <button
          style={{ width: 'fit-content', margin: 'auto', marginTop: '20px' }}
          onClick={handleSubmit}
        >
          Set Period
        </button>
      </div>
    </div>
  );
}

export default AllowancePeriodModal;
