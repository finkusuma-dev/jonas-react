// import { useEffect } from 'react';
import Heading from '../ui/Heading';
import Row from '../ui/Row';

function Dashboard() {
  // useEffect(function () {
  //   console.log('env', import.meta.env);
  // });

  return (
    <Row type="horizontal">
      <Heading as="h1">Dashboard</Heading>
      <p>TEST</p>
    </Row>
  );
}

export default Dashboard;
