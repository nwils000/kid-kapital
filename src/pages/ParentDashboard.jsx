import React, { useContext } from 'react';
import { MainContext } from '../context/context';
import '../styles/parent-dashboard.css';
import ParentDashboardNavbar from '../layout/ParentDashboardNavbar';

export default function ParentDashboard() {
  const { main } = useContext(MainContext);

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
          {main.state.profile.family.members.map((x) => {
            return (
              <div style={{ width: '100%' }}>
                {x.first_name}{' '}
                {x.parent ? <span>(Parent)</span> : <span></span>}
              </div>
            );
          })}
        </div>
        <div className="responsibilities">My Responsibilities</div>
        <div className="wallet">Wallet</div>
      </div>
    </>
  );
}
