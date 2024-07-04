import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toTitleCase } from '../../utils/helpers';
import { getAddress } from '../../services/apiGeocoding';

function getPosition() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

// async function fetchAddress() {
// }

export const fetchAddress = createAsyncThunk(
  'user/fetchAddress',
  async function () {
    // 1) We get the user's geolocation position
    const positionObj = await getPosition();
    const position = {
      latitude: positionObj.coords.latitude,
      longitude: positionObj.coords.longitude,
    };

    // 2) Then we use a reverse geocoding API to get a description of the user's address, so we can display it the order form, so that the user can correct it if wrong
    const addressObj = await getAddress(position);
    console.log('addressObj', addressObj);
    const address = `${addressObj?.locality}, ${addressObj?.city} ${addressObj?.postcode}, ${addressObj?.countryName}`;

    // 3) Then we return an object with the data that we are interested in
    // This will become PAYLOAD of the fulfilled state
    return { position, address };
  },
);

const initialState = {
  username: '',
  phone: '',
  address: '',
  status: 'idle',
  position: {},
  error: '',
};

const userSlice = createSlice({
  initialState: initialState,
  name: 'user',
  reducers: {
    updateName: function (state, action) {
      state.username = toTitleCase(action.payload);
    },
  },
  extraReducers: (builders) =>
    builders
      .addCase(fetchAddress.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAddress.rejected, (state) => {
        state.error =
          'There was a problem getting your location. Make sure to fill this field!'; //action.error.message;
        state.status = 'error';
      })
      .addCase(fetchAddress.fulfilled, (state, action) => {
        console.log('payload', action.payload);
        state.address = action.payload.address;
        state.position = action.payload.position;
        state.status = 'idle';
      }),
});

const getUser = (store) => store.user;
// const getUserAddress = (store) => store.user.address;
// const getStatus = (store) => store.user.status;
// const getError = (store) => store.user.error;

export const userActions = { ...userSlice.actions, fetchAddress };
export const userGetters = { getUser };
export default userSlice.reducer;
