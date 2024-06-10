import { useContext } from 'react';
import { MainContext } from '../context/context';
import ParentDashboardNavbar from '../layout/ParentDashboardNavbar';

export default function FamilyStore() {
  const { main } = useContext(MainContext);

  return (
    <>
      <ParentDashboardNavbar />
      <div>Family Store</div>
    </>
  );
}
