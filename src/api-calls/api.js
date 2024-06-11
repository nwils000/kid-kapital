import axios from 'axios';

const baseUrl = 'http://127.0.0.1:8000';

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
    return response.data;
  } catch (error) {
    console.log('Error with fetchUser api call: ', error);
    main.dispatch({
      type: 'SET_ACCESS_TOKEN',
      accessToken: undefined,
    });
  }
};

export const createUser = async ({
  familyHubInvitationCode,
  newFamilyHubName,
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
        family_hub_name: newFamilyHubName,
        family_hub_invitation_code: familyHubInvitationCode,
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

export const createResponsibility = async ({ main, title, date }) => {
  console.log(main);
  try {
    const response = await axios({
      method: 'post',
      url: `${baseUrl}/create-responsibility/`,
      headers: {
        Authorization: `Bearer ${main.state.accessToken}`,
      },
      data: {
        title,
        date,
      },
    });
    console.log('CREATE USER: ', response);
  } catch (error) {
    console.log('Error with createResponsibility api call: ', error);
  }
};
