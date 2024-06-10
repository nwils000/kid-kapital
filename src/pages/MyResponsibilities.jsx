import React, { useState, useContext } from 'react';
import { MainContext } from '../context/context';
import ParentDashboardNavbar from '../layout/ParentDashboardNavbar';
import '../styles/my-responsibilities.css'; // Ensure you have this CSS file in the correct path

const initialResponsibilities = {
  '2024-06-12': ['Grocery Shopping', 'Read 30 pages of a book'],
  '2024-06-13': ['Yoga Session', 'Prepare Dinner'],
};

function MyResponsibilities() {
  const { main } = useContext(MainContext);
  const [weekStart, setWeekStart] = useState(getSunday(new Date()));
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [responsibilities, setResponsibilities] = useState(
    initialResponsibilities
  );

  function getSunday(d) {
    const date = new Date(d);
    const day = date.getDay();
    console.log(day);
    const diff = date.getDate() - day;
    console.log(date.getDate());
    console.log(diff);
    return new Date(date.setDate(diff));
  }

  function handleWeekChange(addWeeks) {
    const newWeekStart = new Date(weekStart);
    newWeekStart.setDate(newWeekStart.getDate() + (addWeeks ? 7 : -7));
    setWeekStart(newWeekStart);
    setSelectedDay(newWeekStart);
  }

  function formatDate(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(date.getDate()).padStart(2, '0')}`;
  }

  function formatDateForDisplay(date) {
    return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(
      date.getDate()
    ).padStart(2, '0')}`;
  }

  function generateWeekDays(start) {
    let days = [];
    let date = new Date(start);
    for (let i = 0; i < 7; i++) {
      days.push(
        new Date(date.getFullYear(), date.getMonth(), date.getDate() + i)
      );
    }
    return days;
  }

  function addTask() {
    const task = prompt('Enter a new task:');
    if (task) {
      const formattedDate = formatDate(selectedDay);
      const updatedTasks = responsibilities[formattedDate]
        ? [...responsibilities[formattedDate], task]
        : [task];
      setResponsibilities({
        ...responsibilities,
        [formattedDate]: updatedTasks,
      });
    }
  }

  const daysOfWeek = generateWeekDays(weekStart);
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
  const currentMonth = monthNames[selectedDay.getMonth()];

  return (
    <>
      <ParentDashboardNavbar />
      <div className="responsibilities-container">
        <h2>{currentMonth}</h2>
        <div className="week-navigation">
          <button onClick={() => handleWeekChange(false)}>Previous Week</button>
          <button onClick={() => handleWeekChange(true)}>Next Week</button>
        </div>
        <div className="week-days">
          {daysOfWeek.map((day, index) => (
            <button
              key={index}
              className={`day-button ${
                selectedDay.toDateString() === day.toDateString()
                  ? 'selected'
                  : ''
              }`}
              onClick={() => setSelectedDay(day)}
            >
              {day.getDate()}
            </button>
          ))}
        </div>
        <div className="selected-day-tasks">
          <h3>Tasks for {formatDateForDisplay(selectedDay)}:</h3>
          <ul>
            {responsibilities[formatDate(selectedDay)] ? (
              responsibilities[formatDate(selectedDay)].map((task, index) => (
                <li key={index}>{task}</li>
              ))
            ) : (
              <li>No Responsibilities</li>
            )}
          </ul>
          <button onClick={addTask}>Add Task</button>
        </div>
      </div>
    </>
  );
}

export default MyResponsibilities;
