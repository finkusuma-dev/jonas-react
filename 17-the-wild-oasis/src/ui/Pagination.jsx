import {
  HiChevronDoubleLeft,
  HiChevronDoubleRight,
  HiChevronLeft,
  HiChevronRight,
} from 'react-icons/hi2';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useSearchParams } from 'react-router-dom';
import { PAGE_SIZE } from '../utils/constants';

const StyledPagination = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const P = styled.p`
  font-size: 1.4rem;
  margin-left: 0.8rem;

  & span {
    font-weight: 600;
  }
`;

const Buttons = styled.div`
  display: flex;
  gap: 0.6rem;
`;

const PaginationButton = styled.button`
  background-color: ${(props) =>
    props.active ? ' var(--color-brand-600)' : 'var(--color-grey-50)'};
  color: ${(props) => (props.active ? ' var(--color-brand-50)' : 'inherit')};
  border: none;
  border-radius: var(--border-radius-sm);
  font-weight: 500;
  font-size: 1.4rem;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.6rem 1.2rem;
  transition: all 0.3s;

  &:has(span:last-child) {
    padding-left: 0.4rem;
  }

  &:has(span:first-child) {
    padding-right: 0.4rem;
  }

  & svg {
    height: 1.8rem;
    width: 1.8rem;
  }

  &:disabled {
    color: var(--color-grey-300);
  }

  &:hover:not(:disabled) {
    background-color: var(--color-brand-600);
    color: var(--color-brand-50);
  }
`;

Pagination.propTypes = {
  count: PropTypes.number,
};

function Pagination({ count }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page') || 1);

  const from = (page - 1) * PAGE_SIZE + 1;
  const to = from + PAGE_SIZE - 1 > count ? count : from + PAGE_SIZE - 1;

  // console.log('count', count, 'to', to);

  const isFirstPage = from === 1;
  const isLastPage = to === count;

  // console.log(
  //   'page',
  //   page,
  //   'limit',
  //   limit,
  //   'from',
  //   from,
  //   'to',
  //   to,
  //   'isLastPage',
  //   isLastPage
  // );

  function handleFirst() {
    if (isFirstPage) return;

    searchParams.set('page', 1);
    setSearchParams(searchParams);
  }
  function handlePrev() {
    if (isFirstPage) return;

    searchParams.set('page', page - 1);
    setSearchParams(searchParams);
  }

  function handleNext() {
    if (isLastPage) return;

    searchParams.set('page', page + 1);
    setSearchParams(searchParams);
  }

  function handleLast() {
    if (isLastPage) return;

    searchParams.set('page', Math.trunc((count - 1) / PAGE_SIZE) + 1);
    setSearchParams(searchParams);
  }

  return (
    <StyledPagination>
      <P>
        Showing <span>{from}</span> to <span>{to}</span> of <span>{count}</span>{' '}
        results
      </P>
      <Buttons>
        <PaginationButton disabled={isFirstPage} onClick={handleFirst}>
          <HiChevronDoubleLeft />
          <span>First</span>
        </PaginationButton>
        <PaginationButton disabled={isFirstPage} onClick={handlePrev}>
          <HiChevronLeft />
          <span>Prev</span>
        </PaginationButton>
        <PaginationButton disabled={isLastPage} onClick={handleNext}>
          <HiChevronRight />
          <span>Next</span>
        </PaginationButton>
        <PaginationButton disabled={isLastPage} onClick={handleLast}>
          <HiChevronDoubleRight />
          <span>Last</span>
        </PaginationButton>
      </Buttons>
    </StyledPagination>
  );
}

export default Pagination;
