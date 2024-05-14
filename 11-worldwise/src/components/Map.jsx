import { useSearchParams, useNavigate } from 'react-router-dom';
import styles from './Map.module.css';

function Map() {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  return (
    <div className={styles.mapContainer} onClick={()=>{
      console.log('navigate to form')
      navigate('form');
    }}>
      <h3>Map</h3>
      <div>lat= {lat}</div>
      <div>lng= {lng}</div>
    </div>
  );
}

export default Map;
