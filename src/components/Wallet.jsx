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
      const savings = main.state.profile.savings || 0;

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
    <div className="wallet">
      <h2>Wallet Overview</h2>
      <div className="wallet-details">
        <div>
          <label>Last Allowance Period Earnings:</label>
          <span>${allowanceDetails.lastPeriodEarnings.toFixed(2)}</span>
        </div>
        <div>
          <label>Current Balance:</label>
          <span>${allowanceDetails.currentBalance.toFixed(2)}</span>
        </div>
        <div>
          <label>Savings:</label>
          <span>${allowanceDetails.savings.toFixed(2)}</span>
        </div>
        <div>
          <label>Total Money:</label>
          <span>${allowanceDetails.totalMoney.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
