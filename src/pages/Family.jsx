import React, { useContext, useState, useEffect } from 'react';
import { MainContext } from '../context/context';
import ParentDashboardNavbar from '../layout/ParentDashboardNavbar';
import { fetchUser } from '../api-calls/api';

export default function FamilyManager() {
  const { main } = useContext(MainContext);
  const [familyData, setFamilyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allowancePeriod, setAllowancePeriod] = useState(14);
  const [showModal, setShowModal] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);

  useEffect(() => {
    async function loadFamilyData() {
      setLoading(true);
      try {
        let data = await fetchUser({
          accessToken: main.state.accessToken,
          main,
        });
        setFamilyData(data.family.members);
        console.log('family data', data.family.members);
      } catch (error) {
        console.error('Failed to fetch family data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadFamilyData();
  }, []);

  const handleEditClick = (member) => {
    setSelectedChild(member);
    setShowModal(true);
  };

  return (
    <>
      <ParentDashboardNavbar />
      <div className="family-manager">
        <h1>Family Financial Manager</h1>
        <button onClick={console.log() /* do some type of modal*/}>
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
              {familyData.map((member) => {
                return (
                  <tr style={{ textAlign: 'center' }} key={member.id}>
                    <td>{member.first_name}</td>
                    <td>
                      <div>
                        {
                          <p>
                            {
                              member.responsibilities.filter(
                                (resp) => resp.completed
                              ).length
                            }
                          </p>
                        }
                      </div>
                    </td>
                    <td>
                      {member.responsibilities
                        .filter((resp) => resp.completed)
                        .reduce(
                          (totalDifficulty, resp) =>
                            totalDifficulty + resp.difficulty,
                          0
                        )}
                    </td>
                    {/* <td>${member.totalMoney}</td>
                  <td>${member.savings}</td> */}
                    {/* <td>{member.interestRate}</td>
                  <td>${member.allowance}</td> */}
                    <td>
                      <button onClick={() => handleEditClick(member)}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(member.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {showModal && <div>modal</div>}
      </div>
    </>
  );
}
