import React, { useContext, useState, useEffect } from 'react';
import { MainContext } from '../context/context';
import ParentDashboardNavbar from '../layout/ParentDashboardNavbar';
import { fetchChildResponsibilities, fetchUser } from '../api-calls/api';
import { useNavigate } from 'react-router-dom';
import ChildDashboardNavbar from '../layout/ChildDashboardNavbar';
import '../styles/family-manager.css';
import ParentNavbar from '../layout/ParentNavbar';
import ChildNavbar from '../layout/ChildNavbar';

export default function FamilyManager() {
  const { main } = useContext(MainContext);
  const [familyData, setFamilyData] = useState([]);
  const [loading, setLoading] = useState(true);

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

        console.log('Family data:', data.family.members);
      } catch (error) {
        console.error('Failed to fetch family data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadFamilyData();
  }, []);

  const navigateToChild = async (childId) => {
    console.log('CHILDID', childId);
    main.dispatch({
      type: 'SET_CHILD_IM_SEEINGS_ID',
      childImSeeingsId: childId,
    });
    fetchChildResponsibilities({ main, childId });
    navigate('/child-responsibilities');
  };

  return (
    <>
      {main.state.profile.parent ? <ParentNavbar /> : <ChildNavbar />}
      <h1
        style={{
          fontSize: '2rem',
          margin: '20px 20px 0 20px',
          textAlign: 'center',
        }}
      >
        {main.state.profile.family.name}
      </h1>
      <p style={{ textAlign: 'center', margin: 0 }}>
        Invitation code: {main.state.profile.family.invitation_code}
      </p>
      <div className="family-manager">
        {loading ? (
          <p className="loading">Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Completed Tasks</th>
                <th>Total Difficulty Points</th>
                <th>Total Money</th>
                <th>Savings</th>
              </tr>
            </thead>
            <tbody>
              {familyData.map((member) => (
                <tr key={member.id}>
                  <td
                    className="hover"
                    onClick={() => navigateToChild(member.id)}
                  >
                    {member.first_name}
                  </td>
                  <td>
                    {
                      member.responsibilities.filter((resp) => {
                        const respDate = new Date(resp.date);
                        return (
                          resp.completed &&
                          (!lastAllowanceDate ||
                            respDate >= new Date(lastAllowanceDate)) &&
                          respDate < new Date()
                        );
                      }).length
                    }
                  </td>
                  <td>
                    {member.responsibilities
                      .filter(
                        (resp) =>
                          resp.completed &&
                          (!lastAllowanceDate ||
                            new Date(resp.date) >=
                              new Date(lastAllowanceDate)) &&
                          new Date(resp.date) < new Date()
                      )
                      .reduce((total, resp) => total + resp.difficulty, 0)}
                  </td>
                  <td>{member.total_money}</td>
                  <td>{member.savings || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button
          onClick={() => navigate('/add-family-member')}
          style={{ marginLeft: 0 }}
        >
          Add Child
        </button>
      </div>
    </>
  );
}
