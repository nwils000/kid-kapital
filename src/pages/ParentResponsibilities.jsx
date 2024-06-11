import React, { useState, useContext, useEffect } from 'react';
import { MainContext } from '../context/context';
import ParentDashboardNavbar from '../layout/ParentDashboardNavbar';
import '../styles/my-responsibilities.css'; // Ensure you have this CSS file in the correct path
import {
  createResponsibility,
  deleteResponsibilities,
  fetchResponsibilities,
} from '../api-calls/api';

function ParentResponsibilities() {
  const { main } = useContext(MainContext);
  const [weekStart, setWeekStart] = useState(getSunday(new Date()));
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [responsibilities, setResponsibilities] = useState([]);

  useEffect(() => {
    async function getResponsibilities() {
      try {
        const fetchedResponsibilities = await fetchResponsibilities({ main });
        let allResponsibilities = {};
        console.log('fetched responsabilities', fetchedResponsibilities);

        fetchedResponsibilities.data.forEach((element) => {
          if (!allResponsibilities[element.date]) {
            allResponsibilities[element.date] = [];
          }

          allResponsibilities[element.date].push({
            title: element.title,
            id: element.id,
          });
        });

        setResponsibilities(allResponsibilities);
        console.log(allResponsibilities);
      } catch (e) {
        console.error(e);
      }
    }

    getResponsibilities();
  }, []);

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

  async function addResponsibility() {
    const responsibility = prompt('Enter your responsibilities title:');
    if (responsibility) {
      try {
        const formattedDate = formatDate(selectedDay);
        let newResponsibility = await createResponsibility({
          main,
          title: responsibility,
          date: formattedDate,
        });
        console.log('NEW RESPONSIBILITY', newResponsibility);
        const updatedResponsibilities = responsibilities[formattedDate]
          ? [...responsibilities[formattedDate], newResponsibility]
          : [newResponsibility];
        setResponsibilities({
          ...responsibilities,
          [formattedDate]: updatedResponsibilities,
        });
      } catch (e) {
        console.log(e);
      }
    }
  }

  async function handleDeleteResponsibility(id) {
    console.log('Deleting ID:', id);
    try {
      const updatedResponsibilitiesData = await deleteResponsibilities({
        main,
        id,
      });
      console.log(
        'Updated responsibilities after deletion:',
        updatedResponsibilitiesData
      );

      let allResponsibilities = {};

      updatedResponsibilitiesData.data.forEach((element) => {
        if (!allResponsibilities[element.date]) {
          allResponsibilities[element.date] = [];
        }

        allResponsibilities[element.date].push({
          title: element.title,
          id: element.id,
        });
      });

      setResponsibilities(allResponsibilities);
    } catch (e) {
      console.log(e);
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
            <div
              key={index}
              className={`day-button ${
                selectedDay.toDateString() === day.toDateString()
                  ? 'selected'
                  : ''
              }`}
              onClick={() => setSelectedDay(day)}
            >
              <p>{day.getDate()}</p>
            </div>
          ))}
        </div>
        <div className="selected-day-responsibilities">
          <h3>Responsibilities for {formatDateForDisplay(selectedDay)}:</h3>
          <ul>
            {responsibilities[formatDate(selectedDay)] ? (
              responsibilities[formatDate(selectedDay)].map(
                (responsibility, index) => (
                  <li key={index}>
                    <span>{responsibility.title}</span>{' '}
                    <span
                      onClick={() => {
                        handleDeleteResponsibility(responsibility.id);
                      }}
                    >
                      X
                    </span>
                  </li>
                )
              )
            ) : (
              <li>No Responsibilities</li>
            )}
          </ul>
          <button onClick={addResponsibility}>Add responsibility</button>
        </div>
      </div>
    </>
  );
}

export default ParentResponsibilities;
