import supabase from './supabase';

export async function login({ email, password }) {
  // console.log('login', email, password);
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) throw new Error(error.message);

  // console.log('Login api', data, 'error', error);

  return { data, error };
}
export async function logout() {
  // console.log('login', email, password);
  const { data, error } = await supabase.auth.signOut();

  // console.log('Logout api', data, 'error', error);

  return { data, error };
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

  return { user, error };
}
