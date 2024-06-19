import React, { useContext, useState } from 'react';
import ParentFinancialAccounts from '../components/ParentFinancialAccounts';
import AllowancePeriodModal from '../components/AllowancePeriodModal';
import '../styles/finances.css';
import { establishAllowancePeriod } from '../api-calls/api';
import { MainContext } from '../context/context';
import ChildDashboardNavbar from '../layout/ChildDashboardNavbar';

export default function Finances() {
  const { main } = useContext(MainContext);
  const [showAllowancePeriodModal, setShowAllowancePeriodModal] =
    useState(false);

  useState(930);

  const setTheAllowancePeriod = async ({ periodType, allowanceDay }) => {
    try {
      establishAllowancePeriod({ main, periodType, allowanceDay });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="finances">
      <ChildDashboardNavbar />
      <h1 style={{ textAlign: 'center', fontSize: '2rem', margin: '20px' }}>
        Manage {main.state.profile.family.name} Finances
      </h1>
      <div className="allowance-details">
        <h2>Manage Allowance Details</h2>
        <h3>Current Allowance Period: Tuesday, Weekly (PLACEHOLDER)</h3>
        <button onClick={() => setShowAllowancePeriodModal(true)}>
          Set Allowance Period
        </button>
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
