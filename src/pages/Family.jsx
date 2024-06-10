import { useContext } from 'react';
import { MainContext } from '../context/context';
import ParentDashboardNavbar from '../layout/ParentDashboardNavbar';

export default function Family() {
  const { main } = useContext(MainContext);

  return (
    <>
      <ParentDashboardNavbar />
      <div>Family Manager</div>
    </>
  );
}
