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
  filterField: PropTypes.string,
  options: PropTypes.array,
  props: PropTypes.any,
};

/**
 * Options can be:
 * Array of string: ['option-1','option-2']
 *  or
 * Array of object that has value & label: [{value: 'option-1', label:'Option 1'} ]
 */
function Filter({ filterField, options }) {
  // console.log('Filter', filterField, options);
  const [searchParams, setSearchParams] = useSearchParams();

  let filterValue = '';
  if (typeof options[0] === 'string') {
    filterValue = searchParams.get(filterField) || options[0];
  } else {
    filterValue = searchParams.get(filterField) || options[0].value;
  }

  return (
    <StyledFilter>
      {options.map((option) => {
        const value = typeof option === 'string' ? option : option.value;
        const label =
          typeof option === 'string'
            ? snakeCaseToCapFirstLetter(option)
            : option.label;

        //console.log(`Filter option, ${filterValue} ? ${value}, ${label}`);

        return (
          <FilterButton
            key={value}
            active={filterValue == value}
            onClick={() => {
              searchParams.delete('page');
              searchParams.set(filterField, value);
              // console.log('filter', filter);
              setSearchParams(searchParams);
            }}
          >
            {label}
          </FilterButton>
        );
      })}
    </StyledFilter>
  );
}

Filter.Button = FilterButton;

export default Filter;
