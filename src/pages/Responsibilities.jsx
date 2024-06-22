import React, { useState, useContext, useEffect } from 'react';
import { MainContext } from '../context/context';
import '../styles/my-responsibilities.css';
import {
  createResponsibility,
  deleteResponsibility,
  editResponsibilitySeries,
  fetchResponsibilities,
  updateResponsibility,
} from '../api-calls/api';
import AddResponsibilityModal from '../components/AddResponsibilityModal';
import EditResponsibilityModal from '../components/EditResponsibilityModal';
import { FaLongArrowAltLeft, FaLongArrowAltRight } from 'react-icons/fa';
import ParentNavbar from '../layout/ParentNavbar';
import ChildNavbar from '../layout/ChildNavbar';

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
          console.log('THE ELEMENT', element);
          if (!allResponsibilities[element.date]) {
            allResponsibilities[element.date] = [];
          }

          allResponsibilities[element.date].push({
            description: element.description,
            title: element.title,
            profile: element.profile,
            id: element.id,
            difficulty: element.difficulty,
            verified: element.verified,
            completed: element.completed,
            series: element.series,
            single: element.single,
            date: element.date,
          });
        });
        console.log('AFASFSFA', allResponsibilities);

        setResponsibilities(allResponsibilities);
      } catch (e) {
        const navigate = useNavigate();

        console.error(e);
      }
    }

    getResponsibilities();
  }, [main.state.profile]);

  useEffect(() => {
    console.log('IN RESPONSIBILITIES', currentResponsibility);
  }, [currentResponsibility]);

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

  function formatDateForLocalDisplay(dateString) {
    const date = new Date(dateString);
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

  async function addResponsibility({ title, description, difficulty, repeat }) {
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
        repeat,
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

  async function handleEditSeries({
    seriesId,
    title,
    startDate,
    repeatInfo,
    description,
    difficulty,
    verified,
  }) {
    await editResponsibilitySeries({
      main,
      profileId: main.state.profile.id,
      seriesId,
      title,
      startDate,
      repeatInfo,
      description,
      difficulty,
      verified,
    });
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

  async function handleDeleteResponsibility(id, profileId) {
    try {
      const updatedResponsibilitiesData = await deleteResponsibility({
        main,
        profileId,
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
          single: element.single,
          difficulty: element.difficulty,
          verified: element.verified,
          completed: element.completed,
          profile: element.profile,
          series: element.series,
          date: element.date,
        });
      });

      setResponsibilities(allResponsibilities);
    } catch (e) {
      console.log(e);
    }
  }

  const daysOfWeek = generateWeekDays(weekStart);
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
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

  function parseDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return new Date(year, month - 1, day);
  }

  return (
    <>
      {main.state.profile.parent ? <ParentNavbar /> : <ChildNavbar />}
      <div className="responsibilities-wrapper">
        <div className="sidebar left">
          <h2>Upcoming Responsibilities</h2>
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
                .slice(0, 5)
                .map((responsibility, index) => (
                  <li
                    onClick={() => {
                      setCurrentResponsibility(responsibility);
                      setShowEditModal(true);
                    }}
                    key={index}
                    className="hover responsibility-item-big"
                  >
                    <div className="responsibility-content-big">
                      <h4 className="responsibility-title-big">
                        {responsibility.title}
                      </h4>
                      <span>
                        {responsibility.date
                          ? parseInt(responsibility.date.slice(5, 7)) +
                            '/' +
                            parseInt(responsibility.date.slice(8, 10))
                          : ''}
                      </span>
                    </div>
                  </li>
                ))
            ) : (
              <li>No upcoming responsibilities</li>
            )}
          </ul>
        </div>
        <div className="responsibilities-container">
          <h1>{main.state.profile.first_name}'s Responsibilities</h1>
          <h3>{currentMonth}</h3>
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
                  <div
                    style={{
                      display: 'flex',
                      gap: '2px',
                      flexDirection: 'column',
                    }}
                  >
                    <p style={{ fontSize: '.7rem', fontWeight: '400' }}>
                      {dayNames[day.getDay()]}
                    </p>
                    <p style={{ fontWeight: '600' }}>{day.getDate()}</p>
                  </div>
                </div>
              );
            })}
            <button onClick={() => handleWeekChange(true)}>
              <FaLongArrowAltRight />
            </button>
          </div>
          <div className="selected-day-responsibilities">
            <h3>
              Responsibilities for {formatDateForLocalDisplay(selectedDay)}:
            </h3>
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
                      className="hover responsibility-item"
                    >
                      <div className="responsibility-content">
                        <h4 className="responsibility-title">
                          {responsibility.title}
                          <p className="responsibility-description">
                            {responsibility.description}
                          </p>
                        </h4>
                      </div>
                    </li>
                  ))
              ) : (
                <li>No responsibilities for today</li>
              )}
            </ul>
            <button onClick={() => setShowAddResponsibilityModal(true)}>
              Add Responsibility
            </button>
            <AddResponsibilityModal
              parentalControl={false}
              showAddResponsibilityModal={showAddResponsibilityModal}
              setShowAddResponsibilityModal={setShowAddResponsibilityModal}
              addResponsibility={addResponsibility}
            />
            <EditResponsibilityModal
              parentalControl={false}
              showEditModal={showEditModal}
              setShowEditModal={setShowEditModal}
              currentResponsibility={currentResponsibility}
              setCurrentResponsibility={setCurrentResponsibility}
              editResponsibility={editResponsibility}
              handleDeleteResponsibility={handleDeleteResponsibility}
              handleEditSeries={handleEditSeries}
            />
          </div>
        </div>
        <div className="right"></div>
      </div>
    </>
  );
}

export default Responsibilities;
