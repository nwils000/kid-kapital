import React, { useContext, useState, useEffect } from 'react';
import { MainContext } from '../context/context';

export default function Wallet() {
  const { main } = useContext(MainContext);
  const [allowanceDetails, setAllowanceDetails] = useState({
    lastPeriodEarnings: 0,
    currentBalance: 0,
    savings: 0,
    totalMoney: 0,
  });

  useEffect(() => {
    console.log('Profile State on Mount:', main.state.profile);

    const calculateLastPeriodEarnings = () => {
      if (!main.state.profile.family.last_allowance_date) {
        return 0;
      }

      const lastAllowanceDate = new Date(
        main.state.profile.family.last_allowance_date
      );
      const pricePerPoint =
        main.state.profile.family.price_per_difficulty_point;

      let totalEarnings = 0;
      const familyMembers = main.state.profile.family.members || [];

      for (let member of familyMembers) {
        let memberEarnings = 0;
        for (let task of member.responsibilities) {
          const taskDate = new Date(task.date);
          if (
            task.completed &&
            task.verified &&
            taskDate >= lastAllowanceDate &&
            taskDate < new Date()
          ) {
            memberEarnings += task.difficulty * pricePerPoint;
          }
        }
        totalEarnings += memberEarnings;
      }
      return totalEarnings;
    };

    const updateAllowanceDetails = () => {
      const earnings = calculateLastPeriodEarnings();
      const total_money = main.state.profile.total_money;
      const savings =
        main.state.profile.investments &&
        main.state.profile.investments.length > 0
          ? main.state.profile.investments.reduce((total, investment) => {
              const amountInvested =
                parseFloat(investment.amount_invested) || 0;
              const returns = parseFloat(investment.returns) || 0;
              return total + amountInvested + returns;
            }, 0)
          : 0.0;

      setAllowanceDetails({
        lastPeriodEarnings: earnings,
        currentBalance: total_money - savings,
        savings: savings,
        totalMoney: total_money,
      });
    };

    updateAllowanceDetails();
  }, [main.state.profile]);

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: 'auto',
        padding: '20px',
      }}
    >
      <h2 style={{ textAlign: 'center' }}>Wallet</h2>
      <div
        style={{
          padding: '10px',
          backgroundColor: '#F8F9FA',
          borderRadius: '8px',
        }}
      >
        <div
          style={{
            margin: '10px 0',
            alignItems: 'center',
            display: 'flex',
            gap: '3rem',
            justifyContent: 'space-between',
          }}
        >
          <label style={{ fontWeight: 'bold' }}>
            Last Allowance Period Earnings:
          </label>
          <span style={{ color: '#333' }}>
            ${allowanceDetails.lastPeriodEarnings.toFixed(2)}
          </span>
        </div>
        <div
          style={{
            margin: '10px 0',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <label style={{ fontWeight: 'bold' }}>Current Balance:</label>
          <span style={{ color: '#333' }}>
            ${allowanceDetails.currentBalance.toFixed(2)}
          </span>
        </div>
        <div
          style={{
            margin: '10px 0',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <label style={{ fontWeight: 'bold' }}>Savings:</label>
          <span style={{ color: '#333' }}>
            ${allowanceDetails.savings.toFixed(2)}
          </span>
        </div>
        <div
          style={{
            margin: '10px 0',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <label style={{ fontWeight: 'bold' }}>Total Money:</label>
          <span style={{ color: '#333' }}>
            ${allowanceDetails.totalMoney.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
