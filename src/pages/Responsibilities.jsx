import React, { useState, useContext, useEffect } from 'react';
import { MainContext } from '../context/context';
import '../styles/my-responsibilities.css';
import {
  createResponsibility,
  deleteResponsibilities,
  fetchResponsibilities,
  updateResponsibility,
} from '../api-calls/api';
import ParentDashboardNavbar from '../layout/ParentDashboardNavbar';
import ChildDashboardNavbar from '../layout/ChildDashboardNavbar';
import AddResponsibilityModal from '../components/AddResponsibilityModal';
import EditResponsibilityModal from '../components/EditResponsibilityModal';
import { FaLongArrowAltLeft, FaLongArrowAltRight } from 'react-icons/fa';

function Responsibilities() {
  const { main } = useContext(MainContext);
  const [showAddResponsibilityModal, setShowAddResponsibilityModal] =
    useState(false);
  const [weekStart, setWeekStart] = useState(getSunday(new Date()));
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [responsibilities, setResponsibilities] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentResponsibility, setCurrentResponsibility] = useState({});

  useEffect(() => {
    async function getResponsibilities() {
      try {
        const fetchedResponsibilities = await fetchResponsibilities({ main });
        let allResponsibilities = {};

        fetchedResponsibilities.data.forEach((element) => {
          if (!allResponsibilities[element.date]) {
            allResponsibilities[element.date] = [];
          }

          allResponsibilities[element.date].push({
            description: element.description,
            title: element.title,
            id: element.id,
            difficulty: element.difficulty,
            verified: element.verified,
            completed: element.completed,
            date: element.date,
          });
        });
        console.log('AFASFSFA', allResponsibilities);

        setResponsibilities(allResponsibilities);
      } catch (e) {
        console.error(e);
      }
    }

    getResponsibilities();
  }, [main.state.profile]);

  function getSunday(d) {
    const date = new Date(d);
    const day = date.getDay();

    const diff = date.getDate() - day;

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
    return `${String(date.getMonth() + 1)}/${String(date.getDate()).padStart(
      2,
      '0'
    )}`;
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

  async function addResponsibility({ title, description, difficulty }) {
    const formattedDate = formatDate(selectedDay);
    try {
      let newResponsibility = await createResponsibility({
        main,
        title,
        description,
        difficulty,
        verified: main.state.profile.parent ? true : false,
        profileId: main.state.profile.id,
        date: formattedDate,
      });

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

  async function editResponsibility({
    id,
    title,
    description,
    difficulty,
    completed,
  }) {
    const formattedDate = formatDate(selectedDay);
    try {
      let updatedResponsibility = await updateResponsibility({
        id,
        main,
        title,
        description,
        profileId: main.state.profile.id,
        difficulty,
        completed,
        date: formattedDate,
      });

      const updatedResponsibilities = responsibilities[formattedDate]
        ? responsibilities[formattedDate].map((responsibility) =>
            responsibility.id === id
              ? updatedResponsibility.data
              : responsibility
          )
        : [updatedResponsibility];

      setResponsibilities((prev) => ({
        ...prev,
        [formattedDate]: updatedResponsibilities,
      }));
    } catch (e) {
      console.error('Error editing responsibility:', e);
    }
  }

  async function handleDeleteResponsibility(id) {
    try {
      const updatedResponsibilitiesData = await deleteResponsibilities({
        main,
        profileId: main.state.profile.id,
        id,
      });

      let allResponsibilities = {};

      updatedResponsibilitiesData.data.forEach((element) => {
        if (!allResponsibilities[element.date]) {
          allResponsibilities[element.date] = [];
        }

        allResponsibilities[element.date].push({
          description: element.description,
          title: element.title,
          id: element.id,
          difficulty: element.difficulty,
          verified: element.verified,
          completed: element.completed,
          date: element.date,
        });
      });

      setResponsibilities(allResponsibilities);
    } catch (e) {
      console.log(e);
    }
  }

  // const handleEditResponsibility = (id) => {
  //   setCurrentResponsibility(responsibility);
  //   setShowEditModal(true);
  // };

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
      {main.state.profile.parent ? (
        <ParentDashboardNavbar />
      ) : (
        <ChildDashboardNavbar />
      )}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8rem' }}>
        <div className="sidebar left">
          <h2>All Responsibilities</h2>
          <ul className="responsibilities-list">
            {Object.values(responsibilities)
              .flat()
              .filter((resp) => {
                return !resp.completed;
              }).length > 0 ? (
              Object.values(responsibilities)
                .flat()
                .filter((resp) => {
                  return !resp.completed;
                })
                .map((responsibility, index) => (
                  <li
                    onClick={() => {
                      setCurrentResponsibility(responsibility);
                      setShowEditModal(true);
                    }}
                    key={index}
                    className="responsibility-item"
                  >
                    <div className="responsibility-content">
                      <h4 className="responsibility-title">
                        {responsibility.title}
                      </h4>
                      <span>
                        {formatDateForDisplay(new Date(responsibility.date))}
                      </span>
                    </div>
                  </li>
                ))
            ) : (
              <li>No Responsibilities</li>
            )}
          </ul>
        </div>
        <div className="responsibilities-container">
          <h1 style={{ fontSize: '2rem' }}>
            {main.state.profile.first_name}'s Responsibilities
          </h1>
          <h2>{currentMonth}</h2>
          <div className="week-days">
            <button onClick={() => handleWeekChange(false)}>
              <FaLongArrowAltLeft />
            </button>
            {daysOfWeek.map((day, index) => {
              return (
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
              );
            })}
            <button onClick={() => handleWeekChange(true)}>
              <FaLongArrowAltRight />
            </button>
          </div>
          <div className="selected-day-responsibilities">
            <h3>Responsibilities for {formatDateForDisplay(selectedDay)}:</h3>
            <ul>
              {responsibilities[formatDate(selectedDay)] &&
              responsibilities[formatDate(selectedDay)].filter((resp) => {
                return !resp.completed;
              }).length > 0 ? (
                responsibilities[formatDate(selectedDay)]
                  .filter((resp) => !resp.completed)
                  .map((responsibility, index) => (
                    <li
                      onClick={() => {
                        setCurrentResponsibility(responsibility);
                        setShowEditModal(true);
                      }}
                      key={index}
                      className="responsibility-item"
                    >
                      <div className="responsibility-content">
                        <h4 className="responsibility-title">
                          {responsibility.title}
                        </h4>
                      </div>
                    </li>
                  ))
              ) : (
                <li>No Responsibilities</li>
              )}
            </ul>
            <button onClick={() => setShowAddResponsibilityModal(true)}>
              Add Responsibility
            </button>
            <AddResponsibilityModal
              showAddResponsibilityModal={showAddResponsibilityModal}
              setShowAddResponsibilityModal={setShowAddResponsibilityModal}
              addResponsibility={addResponsibility}
            />
            <EditResponsibilityModal
              showEditModal={showEditModal}
              setShowEditModal={setShowEditModal}
              currentResponsibility={currentResponsibility}
              setCurrentResponsibility={setCurrentResponsibility}
              editResponsibility={editResponsibility}
              handleDeleteResponsibility={handleDeleteResponsibility}
            />
          </div>
        </div>
        <div className="right"></div>
      </div>
    </>
  );
}

export default Responsibilities;
