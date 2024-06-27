import React, { useContext, useEffect, useState } from 'react';
import { MainContext } from '../context/context';
import '../styles/parent-dashboard.css';
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
import ParentNavbar from '../layout/ParentNavbar';

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
  const [currentChildId, setCurrentChildId] = useState();

  const navigate = useNavigate();

  function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate() + 1}`;
  }

  useEffect(() => {
    fetchUser({ accessToken: main.state.accessToken, main });
    getFamilyStoreItems({ main });
  }, []);

  const handleResponsibilityClick = (responsibility, childId) => {
    setCurrentChildId(childId);
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
  }, [currentResponsibility]);

  return (
    <>
      <ParentNavbar />
      <div className="parent-dashboard">
        <div className="family-store-side">
          <UnapprovedPurchases />
        </div>
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
            <h2 className="family-heading">
              Responsibilities Needing Approval
            </h2>
            <select
              style={{
                padding: '10px',
                marginBottom: '8px',
                width: '100%',
                borderRadius: 8,
              }}
              onChange={(e) =>
                setSelectedChildIdNeedingApproval(e.target.value)
              }
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
                            padding: '3px 10px',

                            cursor: 'pointer',
                          }}
                          className="responsibility-item"
                          onClick={() =>
                            handleApprovalClick(
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
                                ? formatDate(responsibility.date)
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
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'stretch',
                              padding: '3px 10px',
                              margin: '5px 0',
                              cursor: 'pointer',
                            }}
                            onClick={() =>
                              handleApprovalClick(
                                responsibility,
                                child.first_name
                              )
                            }
                            className="responsibility-item"
                            key={responsibility.id}
                          >
                            <div className="responsibility-content">
                              <h4 className="responsibility-title">
                                {responsibility.title}
                              </h4>
                              <span>
                                {responsibility.date
                                  ? formatDate(responsibility.date)
                                  : ''}
                              </span>
                            </div>
                          </div>
                        ))
                    )}
            </div>
            <h2 className="family-heading">
              Children's Upcoming Responsibilities
            </h2>
            <select
              style={{
                padding: '10px',
                marginBottom: '8px',
                width: '100%',
                borderRadius: 8,
              }}
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
            <div className="dropdown-container">
              {selectedChildIdIncompleteResponsibilities === 'all'
                ? main.state.profile.family.members.map((child) =>
                    child.responsibilities
                      .filter((responsibility) => !responsibility.completed)

                      .map((responsibility) => (
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'stretch',
                            padding: '3px 10px',

                            cursor: 'pointer',
                          }}
                          className="responsibility-item"
                          onClick={() =>
                            handleResponsibilityClick(responsibility, child.id)
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
                            <span>
                              {responsibility.date
                                ? formatDate(responsibility.date)
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
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'stretch',
                              padding: '10px',
                              margin: '5px 0',
                              cursor: 'pointer',
                            }}
                            className="responsibility-item"
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
                              <span>
                                {responsibility.date
                                  ? formatDate(responsibility.date)
                                  : ''}
                              </span>
                            </div>
                          </div>
                        ))
                    )}
            </div>
          </div>
        </div>

        <div className="responsibilities">
          <h2
            style={{ fontSize: 24 }}
            className="hover"
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
                    {responsibility.date ? formatDate(responsibility.date) : ''}
                  </span>
                </div>
              </div>
            ))}
          {main.state.profile.responsibilities.filter(
            (responsibility) => !responsibility.completed
          ).length > 5 && <div className="dots-bubble"></div>}
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
          currentChildId={currentChildId}
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
