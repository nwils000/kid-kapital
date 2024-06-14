import React, { useContext, useEffect, useState } from 'react';
import { MainContext } from '../context/context';
import '../styles/child-dashboard.css';
import ChildDashboardNavbar from '../layout/ChildDashboardNavbar';
import { fetchUser } from '../api-calls/api';
import ResponsibilityModal from '../components/ResponsibilityModal';
import { useNavigate } from 'react-router-dom';

function formatDate(dateString) {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

export default function ChildDashboard() {
  const { main } = useContext(MainContext);
  const [selectedChildId, setSelectedChildId] = useState('all');
  const [showResponsibilityModal, setShowResponsibilityModal] = useState(false);
  const [currentResponsibility, setCurrentResponsibility] = useState({});
  const [currentChildName, setCurrentChildName] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchUser({ accessToken: main.state.accessToken, main });
    getFamilyStoreItems({ main });
  }, []);

  const handleResponsibilityClick = (responsibility, childName) => {
    setCurrentResponsibility(responsibility);
    setCurrentChildName(childName);
    setShowResponsibilityModal(true);
  };

  return (
    <>
      <ChildDashboardNavbar />
      <div className="child-dashboard">
        <div className="family-store">Family Store</div>
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
                          handleResponsibilityClick(
                            responsibility,
                            child.first_name
                          )
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
                            handleResponsibilityClick(
                              responsibility,
                              child.first_name
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
        <div className="responsibilities">
          <h2 className="hover" onClick={() => navigate('/responsibilities')}>
            My Responsibilities
          </h2>
          {main.state.profile.responsibilities
            .filter((responsibility) => !responsibility.completed)
            .map((responsibility, index) => (
              <div
                className="hover"
                onClick={() => handleResponsibilityClick(responsibility)}
                key={index}
              >
                {formatDate(responsibility.date)} - {responsibility.title}
              </div>
            ))}
        </div>
        <div className="wallet">Wallet</div>
        <ResponsibilityModal
          currentResponsibility={currentResponsibility}
          currentChildName={currentChildName}
          setShowResponsibilityModal={setShowResponsibilityModal}
          showResponsibilityModal={showResponsibilityModal}
        />
      </div>
    </>
  );
}
