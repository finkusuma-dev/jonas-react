import supabase from './supabase';

export async function getGuests() {
  let { data, error } = await supabase.from('guests').select('*');

  if (error) {
    console.log('getGuests error', error);
    throw new Error('Guests cannot be loaded');
  }

  return data;
}

export async function searchEmail(search) {
  if (!search.length) return [];

  // console.log('search email api, search=', search);

  const { data, error } = await supabase
    .from('guests')
    .select('*')
    .ilike('email', `%${search}%`);

  if (error) {
    console.log('searchEmail error', error);
    throw new Error('Search email error');
  }

  // console.log('data for', search, '=', data);

  return data;
}
