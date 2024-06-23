import React, { useState, useEffect, useContext } from 'react';
import {
  viewAvailableAccounts,
  investMoney,
  viewInvestments,
  cashOut,
} from '../api-calls/api';
import { MainContext } from '../context/context';
import ChildDashboardNavbar from '../layout/ChildNavbar';

export default function ChildFinancialAccounts() {
  const { main } = useContext(MainContext);
  const [accounts, setAccounts] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [amount, setAmount] = useState(0);
  const [accountId, setAccountId] = useState(0);

  useEffect(() => {
    fetchInvestments();
    fetchAccounts();
  }, []);

  useEffect(() => {
    fetchInvestments();
  }, [main.state.profile]);

  const fetchInvestments = async () => {
    const response = await viewInvestments({ main });
    setInvestments(response);
  };

  const fetchAccounts = async () => {
    const response = await viewAvailableAccounts({ main });
    setAccounts(response);
  };

  const handleInvestMoney = async () => {
    await investMoney({ main, accountId, amount });
    fetchAccounts();
  };

  const handleCashOut = async (investmentId) => {
    await cashOut({ main, investmentId });
  };

  const getDayOfYear = (dayNum) => {
    const date = new Date(new Date().getFullYear(), 0);
    date.setDate(dayNum);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  };

  const getDayOfWeek = (dayNum) => {
    const date = new Date(new Date().getFullYear(), 0);
    date.setDate(dayNum);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  return (
    <div>
      <ChildDashboardNavbar />
      <h2>Child Component</h2>
      <div>
        <h3>Invest Money</h3>
        <p>Total Money: {main.state.profile.total_money}</p>
        Account Id
        <input
          type="number"
          placeholder="Account ID"
          value={accountId}
          onChange={(e) => setAccountId(parseInt(e.target.value))}
        />
        Account Amount
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
        />
        <button onClick={handleInvestMoney}>Invest</button>
      </div>
      <div>
        <h3>Your Investments</h3>
        <ul>
          {investments.map((investment) => (
            <div key={investment.id}>
              <li>
                ID: {investment.id} - Amount Invested:{' '}
                {investment.amount_invested} - Returns: {investment.returns}
                <button onClick={() => handleCashOut(investment.id)}>
                  Cash Out
                </button>
              </li>
            </div>
          ))}
        </ul>
      </div>
      <div>
        <h3>Existing Accounts</h3>
        <ul>
          {accounts.map((account) => (
            <li key={account.id}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '20px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  marginBottom: '20px',
                }}
              >
                <h3 style={{ marginBottom: '10px' }}>Account Details</h3>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '10px',
                  }}
                >
                  Account Type: {account.account_type}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '10px',
                  }}
                >
                  Interest Period Type: {account.interest_period_type}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '10px',
                  }}
                >
                  {account.account_type === 'Savings' ? (
                    <p style={{ margin: 0 }}>Interest Day:</p>
                  ) : (
                    <p style={{ margin: 0 }}>Cash-out Day:</p>
                  )}
                  {account.interest_period_type === 'Weekly'
                    ? getDayOfWeek(account.interest_day)
                    : account.interest_period_type === 'Monthly'
                    ? account.interest_day
                    : getDayOfYear(account.interest_day)}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '10px',
                  }}
                >
                  Interest Rate: {account.interest_rate}%
                </div>
                {account.account_type === 'Investment' && (
                  <>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '10px',
                      }}
                    >
                      Potential Gain: {account.potential_gain}%
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '10px',
                      }}
                    >
                      Potential Loss: {account.potential_loss}%
                    </div>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
