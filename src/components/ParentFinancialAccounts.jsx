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
  const [interestPeriodType, setInterestPeriodType] = useState('Monthly');
  const [interestDay, setInterestDay] = useState(1);
  const [month, setMonth] = useState(1); // Holds the current month
  const [day, setDay] = useState(1); // Holds the current day
  const [potentialGain, setPotentialGain] = useState(6);
  const [potentialLoss, setPotentialLoss] = useState(3);

  const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // Days in each month for a non-leap year
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    const response = await viewAvailableAccounts({ main });
    setAccounts(response);
  };

  useEffect(() => {
    if (interestPeriodType === 'Yearly') {
      const { month: m, day: d } = dayOfYearToDate(interestDay);
      setMonth(m);
      setDay(d);
    } else {
      setInterestDay(1);
    }
  }, [interestPeriodType]);

  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value);
    setMonth(newMonth);
    const newDayOfYear = dateToDayOfYear(newMonth, day);
    setInterestDay(newDayOfYear);
  };

  const handleDayChange = (e) => {
    const newDay = parseInt(e.target.value);
    setDay(newDay);
    const newDayOfYear = dateToDayOfYear(month, newDay);
    setInterestDay(newDayOfYear);
  };

  const handleCreateAccount = async () => {
    await createFinancialAccount({
      main,
      accountType,
      interestRate,
      interestPeriodType,
      interestDay,
      potentialGain,
      potentialLoss,
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
      potentialGain,
      potentialLoss,
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
    setPotentialGain(account.potential_gain || 0);
    setPotentialLoss(account.potential_loss || 0);
    setEditMode(true);
    setShowCreateForm(false);
  };

  const resetInputs = () => {
    setAccountType('Savings');
    setInterestRate(0);
    setInterestPeriodType('Weekly');
    setInterestDay(0);
    setPotentialGain(0);
    setPotentialLoss(0);
    setSelectedAccount(null);
  };

  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
    setEditMode(false);
  };

  const weekDays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  // Converts a day of the year to a month and day
  const dayOfYearToDate = (day) => {
    let month = 0;
    while (day > monthDays[month]) {
      day -= monthDays[month];
      month++;
    }
    return { month: month + 1, day };
  };

  // Converts a month and day to a day of the year
  const dateToDayOfYear = (month, day) => {
    return (
      monthDays.slice(0, month - 1).reduce((acc, cur) => acc + cur, 0) + day
    );
  };

  return (
    <div className="financial-accounts">
      <div
        style={{
          display: 'flex',

          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div className="finanacial-account-header">
          <h2 className="title" style={{ display: 'block' }}>
            Manage Financial Accounts
          </h2>
          <p className="description">
            Manage and configure financial accounts including savings and
            investments.
          </p>
        </div>
        <div>
          {showCreateForm ? (
            <div className="form-section">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3>Create Account</h3>
                <div className="cancel-edit hover" onClick={toggleCreateForm}>
                  X
                </div>
              </div>
              <label>Account Type (e.g., Savings, Investment)</label>
              <select
                className="input-text"
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
              >
                <option value="Savings">Savings</option>
                <option value="Investment">Investment</option>
              </select>
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
              {interestPeriodType === 'Weekly' && (
                <select
                  className="input-number"
                  value={weekDays[interestDay]}
                  onChange={(e) =>
                    setInterestDay(weekDays.indexOf(e.target.value))
                  }
                >
                  {weekDays.map((weekDay) => (
                    <option key={weekDay} value={weekDay}>
                      {weekDay}
                    </option>
                  ))}
                </select>
              )}
              {interestPeriodType === 'Monthly' && (
                <input
                  className="input-number"
                  type="number"
                  min="1"
                  max="31"
                  placeholder="Day of the month"
                  value={interestDay}
                  onChange={(e) => setInterestDay(parseInt(e.target.value))}
                  required
                />
              )}
              {interestPeriodType === 'Yearly' && (
                <>
                  <label>Month</label>
                  <select
                    className="input-number"
                    value={month}
                    onChange={handleMonthChange}
                  >
                    {monthNames.map((name, index) => (
                      <option key={name} value={index + 1}>
                        {name}
                      </option>
                    ))}
                  </select>
                  <label>Day</label>
                  <input
                    className="input-number"
                    type="number"
                    min="1"
                    max={monthDays[month - 1]}
                    value={day}
                    onChange={handleDayChange}
                    required
                  />
                </>
              )}
              <button className="button-update" onClick={handleCreateAccount}>
                Create Account
              </button>
            </div>
          ) : (
            <button className="button-create" onClick={toggleCreateForm}>
              Create a new account
            </button>
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
              <label>Account Type (e.g., Savings, Investment)</label>
              <select
                className="input-text"
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
              >
                <option value="Savings">Savings</option>
                <option value="Investment">Investment</option>
              </select>
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
              {interestPeriodType === 'Weekly' && (
                <select
                  className="input-number"
                  value={weekDays[interestDay]}
                  onChange={(e) =>
                    setInterestDay(weekDays.indexOf(e.target.value))
                  }
                >
                  {weekDays.map((weekDay) => (
                    <option key={weekDay} value={weekDay}>
                      {weekDay}
                    </option>
                  ))}
                </select>
              )}
              {interestPeriodType === 'Monthly' && (
                <input
                  className="input-number"
                  type="number"
                  min="1"
                  max="31"
                  placeholder="Day of the month"
                  value={interestDay}
                  onChange={(e) => setInterestDay(parseInt(e.target.value))}
                  required
                />
              )}
              {interestPeriodType === 'Yearly' && (
                <>
                  <label>Month</label>
                  <select
                    className="input-number"
                    value={month}
                    onChange={handleMonthChange}
                  >
                    {monthNames.map((name, index) => (
                      <option key={name} value={index + 1}>
                        {name}
                      </option>
                    ))}
                  </select>
                  <label>Day</label>
                  <input
                    className="input-number"
                    type="number"
                    min="1"
                    max={monthDays[month - 1]}
                    value={day}
                    onChange={handleDayChange}
                    required
                  />
                </>
              )}
              <button className="button-update" onClick={handleUpdateAccount}>
                Update Account
              </button>
            </div>
          )}
          <div className="account-list" style={{ marginLeft: 20 }}>
            <h3 style={{ paddingBottom: 0 }}>Existing Accounts: </h3>
            <ul style={{ marginTop: 0 }}>
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
                        style={{ fontSize: '1.2rem', color: '#4CB2C2' }}
                        onClick={() => editAccount(account)}
                      />
                      <FaTrash
                        className="hover"
                        style={{ fontSize: '1.2rem', color: '#4CB2C2' }}
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
    </div>
  );
}
