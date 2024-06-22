import React, { useContext, useEffect, useState } from 'react';
import { MainContext } from '../context/context';
import '../styles/child-dashboard.css';
import {
  fetchUser,
  getFamilyStoreItems,
  updateResponsibility,
  deleteResponsibility,
} from '../api-calls/api';
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
      navigate('/');
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
          <div
            style={{
              maxWidth: '35rem',

              maxHeight: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <h1 style={{ fontSize: '2rem' }} className="family-name">
              {main.state.profile.family.name}
            </h1>

            <div className="invitation-code"></div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                maxWidth: '35rem',
                marginTop: '20px',
                maxHeight: '100%',
              }}
            >
              <h2 className="family-heading">Family Responsibilities</h2>

              <select
                style={{
                  padding: '10px',
                  marginBottom: '8px',
                  width: '100%',
                  borderRadius: 8,
                }}
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
                        .slice(0, 3)
                        .map((responsibility) => (
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'stretch',
                              padding: '3px 10px',

                              cursor: 'pointer',
                            }}
                            className="hover responsibility-item"
                            onClick={() =>
                              handleResponsibilityClick(
                                responsibility,
                                child.id
                              )
                            }
                            key={responsibility.id}
                          >
                            <div
                              style={{
                                position: 'relative',
                                top: 5,
                                display: 'inline',
                              }}
                            >
                              {child.first_name}
                            </div>
                            <div className="responsibility-content">
                              <h4 className="responsibility-title">
                                {responsibility.title}
                              </h4>
                              <span>{formatDate(responsibility.date)}</span>
                            </div>
                          </div>
                        ))
                    )
                  : main.state.profile.family.members
                      .filter(
                        (child) => child.id.toString() === selectedChildId
                      )
                      .map((child) =>
                        child.responsibilities
                          .filter((responsibility) => !responsibility.completed)
                          .slice(0, 8)
                          .map((responsibility) => (
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'stretch',
                                padding: '10px',
                                margin: '5px 0',

                                cursor: 'pointer',
                              }}
                              className="hover responsibility-item"
                              onClick={() =>
                                handleResponsibilityClick(
                                  responsibility,
                                  child.id
                                )
                              }
                              key={responsibility.id}
                            >
                              <div className="responsibility-content">
                                <h4 className="responsibility-title">
                                  {responsibility.title}
                                </h4>
                                <span>{formatDate(responsibility.date)}</span>
                              </div>
                            </div>
                          ))
                      )}
              </div>
            </div>
          </div>
        </div>
        <div className="responsibilities">
          <h2
            className="hover"
            style={{ fontSize: 24 }}
            onClick={() => navigate('/responsibilities')}
          >
            My Upcoming Responsibilities
          </h2>
          {main.state.profile.responsibilities
            .filter((responsibility) => !responsibility.completed)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 5)
            .map((responsibility, index) => (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  padding: '10px',
                  margin: '5px 0',

                  cursor: 'pointer',
                }}
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
                  <span>{formatDate(responsibility.date)}</span>
                </div>
              </div>
            ))}
          {main.state.profile.responsibilities.filter(
            (responsibility) => !responsibility.completed
          ).length > 5 && <div className="dots-bubble"></div>}
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
