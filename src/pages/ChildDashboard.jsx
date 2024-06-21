import React, { useContext, useEffect, useState } from 'react';
import { MainContext } from '../context/context';
import '../styles/child-dashboard.css';
import {
  fetchUser,
  getFamilyStoreItems,
  updateResponsibility,
  deleteResponsibility,
} from '../api-calls/api'; // Added API functions
import EditResponsibilityModal from '../components/EditResponsibilityModal';
import { useNavigate } from 'react-router-dom';
import Wallet from '../components/Wallet';
import ChildNavbar from '../layout/ChildNavbar';

function formatDate(dateString) {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

export default function ChildDashboard() {
  const { main } = useContext(MainContext);
  const [selectedChildId, setSelectedChildId] = useState('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentResponsibility, setCurrentResponsibility] = useState({});
  const [currentChildId, setCurrentChildId] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchUser({ accessToken: main.state.accessToken, main });
    getFamilyStoreItems({ main });
  }, []);

  const handleResponsibilityClick = (responsibility, childId) => {
    setCurrentResponsibility(responsibility);
    setCurrentChildId(childId);
    setShowEditModal(true);
  };

  async function editResponsibility({
    id,
    title,
    description,
    difficulty,
    completed,
  }) {
    try {
      await updateResponsibility({
        id,
        main,
        title,
        description,
        profileId: main.state.profile.id,
        difficulty,
        completed,
        date: currentResponsibility.date,
      });
    } catch (e) {
      console.error(e);
    }
  }

  async function handleDeleteResponsibility(id) {
    try {
      await deleteResponsibility({
        main,
        profileId: main.state.profile.id,
        id,
      });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      <ChildNavbar />
      <div className="child-dashboard">
        <Wallet />
        <div className="family-members">
          <h1 className="family-name">{main.state.profile.first_name}</h1>

          <div className="invitation-code">
            <span style={{ fontWeight: '500' }}>
              {main.state.profile.family.name}
            </span>
          </div>
          <div
            style={{ maxWidth: '35rem', marginTop: '20px', maxHeight: '100%' }}
          >
            <h2>Family Responsibilities</h2>

            <select
              onChange={(e) => setSelectedChildId(e.target.value)}
              value={selectedChildId}
            >
              <option value="all">Whole Family</option>
              {main.state.profile.family.members.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.first_name}
                </option>
              ))}
            </select>
            <div className="dropdown-container">
              {selectedChildId === 'all'
                ? main.state.profile.family.members.map((child) =>
                    child.responsibilities
                      .filter((responsibility) => !responsibility.completed)

                      .map((responsibility) => (
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'stretch',
                          }}
                          className="hover responsibility-item"
                          onClick={() =>
                            handleResponsibilityClick(
                              responsibility,
                              child.first_name
                            )
                          }
                          key={responsibility.id}
                        >
                          <div
                            style={{
                              position: 'relative',
                              top: 5,
                              display: 'inline',
                              paddingRight: 5,
                              fontSize: '.5rem',
                            }}
                          >
                            {child.first_name}
                          </div>
                          <div className="responsibility-content">
                            <h4 className="responsibility-title">
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
                        </div>
                      ))
                  )
                : main.state.profile.family.members
                    .filter((child) => child.id.toString() === selectedChildId)
                    .map((child) =>
                      child.responsibilities
                        .filter((responsibility) => !responsibility.completed)
                        .slice(0, 8)
                        .map((responsibility) => (
                          <div
                            className="hover"
                            onClick={() =>
                              handleResponsibilityClick(
                                responsibility,
                                child.id
                              )
                            }
                            key={responsibility.id}
                          >
                            {formatDate(responsibility.date)} -{' '}
                            {responsibility.title}
                          </div>
                        ))
                    )}
            </div>
          </div>
        </div>
        <div className="responsibilities">
          <h2 className="hover" onClick={() => navigate('/responsibilities')}>
            My Upcoming Responsibilities
          </h2>
          {main.state.profile.responsibilities
            .filter((responsibility) => !responsibility.completed)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 6)
            .map((responsibility, index) => (
              <div
                className="hover responsibility-item-big"
                onClick={() =>
                  handleResponsibilityClick(
                    responsibility,
                    main.state.profile.id
                  )
                }
                key={index}
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
              </div>
            ))}
        </div>
        <EditResponsibilityModal
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          currentResponsibility={currentResponsibility}
          setCurrentResponsibility={setCurrentResponsibility}
          editResponsibility={editResponsibility}
          handleDeleteResponsibility={handleDeleteResponsibility}
          currentChildId={currentChildId}
        />
      </div>
    </>
  );
}
