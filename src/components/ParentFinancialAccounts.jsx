import React, { useState, useEffect, useContext } from 'react';
import {
  listAccountTypes,
  createFinancialAccount,
  updateFinancialAccount,
  viewAvailableAccounts,
  deleteFinancialAccount,
} from '../api-calls/api';
import { MainContext } from '../context/context';
import ParentDashboardNavbar from '../layout/ParentDashboardNavbar';

export default function ParentFinancialAccounts() {
  const { main } = useContext(MainContext);
  const [accounts, setAccounts] = useState([]);
  const [accountTypes, setAccountTypes] = useState([]);
  const [accountType, setAccountType] = useState('');
  const [interestRate, setInterestRate] = useState(0);
  const [interestPeriodType, setInterestPeriodType] = useState('Weekly');
  const [interestDay, setInterestDay] = useState(0);
  const [accountId, setAccountId] = useState(null);

  useEffect(() => {
    fetchAccountTypes();
    fetchAccounts();
  }, []);

  const fetchAccountTypes = async () => {
    const response = await listAccountTypes({ main });
    setAccountTypes(response);
  };

  const fetchAccounts = async () => {
    const response = await viewAvailableAccounts({ main });
    setAccounts(response);
  };

  const handleCreateAccount = async () => {
    console.log('HEREEEEEHERE', interestDay, interestPeriodType);
    await createFinancialAccount({
      main,
      accountType,
      interestRate,
      interestPeriodType,
      interestDay,
    });
    fetchAccounts();
  };

  const handleUpdateAccount = async () => {
    await updateFinancialAccount({
      main,
      accountId,
      accountType,
      interestRate,
      interestPeriodType,
      interestDay,
    });
    fetchAccounts();
  };

  const handleDeleteAccount = async (id) => {
    await deleteFinancialAccount({ main, accountId: id });
    fetchAccounts();
  };

  return (
    <div>
      <ParentDashboardNavbar />
      <h2>Parent Component</h2>
      <div>
        <h3>Create Account</h3>
        Account Type ie. Savings, Investment, Loan
        <input
          type="text"
          placeholder="Account Type"
          value={accountType}
          onChange={(e) => setAccountType(e.target.value)}
        />
        interest rate
        <input
          type="number"
          placeholder="Interest Rate"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
        />
        <input
          type="number"
          min="1"
          max={
            interestPeriodType === 'Weekly'
              ? 7
              : interestPeriodType === 'Monthly'
              ? 31
              : 3
          }
          value={interestDay}
          onChange={(e) => setInterestDay(e.target.value)}
          required
        />
        <select
          value={interestPeriodType}
          onChange={(e) => setInterestPeriodType(e.target.value)}
        >
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
          <option value="Yearly">Yearly</option>
        </select>
        <button onClick={handleCreateAccount}>Create Account</button>
      </div>
      <div>
        <h3>Update Account</h3>
        <input
          type="number"
          placeholder="Account ID"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
        />
        Account Type
        <input
          type="text"
          placeholder="Account Type"
          value={accountType}
          onChange={(e) => setAccountType(e.target.value)}
        />
        Interest Rate
        <input
          type="number"
          placeholder="Interest Rate"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
        />
        <input
          type="number"
          min="1"
          max={
            interestPeriodType === 'Weekly'
              ? 7
              : interestPeriodType === 'Monthly'
              ? 31
              : 3
          }
          value={interestDay}
          onChange={(e) => setInterestDay(e.target.value)}
          required
        />
        <select
          value={interestPeriodType}
          onChange={(e) => setInterestPeriodType(e.target.value)}
        >
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
          <option value="Yearly">Yearly</option>
        </select>
        <button onClick={handleUpdateAccount}>Update Account</button>
      </div>
      <div>
        <h3>Delete Account</h3>
        Account Id
        <input
          type="number"
          placeholder="Account ID"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
        />
        <button onClick={() => handleDeleteAccount(accountId)}>
          Delete Account
        </button>
      </div>
      <div>
        <h3>Existing Accounts</h3>
        <ul>
          {accounts.map((account) => (
            <li key={account.id}>
              ID: {account.id} - {account.account_type} -{' '}
              {account.interest_rate}% - {account.interest_day}{' '}
              {account.interest_period_type}{' '}
              <button onClick={() => handleDeleteAccount(account.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
