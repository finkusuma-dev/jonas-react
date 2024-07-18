import supabase, { supabaseUrl } from './supabase';

export async function getCabins() {
  let { data, error } = await supabase.from('cabins').select('*').order('name');

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

  let query = supabase.from('cabins');
  query = query.insert([{ ...newCabin, image: imagePath }]);
  const { data, error } = await query.select(); /// select is mandatory if we want to get the result data

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

export async function updateCabin(cabin, cabinId) {
  console.log('cabinId', cabinId);
  console.log('cabin', cabin);
  console.log('image type', typeof cabin.image);

  const isEdit = cabinId !== null;
  const isUploadImage = !isEdit || typeof cabin.image === 'object';
  const imageFileObject = isUploadImage ? cabin.image : null;

  let cabinData = {
    ...cabin,
  };

  if (isUploadImage) {
    var imageName = `${Math.floor(Math.random() * 1000000000)}-${
      cabin.image.name
    }`.replace(/\//g, '');

    console.log('imageName', imageName);

    const imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

    cabinData = {
      ...cabin,
      image: imagePath,
    };
  }

  console.log('updateCabin', cabinData, 'cabinId', cabinId);

  /// 1. Insert new cabin
  let query = supabase.from('cabins');

  if (isEdit) {
    query = query.update(cabinData).eq('id', cabinId);
  } else {
    query = query.insert([cabinData]);
  }

  const { data, error } = await query.select(); /// select is mandatory if we want to get the result data

  console.log('updateCabin result', data, 'data[0].id', data[0].id);

  if (error) {
    console.log('updateCabins error', error);
    throw new Error('Cabin could not be updated');
  }

  /// 2. Upload image
  if (isUploadImage) {
    const { data: dataStorage, error: errorStorage } = await supabase.storage
      .from('cabin-images')
      .upload(imageName, imageFileObject);

    /// 3. Delete cabin data if upload failed
    if (errorStorage) {
      console.log('errorStorage', errorStorage);
      // if (!isEdit) {
      //   await supabase.from('cabins').delete().eq('id', data.id);
      // }
      throw new Error('Cabin image cannot be uploaded');
    }
    console.log('dataStorage', dataStorage);
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
