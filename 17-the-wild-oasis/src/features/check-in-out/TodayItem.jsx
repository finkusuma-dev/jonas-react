import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Tag from '../../ui/Tag';
import { Flag } from '../../ui/Flag';
import Button from '../../ui/Button';
import CheckoutButton from './CheckoutButton';

const StyledTodayItem = styled.li`
  display: grid;
  grid-template-columns: 9rem 2rem 1fr 7rem 9rem;
  gap: 1.2rem;
  align-items: center;

  font-size: 1.4rem;
  padding: 0.8rem 0;
  border-bottom: 1px solid var(--color-grey-100);

  &:first-child {
    border-top: 1px solid var(--color-grey-100);
  }
`;

const Guest = styled.div`
  font-weight: 500;
`;

TodayItem.propTypes = {
  item: PropTypes.obj,
};

function TodayItem({ item }) {
  const {
    id,
    status,
    num_nights,
    guests: { full_name, nationality, country_flag },
  } = item;

  // console.log('item', item);
  return (
    <StyledTodayItem>
      <>
        {status === 'unconfirmed' && <Tag type="green">Arriving</Tag>}
        {status === 'checked-in' && <Tag type="yellow">Departing</Tag>}
      </>
      {<Flag src={country_flag} alt={`Flag of ${nationality}`} />}
      <Guest>{full_name}</Guest>
      <div>{num_nights} nights</div>
      {status === 'unconfirmed' && (
        <Button size="small" as={Link} to={`/checkin/${id}`}>
          Check in
        </Button>
      )}
      {status === 'checked-in' && <CheckoutButton bookingId={id} />}
    </StyledTodayItem>
  );
}

export default TodayItem;
