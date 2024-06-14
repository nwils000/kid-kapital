import React, { useContext, useState, useEffect } from 'react';
import { MainContext } from '../context/context';
import ParentDashboardNavbar from '../layout/ParentDashboardNavbar';
import {
  establishAllowancePeriod,
  fetchChildResponsibilities,
  fetchUser,
} from '../api-calls/api';
import { useNavigate } from 'react-router-dom';
import AllowancePeriodModal from '../components/AllowancePeriodModal';

export default function FamilyManager() {
  const { main } = useContext(MainContext);
  const [familyData, setFamilyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllowancePeriodModal, setShowAllowancePeriodModal] =
    useState(false);
  const [lastAllowanceDate, setLastAllowanceDate] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadFamilyData() {
      setLoading(true);
      try {
        let data = await fetchUser({
          accessToken: main.state.accessToken,
          main,
        });
        setFamilyData(data.family.members);
        setLastAllowanceDate(data.family.last_allowance_date);
        console.log('family data', data.family.members);
      } catch (error) {
        console.error('Failed to fetch family data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadFamilyData();
  }, [main.state.accessToken]);

  useEffect(() => {
    console.log('LAST ALLOWANCE DATE', lastAllowanceDate);
  }, [lastAllowanceDate]);

  const navigateToChild = async (childId) => {
    try {
      console.log('CHILDID', childId);
      main.dispatch({
        type: 'SET_CHILD_IM_SEEINGS_ID',
        childImSeeingsId: childId,
      });
      fetchChildResponsibilities({ main, childId });
      navigate('/child-responsibilities');
    } catch (e) {
      console.error(e);
    }
  };

  const setTheAllowancePeriod = async ({ periodType, allowanceDay }) => {
    try {
      establishAllowancePeriod({ main, periodType, allowanceDay });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <ParentDashboardNavbar />
      <div className="family-manager">
        <h1>Family Financial Manager</h1>
        <button onClick={() => setShowAllowancePeriodModal(true)}>
          Set Allowance Period
        </button>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Completed Tasks</th>
                <th>Total Difficulty Points</th>
                <th>Total Money</th>
                <th>Savings</th>
                <th>Interest Rate (%)</th>
                <th>Allowance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {familyData.map((member) => (
                <tr style={{ textAlign: 'center' }} key={member.id}>
                  <td onClick={() => navigateToChild(member.id)}>
                    {member.first_name}
                  </td>
                  <td>
                    <div>
                      <p>
                        {
                          member.responsibilities.filter((resp) => {
                            const respDate = new Date(resp.date);
                            if (lastAllowanceDate) {
                              const lastAllowanceDateObj = new Date(
                                lastAllowanceDate
                              );
                              return (
                                resp.completed &&
                                respDate >= lastAllowanceDateObj &&
                                respDate < new Date()
                              );
                            }
                            return resp.completed && respDate < new Date();
                          }).length
                        }
                      </p>
                    </div>
                  </td>
                  <td>
                    {member.responsibilities
                      .filter((resp) => {
                        const respDate = new Date(resp.date);
                        if (lastAllowanceDate) {
                          const lastAllowanceDateObj = new Date(
                            lastAllowanceDate
                          );
                          return (
                            resp.completed &&
                            resp.verified &&
                            respDate >= lastAllowanceDateObj &&
                            respDate < new Date()
                          );
                        }
                        return (
                          resp.completed &&
                          resp.verified &&
                          respDate < new Date()
                        );
                      })
                      .reduce(
                        (totalDifficulty, resp) =>
                          totalDifficulty + resp.difficulty,
                        0
                      )}
                  </td>
                  <td>{member.total_money}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <AllowancePeriodModal
          setTheAllowancePeriod={setTheAllowancePeriod}
          showAllowancePeriodModal={showAllowancePeriodModal}
          setShowAllowancePeriodModal={setShowAllowancePeriodModal}
        />
      </div>
    </>
  );
}
