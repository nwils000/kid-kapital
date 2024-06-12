import React, { useContext, useEffect, useState } from 'react';
import { MainContext } from '../context/context';
import '../styles/parent-dashboard.css';
import ParentDashboardNavbar from '../layout/ParentDashboardNavbar';
import {
  approveResponsibility,
  fetchUser,
  updateResponsibility,
} from '../api-calls/api';
import ApproveResponsibilityModal from '../components/ApproveResponsibilityModal';

export default function ParentDashboard() {
  const { main } = useContext(MainContext);
  const [selectedChildIdNeedingApproval, setSelectedChildIdNeedingApproval] =
    useState('all');
  const [
    selectedChildIdIncompleteResponsibilities,
    setSelectedChildIdIncompleteResponsibilities,
  ] = useState('all');
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [currentResponsibility, setCurrentResponsibility] = useState({});

  function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate() + 1}`;
  }

  useEffect(() => {}, [selectedChildIdNeedingApproval]);

  useEffect(() => {
    fetchUser({ accessToken: main.state.accessToken, main });
  }, []);

  async function saveResponsibility({ id, difficulty }) {
    try {
      await approveResponsibility({
        id,
        main,
        difficulty,
      });
    } catch (e) {
      console.error('Error editing responsibility:', e);
    }
  }

  return (
    <>
      <ParentDashboardNavbar />
      <div className="parent-dashboard">
        <div className="family-store">Family Store</div>
        <div className="family-members">
          <h1 className="family-name">{main.state.profile.family.name}</h1>
          <div className="invitation-code">
            Invitation Code:{' '}
            <span style={{ fontWeight: '500' }}>
              {main.state.profile.family.invitation_code}
            </span>
          </div>
          <h2>Responsibilities Needing Approval</h2>
          <select
            onChange={(e) => setSelectedChildIdNeedingApproval(e.target.value)}
            value={selectedChildIdNeedingApproval}
          >
            <option value="all">Whole Family</option>
            {main.state.profile.family.members.map((child) => (
              <option key={child.id} value={child.id}>
                {child.first_name}
              </option>
            ))}
          </select>
          <div style={{ maxWidth: '35rem' }}>
            {selectedChildIdNeedingApproval === 'all'
              ? main.state.profile.family.members.map((child) =>
                  child.responsibilities
                    .filter((responsibility) => {
                      return (
                        responsibility.verified === false &&
                        responsibility.completed === false
                      );
                    })
                    .map((responsibility) => (
                      <div
                        onClick={() => {
                          setShowApproveModal(true);
                          setCurrentResponsibility(responsibility);
                        }}
                        className="child-responsibility-to-approve"
                        key={responsibility.id}
                      >
                        {child.first_name}: {formatDate(responsibility.date)} -{' '}
                        {responsibility.title}
                      </div>
                    ))
                )
              : main.state.profile.family.members
                  .filter((child) => {
                    return (
                      child.id.toString() === selectedChildIdNeedingApproval
                    );
                  })
                  .map((child) => {
                    return child.responsibilities
                      .filter((responsibility) => {
                        return (
                          responsibility.verified === false &&
                          responsibility.completed === false
                        );
                      })
                      .map((responsibility) => (
                        <div
                          onClick={() => {
                            setShowApproveModal(true);
                            setCurrentResponsibility(responsibility);
                          }}
                          className="child-responsibility-to-approve"
                          key={responsibility.id}
                        >
                          {formatDate(responsibility.date)} -{' '}
                          {responsibility.title}
                        </div>
                      ));
                  })}
          </div>
          <h2>All Incomplete Responsibilities</h2>
          <select
            onChange={(e) =>
              setSelectedChildIdIncompleteResponsibilities(e.target.value)
            }
            value={selectedChildIdIncompleteResponsibilities}
          >
            <option value="all">Whole Family</option>
            {main.state.profile.family.members.map((child) => (
              <option key={child.id} value={child.id}>
                {child.first_name}
              </option>
            ))}
          </select>
          {selectedChildIdIncompleteResponsibilities === 'all'
            ? main.state.profile.family.members.map((child) =>
                child.responsibilities
                  .filter((responsibility) => {
                    return responsibility.completed === false;
                  })
                  .map((responsibility) => (
                    <div key={responsibility.id}>
                      {child.first_name}: {formatDate(responsibility.date)} -{' '}
                      {responsibility.title}
                    </div>
                  ))
              )
            : main.state.profile.family.members
                .filter((child) => {
                  return (
                    child.id.toString() ===
                    selectedChildIdIncompleteResponsibilities
                  );
                })
                .map((child) => {
                  return child.responsibilities
                    .filter((responsibility) => {
                      return responsibility.completed === false;
                    })
                    .map((responsibility) => (
                      <div key={responsibility.id}>
                        {formatDate(responsibility.date)} -{' '}
                        {responsibility.title}
                      </div>
                    ));
                })}
        </div>
        <div className="responsibilities">
          My Responsibilities
          {main.state.profile.responsibilities
            .filter((resp) => {
              return resp.completed === false;
            })
            .map((responsibility) => (
              <div key={responsibility.id}>
                {formatDate(responsibility.date)} - {responsibility.title}
              </div>
            ))}
        </div>
        <div className="wallet">Wallet</div>
        <ApproveResponsibilityModal
          showApproveModal={showApproveModal}
          setShowApproveModal={setShowApproveModal}
          currentResponsibility={currentResponsibility}
          setCurrentResponsibility={setCurrentResponsibility}
        />
      </div>
    </>
  );
}
