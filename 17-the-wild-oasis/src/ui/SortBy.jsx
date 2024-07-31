import PropTypes from 'prop-types';
import Select from './Select';
import { useSearchParams } from 'react-router-dom';

SortBy.propTypes = {
  options: PropTypes.array,
  onChange: PropTypes.func,
};

function SortBy({ options }) {
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <Select
      type="white"
      options={options}
      onChange={(e) => {
        searchParams.set('sort', e.target.value);
        // console.log('searchParams', searchParams);
        setSearchParams(searchParams);
      }}
    />
  );
}

export default SortBy;
