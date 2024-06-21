import React, { useContext, useEffect, useState } from 'react';
import { MainContext } from '../context/context';
import '../styles/parent-dashboard.css';
import ParentDashboardNavbar from '../layout/ParentDashboardNavbar';
import {
  deleteResponsibility,
  fetchUser,
  getFamilyStoreItems,
  updateResponsibility,
} from '../api-calls/api';
import ApproveResponsibilityModal from '../components/ApproveResponsibilityModal';
import { useNavigate } from 'react-router-dom';
import UnapprovedPurchases from '../components/UnapprovedPurchases';
import EditResponsibilityModal from '../components/EditResponsibilityModal';

export default function ParentDashboard() {
  const { main } = useContext(MainContext);
  const [selectedChildIdNeedingApproval, setSelectedChildIdNeedingApproval] =
    useState('all');
  const [
    selectedChildIdIncompleteResponsibilities,
    setSelectedChildIdIncompleteResponsibilities,
  ] = useState('all');
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentResponsibility, setCurrentResponsibility] = useState({});

  const navigate = useNavigate();

  function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate() + 1}`;
  }

  useEffect(() => {
    fetchUser({ accessToken: main.state.accessToken, main });
    getFamilyStoreItems({ main });
  }, []);

  const handleResponsibilityClick = (responsibility, childName = '') => {
    setCurrentResponsibility(responsibility);
    setShowEditModal(true);
  };
  const handleApprovalClick = (responsibility, childName = '') => {
    setCurrentResponsibility(responsibility);
    setShowApproveModal(true);
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

  async function handleDeleteResponsibility(id, profileId) {
    try {
      await deleteResponsibility({
        main,
        profileId,
        id,
      });
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    console.log('IN DASHBOARD', currentResponsibility);
  }, [currentResponsibility]);

  return (
    <>
      <ParentDashboardNavbar />
      <div className="parent-dashboard">
        <div className="family-store">
          <UnapprovedPurchases />
        </div>
        <div className="family-members">
          <h1 className="family-name">{main.state.profile.first_name}</h1>

          <div className="invitation-code">
            <span style={{ fontWeight: '500' }}>
              {main.state.profile.family.name}
            </span>
          </div>
          <h2>Responsibilities Needing Approval</h2>
          <select
            onChange={(e) => setSelectedChildIdNeedingApproval(e.target.value)}
            value={selectedChildIdNeedingApproval}
          >
            <option value="all">All Kids</option>
            {main.state.profile.family.members
              .filter((member) => !member.parent)
              .map((child) => (
                <option key={child.id} value={child.id}>
                  {child.first_name}
                </option>
              ))}
          </select>
          <div className="dropdown-container" style={{ maxWidth: '35rem' }}>
            {selectedChildIdNeedingApproval === 'all'
              ? main.state.profile.family.members.map((child) =>
                  child.responsibilities
                    .filter(
                      (responsibility) =>
                        responsibility.verified === false &&
                        responsibility.completed === false
                    )
                    .map((responsibility) => (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'stretch',
                        }}
                        className="hover responsibility-item"
                        onClick={() =>
                          handleApprovalClick(responsibility, child.first_name)
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
                  .filter(
                    (child) =>
                      child.id.toString() === selectedChildIdNeedingApproval
                  )
                  .map((child) =>
                    child.responsibilities
                      .filter(
                        (responsibility) =>
                          responsibility.verified === false &&
                          responsibility.completed === false
                      )
                      .map((responsibility) => (
                        <div
                          onClick={() =>
                            handleApprovalClick(
                              responsibility,
                              child.first_name
                            )
                          }
                          className="child-responsibility-to-approve responsibility-item"
                          key={responsibility.id}
                        >
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
                  )}
          </div>
          <h2>Childrens Upcoming Responsibilities</h2>
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
                  .filter((responsibility) => !responsibility.completed)
                  .slice(0, 3)
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
                .filter(
                  (child) =>
                    child.id.toString() ===
                    selectedChildIdIncompleteResponsibilities
                )

                .map((child) =>
                  child.responsibilities
                    .filter((responsibility) => !responsibility.completed)
                    .slice(0, 8)
                    .map((responsibility) => (
                      <div
                        className="hover responsibility-item"
                        onClick={() =>
                          handleResponsibilityClick(
                            responsibility,
                            child.first_name
                          )
                        }
                        key={responsibility.id}
                      >
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
                )}
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

        <ApproveResponsibilityModal
          showApproveModal={showApproveModal}
          setShowApproveModal={setShowApproveModal}
          currentResponsibility={currentResponsibility}
          setCurrentResponsibility={setCurrentResponsibility}
        />
        <EditResponsibilityModal
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          currentResponsibility={currentResponsibility}
          setCurrentResponsibility={setCurrentResponsibility}
          editResponsibility={editResponsibility}
          handleDeleteResponsibility={handleDeleteResponsibility}
          parentalControl={true}
        />
      </div>
    </>
  );
}
