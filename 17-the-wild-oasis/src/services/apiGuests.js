import supabase from './supabase';

export async function getGuests() {
  let { data, error } = await supabase.from('guests').select('*');

  if (error) {
    console.log('getGuests error', error);
    throw new Error('Guests cannot be loaded');
  }

  return data;
}
