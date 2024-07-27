import PropTypes from 'prop-types';
import { useSearchParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { snakeCaseToCapFirstLetter } from '../utils/helpers';

const StyledFilter = styled.div`
  border: 1px solid var(--color-grey-100);
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-sm);
  border-radius: var(--border-radius-sm);
  padding: 0.4rem;
  display: flex;
  gap: 0.4rem;
`;

const FilterButton = styled.button`
  background-color: var(--color-grey-0);
  border: none;

  ${(props) =>
    props.active &&
    css`
      background-color: var(--color-brand-600);
      color: var(--color-brand-50);
    `}

  border-radius: var(--border-radius-sm);
  font-weight: 500;
  font-size: 1.4rem;
  /* To give the same height as select */
  padding: 0.44rem 0.8rem;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    background-color: var(--color-brand-600);
    color: var(--color-brand-50);
  }
`;

Filter.propTypes = {
  children: PropTypes.any,
  name: PropTypes.string,
  options: PropTypes.array,
};

function Filter({ name, options }) {
  console.log('Filter', name, options);
  const [searchParams, setSearchParams] = useSearchParams();

  const filterValue = searchParams.get(name) || options[0];
  return (
    <StyledFilter>
      {options.map((option) => (
        <FilterButton
          key={option}
          active={filterValue === option}
          onClick={() => {
            const filter = { [name]: option };
            // console.log('filter', filter);
            setSearchParams(filter);
          }}
        >
          {snakeCaseToCapFirstLetter(option)}
        </FilterButton>
      ))}
    </StyledFilter>
  );
}

Filter.Button = FilterButton;

export default Filter;
