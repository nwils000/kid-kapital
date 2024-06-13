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
  parent,
}) => {
  console.log('parenttttt', parent);
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
        parent,
      },
    });
    console.log('CREATE USER: ', response);
  } catch (error) {
    console.log('Error with createUser api call: ', error);
  }
};

export const createResponsibility = async ({
  main,
  title,
  description,
  profileId,
  verified,
  date,
}) => {
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
        verified,
        description,
        profile_id: profileId,
      },
    });
    console.log('CREATE RESPONSIBILITY: ', response);
    return response.data;
  } catch (error) {
    console.log('Error with createResponsibility api call: ', error);
  }
};

export const fetchResponsibilities = async ({ main }) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${baseUrl}/responsibilities/`,
      headers: {
        Authorization: `Bearer ${main.state.accessToken}`,
      },
    });
    console.log('FETCH RESPONSIBILITIES: ', response);
    return response;
  } catch (error) {
    console.log('Error with fetchResponsibility api call: ', error);
  }
};

export const fetchChildResponsibilities = async ({ main, childId }) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${baseUrl}/child-responsibilities/`,
      headers: {
        Authorization: `Bearer ${main.state.accessToken}`,
      },
      params: {
        child_id: childId,
      },
    });
    main.dispatch({
      type: 'SET_CHILD_IM_SEEINGS_RESPONSIBILITIES',
      childImSeeingsResponsibilities: response.data,
    });
    console.log('FETCHED CHILD RESPONSIBILITIES: ', response);
    return response;
  } catch (error) {
    console.log('Error with fetchChildResponsibility api call: ', error);
  }
};

export const deleteResponsibilities = async ({ main, id, profileId }) => {
  try {
    const response = await axios({
      method: 'delete',
      url: `${baseUrl}/delete-responsibility/`,
      headers: {
        Authorization: `Bearer ${main.state.accessToken}`,
      },
      data: {
        id,
        profile_id: profileId,
      },
    });
    console.log('DELETE RESPONSIBILITIES: ', response);
    return response;
  } catch (error) {
    console.log('Error with deleteResponsibility api call: ', error);
  }
};

export const updateResponsibility = async ({
  main,
  title,
  description,
  difficulty,
  completed,
  id,
  profileId,
}) => {
  try {
    const response = await axios({
      method: 'put',
      url: `${baseUrl}/update-responsibility/`,
      headers: {
        Authorization: `Bearer ${main.state.accessToken}`,
      },
      data: {
        id,
        title,
        description,
        difficulty,
        completed,
        profile_id: profileId,
      },
    });
    fetchUser({ accessToken: main.state.accessToken, main });
    console.log('UPDATE RESPONSIBILITIES: ', response);
    return response;
  } catch (error) {
    console.log('Error with updateResponsibility api call: ', error);
  }
};

export const approveResponsibility = async ({
  main,
  difficulty,
  approved,
  id,
}) => {
  try {
    const response = await axios({
      method: 'put',
      url: `${baseUrl}/approve-responsibility/`,
      headers: {
        Authorization: `Bearer ${main.state.accessToken}`,
      },
      data: {
        id,
        difficulty,
        verified: approved,
      },
    });
    fetchUser({ accessToken: main.state.accessToken, main });
    console.log('APPROVE RESPONSIBILITIES: ', response);
    return response;
  } catch (error) {
    console.log('Error with approveResponsibility api call: ', error);
  }
};

export const completeResponsibility = async ({ main, completed, id }) => {
  try {
    const response = await axios({
      method: 'put',
      url: `${baseUrl}/complete-responsibility/`,
      headers: {
        Authorization: `Bearer ${main.state.accessToken}`,
      },
      data: {
        id,
        completed,
      },
    });
    fetchUser({ accessToken: main.state.accessToken, main });
    console.log('COMPLETED RESPONSIBILITIES: ', response);
    return response;
  } catch (error) {
    console.log('Error with completeResponsibility api call: ', error);
  }
};
