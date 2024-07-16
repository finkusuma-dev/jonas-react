import supabase from './supabase';

export async function getCabins() {
  let { data, error } = await supabase.from('cabins').select('*');

  if (error) {
    console.log('getCabins error', error);
    throw new Error('Cabins cannot be loaded');
  }

  return data;
}
export async function deleteCabin(id) {
  // console.log('deleteCabin', id);
  const result = await supabase.from('cabins').delete().eq('id', id);

  console.log('delete result', result);

  if (result.error) {
    console.log('deleteCabins error', result.error);
    throw new Error('Cabin cannot be deleted');
  }

  return;
}
