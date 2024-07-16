import supabase from './supabase';

export async function getCabins() {
  let { data, error } = await supabase.from('cabins').select('*');

  if (error) {
    console.log('getCabins error', error);
    throw new Error('Cabins cannot be loaded');
  }

  return data;
}

export async function insertCabin(newCabin) {
  // console.log('deleteCabin', id);
  const { data, error } = await supabase.from('cabins').insert([newCabin]);
  // .select();

  console.log('insertCabin result', data);

  if (error) {
    console.log('insertCabins error', error);
    throw new Error('Failed to insert a cabin');
  }

  return data;
}

export async function deleteCabin(id) {
  // console.log('deleteCabin', id);
  const result = await supabase.from('cabins').delete().eq('id', id);

  // console.log('delete result', result);

  if (result.error) {
    console.log('deleteCabins error', result.error);
    throw new Error('Cabin cannot be deleted');
  }

  return;
}
