import GlobalStyled from './styles/GlobalStyled';
import Button from './ui/Button';
import Heading from './ui/Heading';
import Row from './ui/Row';

function App() {
  return (
    <>
      <GlobalStyled />
      <div>
        <Row>
          <Row type="horizontal">
            <Heading as="h1">Hello World!</Heading>
            <div>
              <Heading as="h2">Hello World2!</Heading>
              <Button onClick={() => alert('testing')}>Secondary</Button>
              <Button
                var="danger"
                size="small"
                onClick={() => alert('testing')}
              >
                Danger
              </Button>
            </div>
          </Row>
          <Row>
            <Heading as="h3">Hello World3!</Heading>
            <div>Test</div>
          </Row>
        </Row>
      </div>
    </>
  );
}

export default App;
