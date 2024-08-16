// import { useEffect } from 'react';
import DashboardLayout from '../features/dashboard/DashboardLayout';
import Heading from '../ui/Heading';
import Row from '../ui/Row';
import DashboardFilter from './DashboardFilter';

function Dashboard() {
  // useEffect(function () {
  //   console.log('env', import.meta.env);
  // });

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Dashboard</Heading>
        <DashboardFilter />
      </Row>
      <DashboardLayout />
    </>
  );
}

export default Dashboard;
