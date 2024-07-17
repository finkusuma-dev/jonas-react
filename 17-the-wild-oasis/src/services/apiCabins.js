import supabase, { supabaseUrl } from './supabase';

export async function getCabins() {
  let { data, error } = await supabase.from('cabins').select('*');

  if (error) {
    console.log('getCabins error', error);
    throw new Error('Cabins cannot be loaded');
  }

  return data;
}

export async function insertCabin(newCabin) {
  const imageName = `${Math.floor(Math.random() * 1000000000)}-${
    newCabin.image.name
  }`.replace(/\//g, '');

  console.log('imageName', imageName);

  const imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  /// 1. Insert new cabin
  console.log('insertCabin', newCabin);

  const { data, error } = await supabase
    .from('cabins')
    .insert([{ ...newCabin, image: imagePath }])
    .select(); /// select is mandatory if we want to get the result data

  console.log('insertCabin result', data);

  if (error) {
    console.log('insertCabins error', error);
    throw new Error('Cabin could not be created');
  }

  /// 2. Upload image
  const { data: dataStorage, error: errorStorage } = await supabase.storage
    .from('cabin-images')
    .upload(imageName, newCabin.image);

  /// 3. Delete cabin data if upload failed
  if (errorStorage) {
    console.log('errorStorage', errorStorage);
    await supabase.from('cabins').delete().eq('id', data[0].id);
    throw new Error('Cabin image cannot be uploaded');
  }

  console.log('dataStorage', dataStorage);

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
