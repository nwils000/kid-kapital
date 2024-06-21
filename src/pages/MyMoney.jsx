import React, { useContext, useState, useEffect } from 'react';
import { MainContext } from '../context/context';

export default function MyMoney() {
  const { main } = useContext(MainContext);

  const [allowanceDetails, setAllowanceDetails] = useState({
    lastPeriodEarnings: 0,
    currentBalance: 200,
    savings: 100,
    totalMoney: 0,
  });

  useEffect(() => {
    const totalInvestments = 250;
    setAllowanceDetails((prev) => ({
      ...prev,
      totalMoney: prev.currentBalance + totalInvestments - 50,
    }));
  }, []);

  return (
    <div className="my-money-page">
      <h1>My Money Management</h1>
      <div className="wallet-overview">
        <h2>Wallet Overview</h2>
        <div className="wallet-details">
          <div className="wallet-item">
            <label>Last Allowance Period Earnings:</label>
            <span>${allowanceDetails.lastPeriodEarnings.toFixed(2)}</span>
          </div>
          <div className="wallet-item">
            <label>Current Balance:</label>
            <span>${allowanceDetails.currentBalance.toFixed(2)}</span>
          </div>
          <div className="wallet-item">
            <label>Savings:</label>
            <span>${allowanceDetails.savings.toFixed(2)}</span>
          </div>
          <div className="wallet-item">
            <label>Total Money:</label>
            <span>${allowanceDetails.totalMoney.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div className="financial-holdings">
        <h2>Current Financial Activities</h2>
        <div className="financial-holding">
          <p>
            <strong>Type:</strong> Savings Account
          </p>
          <p>
            <strong>Amount:</strong> $100.00
          </p>
          <p>
            <strong>Detail:</strong> Earning 2% interest per year
          </p>
        </div>
        <div className="financial-holding">
          <p>
            <strong>Type:</strong> Investment Fund
          </p>
          <p>
            <strong>Amount:</strong> $200.00
          </p>
          <p>
            <strong>Detail:</strong> Potential growth of 8% or decrease of 3%
            per year
          </p>
        </div>
        <div className="financial-holding">
          <p>
            <strong>Type:</strong> Loan
          </p>
          <p>
            <strong>Amount:</strong> -$50.00
          </p>
          <p>
            <strong>Detail:</strong> Owing $50, plus 5% interest to be repaid
            within a year
          </p>
        </div>
      </div>
      <div className="financial-options">
        <h2>Explore Financial Options</h2>
        <div className="option">
          <h3>Simple Savings Account</h3>
          <p>Earn 2% interest annually.</p>
          <p>
            <strong>Benefits:</strong> Safe growth.
          </p>
          <p>
            <strong>Drawbacks:</strong> Lower returns.
          </p>
        </div>
        <div className="option">
          <h3>Basic Investment Fund</h3>
          <p>Potential 8% growth or 3% loss annually.</p>
          <p>
            <strong>Benefits:</strong> Higher potential returns.
          </p>
          <p>
            <strong>Drawbacks:</strong> Risk of loss.
          </p>
        </div>
        <div className="option">
          <h3>Personal Loan</h3>
          <p>Borrow with 5% interest rate annually.</p>
          <p>
            <strong>Benefits:</strong> Immediate funds.
          </p>
          <p>
            <strong>Drawbacks:</strong> Repayment with interest.
          </p>
        </div>
      </div>
    </div>
  );
}
