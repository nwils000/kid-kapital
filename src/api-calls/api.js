import axios from 'axios';

// const baseUrl = 'http://127.0.0.1:8000';
const baseUrl = 'https://app-social-media.fly.dev';

export const getToken = async ({ main, username, password }) => {
  try {
    const response = await axios.post(`${baseUrl}/token/`, {
      username: username,
      password: password,
    });
    console.log('Token Response: ', response);
    const accessToken = response.data.access;
    main.dispatch({
      type: 'SET_ACCESS_TOKEN',
      accessToken: accessToken,
    });
    return accessToken;
  } catch (error) {
    console.log('Error with getToken api call: ', error);
    main.dispatch({
      type: 'SET_ACCESS_TOKEN',
      accessToken: undefined,
    });
  }
};

export const fetchUser = async ({ accessToken, main }) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${baseUrl}/profile/`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('PROFILE: ', response);
    main.dispatch({
      type: 'SET_PROFILE',
      profile: response.data,
    });
  } catch (error) {
    console.log('Error with fetchUser api call: ', error);
    profile.dispatch({
      type: 'SET_ACCESS_TOKEN',
      accessToken: undefined,
    });
  }
};

export const createUser = async ({
  username,
  password,
  firstName,
  lastName,
}) => {
  try {
    const response = await axios({
      method: 'post',
      url: `${baseUrl}/create-user/`,
      data: {
        username,
        password: password,
        first_name: firstName,
        last_name: lastName,
      },
    });
    console.log('CREATE USER: ', response);
  } catch (error) {
    console.log('Error with createUser api call: ', error);
  }
};
