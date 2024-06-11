import React, { useContext } from 'react';
import { MainContext } from '../context/context';
import '../styles/child-dashboard.css';
import ChildDashboardNavbar from '../layout/ChildDashboardNavbar';

export default function ChildDashboard() {
  const { main } = useContext(MainContext);

  return (
    <>
      <ChildDashboardNavbar />
      <div className="child-dashboard">
        <div className="family-store">Family Store</div>
        <div className="family-members">
          <h1 className="family-name">{main.state.profile.family.name}</h1>
          <div className="invitation-code">
            Invitation Code:{' '}
            <span style={{ fontWeight: '500' }}>
              {main.state.profile.family.invitation_code}
            </span>
          </div>
          {main.state.profile.family.members.map((x) => {
            return (
              <div style={{ width: '100%' }}>
                {x.first_name}{' '}
                {x.parent ? <span>(Parent)</span> : <span>(Child)</span>}
              </div>
            );
          })}
        </div>
        <div className="responsibilities">
          My Responsibilities
          {main.state.profile.responsibilities.map((responsibility) => {
            return <div key={responsibility.id}>{responsibility.title}</div>;
          })}
        </div>
        <div className="wallet">Wallet</div>
      </div>
    </>
  );
}
