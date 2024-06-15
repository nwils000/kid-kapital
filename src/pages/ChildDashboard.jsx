import React, { useContext, useEffect, useState } from 'react';
import { MainContext } from '../context/context';
import '../styles/child-dashboard.css';
import ChildDashboardNavbar from '../layout/ChildDashboardNavbar';
import {
  fetchUser,
  getFamilyStoreItems,
  updateResponsibility,
  deleteResponsibilities,
} from '../api-calls/api'; // Added API functions
import EditResponsibilityModal from '../components/EditResponsibilityModal';
import { useNavigate } from 'react-router-dom';
import Wallet from '../components/Wallet';

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
      await deleteResponsibilities({
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
      <ChildDashboardNavbar />
      <div className="child-dashboard">
        <Wallet />
        <div className="family-members">
          <h1 className="family-name">{main.state.profile.family.name}</h1>
          <div className="invitation-code">
            Invitation Code:
            <span style={{ fontWeight: '500' }}>
              {main.state.profile.family.invitation_code}
            </span>
          </div>
          <div style={{ maxWidth: '35rem', marginTop: '20px' }}>
            <h2>Family Responsibilities</h2>
            <h2>All Incomplete Responsibilities</h2>
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
            {selectedChildId === 'all'
              ? main.state.profile.family.members.map((child) =>
                  child.responsibilities
                    .filter((responsibility) => !responsibility.completed)
                    .map((responsibility) => (
                      <div
                        className="hover"
                        onClick={() =>
                          handleResponsibilityClick(responsibility, child.id)
                        }
                        key={responsibility.id}
                      >
                        {child.first_name}: {formatDate(responsibility.date)} -{' '}
                        {responsibility.title}
                      </div>
                    ))
                )
              : main.state.profile.family.members
                  .filter((child) => child.id.toString() === selectedChildId)
                  .map((child) =>
                    child.responsibilities
                      .filter((responsibility) => !responsibility.completed)
                      .map((responsibility) => (
                        <div
                          className="hover"
                          onClick={() =>
                            handleResponsibilityClick(responsibility, child.id)
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
        <div className="responsibilities">
          <h2 className="hover" onClick={() => navigate('/responsibilities')}>
            My Responsibilities
          </h2>
          {main.state.profile.responsibilities
            .filter((responsibility) => !responsibility.completed)
            .map((responsibility, index) => (
              <div
                className="hover"
                onClick={() =>
                  handleResponsibilityClick(
                    responsibility,
                    main.state.profile.id
                  )
                }
                key={index}
              >
                {formatDate(responsibility.date)} - {responsibility.title}
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
