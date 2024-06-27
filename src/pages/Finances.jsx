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
import ParentNavbar from '../layout/ParentNavbar';
import ChildNavbar from '../layout/ChildNavbar';

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

  function getSuffix(day) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }

  return (
    <div className="finances">
      {main.state.profile.parent ? <ParentNavbar /> : <ChildNavbar />}

      <h1 style={{ textAlign: 'center', fontSize: '2rem', margin: '20px' }}>
        Manage {main.state.profile.family.name} Finances
      </h1>
      <div className="allowance-details">
        <h2>Manage Allowance Details</h2>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h3
            style={{
              alignItems: 'center',
              fontWeight: '500',
              display: 'block',
            }}
          >
            Current reward per difficulty point:{' '}
            <span
              style={{
                marginLeft: 5,
                fontWeight: '700',

                display: 'flex',
                alignItems: 'center',
              }}
            >
              ${' '}
              {!editMode ? (
                <>
                  {rewardValue}
                  <FaEdit
                    onClick={() => setEditMode(true)}
                    className="hover"
                    style={{
                      marginLeft: 7,
                      fontSize: '1.2rem',
                      color: '#4CB2C2',
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
            </span>
          </h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {main.state.profile.family.allowance_period_type === 'Monthly' ? (
            <>
              <h3>
                <span style={{ fontWeight: '500', display: 'block' }}>
                  Current Allowance Period:
                  <span
                    style={{
                      fontWeight: '700',

                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {main.state.profile.family.allowance_day +
                      getSuffix(main.state.profile.family.allowance_day)}
                    , {main.state.profile.family.allowance_period_type}
                    <FaEdit
                      onClick={() => setShowAllowancePeriodModal(true)}
                      className="hover"
                      style={{
                        marginLeft: 7,
                        fontSize: '1.2rem',
                        color: '#4CB2C2',
                      }}
                    />
                  </span>
                </span>
              </h3>
            </>
          ) : (
            <>
              {' '}
              <h3>
                <span style={{ fontWeight: '500', display: 'block' }}>
                  Current Allowance Period:{' '}
                  <span style={{ fontWeight: '700' }}>
                    {dayNames[main.state.profile.family.allowance_day]},{' '}
                    {main.state.profile.family.allowance_period_type}
                  </span>
                  <FaEdit
                    onClick={() => setShowAllowancePeriodModal(true)}
                    className="hover"
                    style={{
                      marginLeft: 7,
                      fontSize: '1.2rem',
                      color: '#4CB2C2',
                    }}
                  />
                </span>
              </h3>
            </>
          )}
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
