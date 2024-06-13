/* function getPosition() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

async function fetchAddress() {
  // 1) We get the user's geolocation position
  const positionObj = await getPosition();
  const position = {
    latitude: positionObj.coords.latitude,
    longitude: positionObj.coords.longitude,
  };

  // 2) Then we use a reverse geocoding API to get a description of the user's address, so we can display it the order form, so that the user can correct it if wrong
  const addressObj = await getAddress(position);
  const address = `${addressObj?.locality}, ${addressObj?.city} ${addressObj?.postcode}, ${addressObj?.countryName}`;

  // 3) Then we return an object with the data that we are interested in
  return { position, address };
}
 */

import { createSlice } from '@reduxjs/toolkit';
import { toTitleCase } from '../../utils/helpers';

const initialState = {
  username: '',
  phone: '',
  address: '',
};

const userSlice = createSlice({
  initialState: initialState,
  name: 'user',
  reducers: {
    updateName: function (state, action) {
      state.username = toTitleCase(action.payload);
    },
  },
});

export const userActions = { ...userSlice.actions };
export default userSlice.reducer;
