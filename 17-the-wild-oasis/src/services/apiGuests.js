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
  const { data, error } = await supabase
    .from('guests')
    .select('*')
    .ilike('email', `%${search}%`);

  if (error) {
    console.log('searchEmail error', error);
    throw new Error('Search email error');
  }

  return data;
}
