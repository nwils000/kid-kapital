import React, { useState, useEffect, useContext } from 'react';
import { viewAvailableAccounts, investMoney } from '../api-calls/api';
import { MainContext } from '../context/context';
import ChildDashboardNavbar from '../layout/ChildDashboardNavbar';

export default function ChildFinancialAccounts() {
  const { main } = useContext(MainContext);
  const [accounts, setAccounts] = useState([]);
  const [amount, setAmount] = useState(0);
  const [accountId, setAccountId] = useState(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    const response = await viewAvailableAccounts({ main });
    setAccounts(response);
  };

  const handleInvestMoney = async () => {
    await investMoney({ main, accountId, amount });
    fetchAccounts();
  };

  return (
    <div>
      <ChildDashboardNavbar />
      <h2>Child Component</h2>
      <div>
        <h3>Invest Money</h3>
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
