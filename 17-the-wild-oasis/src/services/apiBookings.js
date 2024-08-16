import { PAGE_SIZE } from '../utils/constants';
import { camelToUnderscore, getToday } from '../utils/helpers';
import supabase from './supabase';

export async function getBookings({ filter, sort, page }) {
  // console.log('getBookings filter', filter);
  // console.log('getBookings sort', sort);

  let query = supabase.from('bookings').select(
    `id,
  created_at,
  start_date,
  end_date,
  num_nights,
  num_guests,
  total_price,
  status, cabins(id, name), guests(id, full_name, email)`,
    {
      count: 'exact',
    }
  );

  if (filter && filter.value !== 'all') {
    query = query[filter.operator ?? 'eq'](filter.field, filter.value);
  }

  if (sort) {
    query = query.order(camelToUnderscore(sort.field), {
      ascending: sort.direction === 'asc',
    });
  }

  if (page) {
    const from = (page - 1) * PAGE_SIZE + 1;
    const to = from + PAGE_SIZE - 1; // > count ? count : from + PAGE_SIZE - 1;
    query = query.range(from - 1, to - 1);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error(error);

    throw new Error('Booking not found');
  }

  return { data, count, error };
}

export async function getBooking(id) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, cabins(*), guests(*)')
    .eq('id', id)
    .single();

  if (error) {
    console.error(error);
    throw new Error('Booking not found');
  }

  return data;
}

// Returns all BOOKINGS that are were created after the given date. Useful to get bookings created in the last 30 days, for example.
export async function getBookingsAfterDate(date) {
  const { data, error } = await supabase
    .from('bookings')
    .select('created_at, total_price, extras_price')
    .gte('created_at', date)
    .lte('created_at', getToday({ end: true }))
    .order('created_at');
  if (error) {
    console.error(error);
    throw new Error('Bookings could not get loaded');
  }

  return data;
}

// Returns all STAYS that are were created after the given date
export async function getStaysAfterDate(date) {
  const { data, error } = await supabase
    .from('bookings')
    // .select('*')
    .select('*, guests(full_name)')
    .gte('start_date', date)
    .lte('start_date', getToday())
    .order('start_date');
  if (error) {
    console.error(error);
    throw new Error('Stays could not get loaded');
  }

  return data;
}

// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity() {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, guests(fullName, nationality, countryFlag)')
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`
    )
    .order('created_at');

  // Equivalent to this. But by querying this, we only download the data we actually need, otherwise we would need ALL bookings ever created
  // (stay.status === 'unconfirmed' && isToday(new Date(stay.startDate))) ||
  // (stay.status === 'checked-in' && isToday(new Date(stay.endDate)))

  if (error) {
    console.error(error);
    throw new Error('Bookings could not get loaded');
  }
  return data;
}

export async function updateBooking(id, obj) {
  const { data, error } = await supabase
    .from('bookings')
    .update(obj)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error('Booking could not be updated');
  }
  return data;
}

export async function deleteBooking(id) {
  const { error: deleteError } = await supabase
    .from('bookings')
    .delete()
    .eq('id', id);
  //   .select()
  // .single();

  const { count, countError } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: 'true' });

  // console.log('deleteBooking api, data', data);

  if (deleteError || countError) {
    console.error(deleteError);
    throw new Error('Booking could not be deleted');
  }

  return { count };
}
