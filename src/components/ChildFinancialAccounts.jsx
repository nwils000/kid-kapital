import React, { useState, useEffect, useContext } from 'react';
import {
  viewAvailableAccounts,
  investMoney,
  viewInvestments,
  cashOut,
} from '../api-calls/api';
import { MainContext } from '../context/context';

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

  return (
    <div>
      \<h2>Child Component</h2>
      <div>
        <h3>Invest Money</h3>
        <p>Total Money: {main.state.profile.total_money}</p>
        Account Id
        <input
          type="number"
          placeholder="Account ID"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
        />
        Account Amount
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
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
                {investment.amount_invested} - Returns {investment.returns}
              </li>
              <button onClick={() => handleCashOut(investment.id)}>
                Cash Out
              </button>
            </div>
          ))}
        </ul>
      </div>
      <div>
        <h3>Existing Accounts</h3>
        <ul>
          {accounts.map((account) => (
            <li key={account.id}>
              ID: {account.id} - {account.account_type} -{' '}
              {account.interest_rate}% - {account.interest_day}{' '}
              {account.interest_period_type}{' '}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
