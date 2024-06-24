import React, { useState, useContext, useEffect } from 'react';
import { MainContext } from '../context/context';
import '../styles/my-responsibilities.css';
import {
  createResponsibility,
  deleteResponsibility,
  editResponsibilitySeries,
  fetchChildResponsibilities,
  updateResponsibility,
} from '../api-calls/api';
import AddResponsibilityModal from '../components/AddResponsibilityModal';
import EditResponsibilityModal from '../components/EditResponsibilityModal';
import { FaLongArrowAltLeft, FaLongArrowAltRight } from 'react-icons/fa';
import ParentNavbar from '../layout/ParentNavbar';
import { useNavigate } from 'react-router-dom';

function ChildResponsibilities() {
  const { main } = useContext(MainContext);
  const [showAddResponsibilityModal, setShowAddResponsibilityModal] =
    useState(false);
  const [weekStart, setWeekStart] = useState(getSunday(new Date()));
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [responsibilities, setResponsibilities] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentResponsibility, setCurrentResponsibility] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    async function getResponsibilities() {
      try {
        const fetchedResponsibilities =
          main.state.childImSeeingsResponsibilities;
        let allResponsibilities = {};
        console.log('AFASFASFSAFSA', fetchedResponsibilities);

        fetchedResponsibilities.forEach((element) => {
          console.log('THE ELEMENT', element);
          if (!allResponsibilities[element.date]) {
            allResponsibilities[element.date] = [];
          }

          allResponsibilities[element.date].push({
            description: element.description,
            title: element.title,
            profile: element.profile,
            id: element.id,
            single: element.single,
            difficulty: element.difficulty,
            verified: element.verified,
            series: element.series,
            completed: element.completed,
            date: element.date,
          });
        });
        console.log('AFASFSFA', allResponsibilities);

        setResponsibilities(allResponsibilities);
      } catch (e) {
        console.error(e);
        const navigate = useNavigate();
      }
    }

    getResponsibilities();
  }, [main.state.childImSeeingsResponsibilities]);

  useEffect(() => {
    console.log('IN CHILDRESPONSIBILITIES', currentResponsibility);
  }, [currentResponsibility]);

  useEffect(() => {
    fetchChildResponsibilities({ main, childId: main.state.childImSeeingsId });
    console.log();
  }, []);

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

  async function addResponsibility({ title, description, difficulty, repeat }) {
    const formattedDate = formatDate(selectedDay);
    try {
      let newResponsibility = await createResponsibility({
        main,
        title,
        description,
        difficulty,
        verified: true,
        profileId: main.state.childImSeeingsId,
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
      fetchChildResponsibilities({
        main,
        childId: main.state.childImSeeingsId,
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
      profileId: main.state.childImSeeingsId,
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
        profileId: main.state.childImSeeingsId,
        description,
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
        id,
        profileId,
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
          profile: element.profile,
          verified: element.verified,
          completed: element.completed,
          single: element.single,
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

  return (
    <>
      <ParentNavbar />

      <div className="responsibilities-wrapper">
        <div className="sidebar left">
          <h2>Upcoming responsibilities</h2>
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
            {Object.values(responsibilities)
              .flat()
              .filter((resp) => {
                return !resp.completed;
              }).length > 5 && <div className="dots-bubble"></div>}
          </ul>
        </div>
        <div className="responsibilities-container">
          <h1>
            {
              main.state.profile.family.members.filter(
                (member) => member.id === main.state.childImSeeingsId
              )[0].first_name
            }
            's Responsibilities
          </h1>
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
                      className="responsibility-item hover"
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
              parentalControl={true}
              showAddResponsibilityModal={showAddResponsibilityModal}
              setShowAddResponsibilityModal={setShowAddResponsibilityModal}
              addResponsibility={addResponsibility}
            />
            <EditResponsibilityModal
              parentalControl={true}
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

export default ChildResponsibilities;
