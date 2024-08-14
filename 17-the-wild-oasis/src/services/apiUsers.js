import supabase, { supabaseUrl } from './supabase';

export async function login({ email, password }) {
  // console.log('login', email, password);
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) throw new Error(error.message);

  return { data };
}
export async function logout() {
  const { data, error } = await supabase.auth.signOut();

  // console.log('Logout api', data, 'error', error);
  if (error) throw new Error(error.message);

  return { data };
}

export async function loggedUser() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // console.log('loggedUser session', session);

  if (!session) return null;

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // console.log('LoggedUser user', user, error);
  if (error) throw new Error(error.message);

  return { user };
}

export async function signUp({ email, password, fullName }) {
  let { data, error } = await supabase.auth.signUp(
    {
      email: email,
      password: password,
    },
    {
      data: {
        fullName,
        avatar: '',
      },
    }
  );

  if (error) throw new Error(error.message);

  return data;
}
export async function updateUser({ password, fullName, avatar }) {
  /// Update password
  if (password) {
    const { dataPassword, errorPassword } = await supabase.auth.updateUser({
      password: password,
    });

    console.log('dataPassword', dataPassword);

    if (errorPassword) throw new Error(errorPassword.message);

    return dataPassword;
  }
  /// Update Data
  else {
    let imagePath;

    /// 2. Upload avatar if it's an object
    if (typeof avatar === 'object') {
      const imageName = `${Math.floor(Math.random() * 1000000000)}-${
        avatar.name
      }`.replace(/\//g, '');

      console.log('imageName', imageName);

      imagePath = `${supabaseUrl}/storage/v1/object/public/avatars/${imageName}`;

      var { error: errorStorage } = await supabase.storage
        .from('avatars')
        .upload(imageName, avatar);

      // console.log('dataStorage', dataStorage, errorStorage);
    }

    /// Update fullName & avatar.
    /// Update avatar to the new image if it's not a string && error uploading image
    const { data: dataUser, error: errorUser } = await supabase.auth.updateUser(
      {
        data: {
          fullName,
          avatar:
            typeof avatar !== 'string' && !errorStorage ? imagePath : avatar,
        },
      }
    );

    console.log('dataUser', dataUser);

    if (errorStorage) {
      console.log('errorStorage', errorStorage);
      throw new Error('Avatar image cannot be uploaded');
    }
    if (errorUser) throw new Error(errorUser.message);

    return dataUser;
  }
}
