import React, { useState, useEffect, useContext } from 'react';
import {
  FaTrash,
  FaEdit,
  FaCaretDown,
  FaCaretUp,
  FaPlus,
} from 'react-icons/fa';
import {
  createFinancialAccount,
  updateFinancialAccount,
  viewAvailableAccounts,
  deleteFinancialAccount,
} from '../api-calls/api';
import { MainContext } from '../context/context';
import '../styles/financial-accounts.css';

export default function ParentFinancialAccounts() {
  const { main } = useContext(MainContext);
  const [accounts, setAccounts] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accountType, setAccountType] = useState('Savings');
  const [interestRate, setInterestRate] = useState(0);
  const [interestPeriodType, setInterestPeriodType] = useState('Weekly');
  const [interestDay, setInterestDay] = useState(0);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    const response = await viewAvailableAccounts({ main });
    setAccounts(response);
  };

  const handleCreateAccount = async () => {
    await createFinancialAccount({
      main,
      accountType,
      interestRate,
      interestPeriodType,
      interestDay,
    });
    fetchAccounts();
    resetInputs();
    setShowCreateForm(false);
  };

  const handleUpdateAccount = async () => {
    await updateFinancialAccount({
      main,
      accountId: selectedAccount.id,
      accountType,
      interestRate,
      interestPeriodType,
      interestDay,
    });
    fetchAccounts();
    setEditMode(false);
    resetInputs();
  };

  const handleDeleteAccount = async (id) => {
    await deleteFinancialAccount({ main, accountId: id });
    fetchAccounts();
  };

  const editAccount = (account) => {
    setSelectedAccount(account);
    setAccountType(account.account_type);
    setInterestRate(account.interest_rate);
    setInterestPeriodType(account.interest_period_type);
    setInterestDay(account.interest_day);
    setEditMode(true);
    setShowCreateForm(false);
  };

  const resetInputs = () => {
    setAccountType('Savings');
    setInterestRate(0);
    setInterestPeriodType('Weekly');
    setInterestDay(0);
    setSelectedAccount(null);
  };

  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
    setEditMode(false);
  };

  return (
    <div className="financial-accounts">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h2 className="title">Manage Financial Accounts</h2>
          <p className="description">
            Manage and configure financial accounts including savings,
            investments, and loans.
          </p>
        </div>
      </div>

      <div>
        {showCreateForm ? null : (
          <>
            <button className="button-create" onClick={toggleCreateForm}>
              Create a new account
            </button>
          </>
        )}

        {showCreateForm && (
          <div className="form-section">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3>Create Account</h3>
              <div className="cancel-edit hover" onClick={toggleCreateForm}>
                X
              </div>
            </div>

            <label>Account Type (e.g., Savings, Investment, Loan)</label>
            <select
              className="input-text"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
            >
              <option value="Savings">Savings</option>
              <option value="Investment">Investment</option>
              <option value="Loan">Loan</option>
            </select>
            <label>Interest Rate (%)</label>
            <input
              className="input-number"
              type="number"
              placeholder="Interest Rate"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
            />
            <label>Interest Period</label>
            <select
              className="select-input"
              value={interestPeriodType}
              onChange={(e) => setInterestPeriodType(e.target.value)}
            >
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
            <label>Interest Day</label>
            <input
              className="input-number"
              type="number"
              min="1"
              max={interestPeriodType === 'Monthly' ? 31 : 365}
              placeholder="Day of the month/year"
              value={interestDay}
              onChange={(e) => setInterestDay(e.target.value)}
              required
            />
            <button className="button-create" onClick={handleCreateAccount}>
              Create Account
            </button>
          </div>
        )}
        {editMode && (
          <div className="form-section">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3>Update Account</h3>
              <div
                className="cancel-edit hover"
                onClick={() => setEditMode(false)}
              >
                X
              </div>
            </div>
            <label>Account Type (e.g., Savings, Investment, Loan)</label>
            <select
              className="input-text"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
            >
              <option value="Savings">Savings</option>
              <option value="Investment">Investment</option>
              <option value="Loan">Loan</option>
            </select>
            <label>Interest Rate (%)</label>
            <input
              className="input-number"
              type="number"
              placeholder="Interest Rate"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
            />
            <label>Interest Period</label>
            <select
              className="select-input"
              value={interestPeriodType}
              onChange={(e) => setInterestPeriodType(e.target.value)}
            >
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
            <label>Interest Day</label>
            <input
              className="input-number"
              type="number"
              min="1"
              max={interestPeriodType === 'Monthly' ? 31 : 365}
              placeholder="Day of the month/year"
              value={interestDay}
              onChange={(e) => setInterestDay(e.target.value)}
              required
            />
            <div>Editing Account ID: {selectedAccount.id}</div>
            <button className="button-update" onClick={handleUpdateAccount}>
              Update Account
            </button>
          </div>
        )}
        <div className="account-list">
          <h3>Existing Accounts</h3>
          <ul>
            {accounts.map((account) => (
              <li key={account.id}>
                <div
                  style={{
                    display: 'flex',
                    gap: '.5rem',
                    alignItems: 'center',
                  }}
                >
                  ID: {account.id} - {account.account_type} -{' '}
                  {account.interest_rate}% - {account.interest_day}{' '}
                  {account.interest_period_type}
                  <div
                    style={{
                      display: 'flex',
                      height: 'fit-content',
                      gap: '.5rem',
                    }}
                  >
                    <FaEdit
                      className="hover"
                      style={{ fontSize: '1.2rem', color: '#3fa0ca' }}
                      onClick={() => editAccount(account)}
                    />

                    <FaTrash
                      className="hover"
                      style={{ fontSize: '1.2rem', color: '#3fa0ca' }}
                      onClick={() => handleDeleteAccount(account.id)}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
