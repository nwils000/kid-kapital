import React, { useContext, useEffect } from 'react';
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
          {main.state.profile.family.members.map((child) => {
            console.log(child.id);
            return (
              <div key={child.id} style={{ width: '100%' }}>
                {child.first_name}{' '}
                {child.parent ? <span>(Parent)</span> : <span>(Child)</span>}
              </div>
            );
          })}
        </div>
        <div className="responsibilities">
          Children responsibilities to review
          {main.state.profile.family.members.map((child) => {
            return (
              <div key={child.id} style={{ width: '100%' }}>
                {child.first_name}{' '}
                {child.responsibilities.map((responsibility) => {
                  return (
                    <div key={responsibility.id}>{responsibility.title}</div>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div className="wallet">Wallet</div>
      </div>
    </>
  );
}
