import React, { useContext, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import ParentFinancialAccounts from '../components/ParentFinancialAccounts';
import AllowancePeriodModal from '../components/AllowancePeriodModal';
import '../styles/finances.css';
import {
  establishAllowancePeriod,
  updateDifficultyPointValue,
} from '../api-calls/api';
import { MainContext } from '../context/context';
import ChildDashboardNavbar from '../layout/ChildDashboardNavbar';
import ParentDashboardNavbar from '../layout/ParentDashboardNavbar';

export default function Finances() {
  const { main } = useContext(MainContext);
  const [showAllowancePeriodModal, setShowAllowancePeriodModal] =
    useState(false);
  const [editMode, setEditMode] = useState(false);
  const [rewardValue, setRewardValue] = useState(
    main.state.profile.family.price_per_difficulty_point
  );

  const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const handleUpdateDifficultyPoint = async () => {
    try {
      console.log('HI');
      await updateDifficultyPointValue({ main, price: rewardValue });
    } catch (e) {
      console.error(e);
    }
  };

  const handleInput = (e) => {
    const value = e.target.value;
    if (value === '' || value.match(/^\d{0,2}(\.\d{0,2})?$/)) {
      setRewardValue(value);
    }
  };

  const setTheAllowancePeriod = async ({ periodType, allowanceDay }) => {
    try {
      await establishAllowancePeriod({ main, periodType, allowanceDay });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="finances">
      {main.state.profile.parent ? (
        <ParentDashboardNavbar />
      ) : (
        <ChildDashboardNavbar />
      )}

      <h1 style={{ textAlign: 'center', fontSize: '2rem', margin: '20px' }}>
        Manage {main.state.profile.family.name} Finances
      </h1>
      <div className="allowance-details">
        <h2>Manage Allowance Details</h2>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h3 style={{ display: 'flex', alignItems: 'center' }}>
            Current reward per difficulty point: $
            {!editMode ? (
              <>
                {rewardValue}
                <FaEdit
                  onClick={() => setEditMode(true)}
                  className="hover"
                  style={{
                    marginLeft: 7,
                    fontSize: '1.2rem',
                    color: '#3fa0ca',
                  }}
                />
              </>
            ) : (
              <>
                <input
                  style={{
                    background: 'none',
                    width: '3.3rem',
                    height: '2rem',
                    paddingLeft: '5px',
                    marginLeft: '1px',
                  }}
                  value={rewardValue}
                  onChange={handleInput}
                  onBlur={() => {
                    setEditMode(false);
                    handleUpdateDifficultyPoint();
                  }}
                  autoFocus
                />
                <button
                  style={{
                    padding: '5px 10px',
                    fontSize: '1rem',
                    marginLeft: 7,
                  }}
                >
                  Submit
                </button>
              </>
            )}
          </h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {main.state.profile.family.allowance_period_type === 'Monthly' ? (
            <h3>
              Current Allowance Period: Day{' '}
              {main.state.profile.family.allowance_day},{' '}
              {main.state.profile.family.allowance_period_type}
            </h3>
          ) : (
            <h3>
              Current Allowance Period:{' '}
              {dayNames[main.state.profile.family.allowance_day]},{' '}
              {main.state.profile.family.allowance_period_type}
            </h3>
          )}
          <FaEdit
            onClick={() => setShowAllowancePeriodModal(true)}
            className="hover"
            style={{
              marginLeft: 7,
              fontSize: '1.2rem',
              color: '#3fa0ca',
            }}
          />
        </div>
      </div>

      <AllowancePeriodModal
        setTheAllowancePeriod={setTheAllowancePeriod}
        showAllowancePeriodModal={showAllowancePeriodModal}
        setShowAllowancePeriodModal={setShowAllowancePeriodModal}
      />
      <ParentFinancialAccounts />
    </div>
  );
}
