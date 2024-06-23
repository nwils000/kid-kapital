import axios from 'axios';

const baseUrl = 'http://127.0.0.1:8000';
// const baseUrl = 'https://family-finance-server.fly.dev';

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
  difficulty,
  profileId,
  verified,
  date,
  repeat,
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
        difficulty,
        description,
        profile_id: profileId,
        repeat,
      },
    });
    fetchUser({ accessToken: main.state.accessToken, main });
    main.dispatch({
      type: 'SET_CHILD_IM_SEEINGS_RESPONSIBILITIES',
      childImSeeingsResponsibilities: main.state.childImSeeingsResponsibilities,
    });
    console.log('CREATE RESPONSIBILITY: ', response);
    return response.data;
  } catch (error) {
    console.log('Error with createResponsibility api call: ', error);
  }
};

export const editResponsibilitySeries = async ({
  seriesId,
  main,
  title,
  startDate,
  repeatInfo,
  description,
  difficulty,
  verified,
  profileId,
}) => {
  try {
    console.log('PROFILE ID AT API CALL', profileId);
    const response = await axios({
      method: 'put',
      url: `${baseUrl}/edit-responsibility-series/`,
      headers: {
        Authorization: `Bearer ${main.state.accessToken}`,
      },
      data: {
        series_id: seriesId,
        title,
        start_date: startDate,
        repeat: repeatInfo,
        description,
        difficulty,
        profile_id: profileId,
        verified,
      },
    });
    fetchUser({ accessToken: main.state.accessToken, main });
    console.log('EDIT RESPONSIBILITY SERIES: ', response);

    return response.data;
  } catch (error) {
    console.log('Error with editResponsibilitySeries api call: ', error);
  }
};

export const deleteResponsibilitySeries = async ({ seriesId, main }) => {
  try {
    const response = await axios({
      method: 'delete',
      url: `${baseUrl}/delete-responsibility-series/`,
      headers: {
        Authorization: `Bearer ${main.state.accessToken}`,
      },
      data: {
        series_id: seriesId,
      },
    });

    console.log('DELETE RESPONSIBILITY SERIES: ', response);
    fetchUser({ accessToken: main.state.accessToken, main });

    return response.data;
  } catch (error) {
    console.log('Error with deleteResponsibilitySeries api call: ', error);

    main.dispatch({
      type: 'ERROR',
      message: 'Failed to delete responsibility series',
    });
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
    await fetchUser({ accessToken: main.state.accessToken, main });
    console.log('FETCHED CHILD RESPONSIBILITIES: ', response);
    return response;
  } catch (error) {
    console.log('Error with fetchChildResponsibility api call: ', error);
  }
};

export const deleteResponsibility = async ({ main, id, profileId }) => {
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
    fetchUser({ accessToken: main.state.accessToken, main });
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
  title,
  description,
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
        title,
        description,
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

export const approveWholeSeries = async ({
  main,
  title,
  description,
  profile,
  difficulty,
  approved,
  repeatInfo,
  startDate,
  id,
  seriesId,
  justApprove = false,
}) => {
  try {
    const response = await axios({
      method: 'put',
      url: `${baseUrl}/approve-whole-series/`,
      headers: {
        Authorization: `Bearer ${main.state.accessToken}`,
      },
      data: {
        title,
        profile_id: profile,
        description,
        series_id: seriesId,
        id,
        repeat: repeatInfo,
        start_date: startDate,
        difficulty,
        verified: approved,
        just_approve: justApprove,
      },
    });
    fetchUser({ accessToken: main.state.accessToken, main });
    console.log('APPROVE WHOLE SERIES: ', response);
    return response;
  } catch (error) {
    console.log('Error with approveWholeSeries api call: ', error);
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

export const establishAllowancePeriod = async ({
  main,
  allowanceDay,
  periodType,
}) => {
  console.log(main);
  try {
    const response = await axios({
      method: 'post',
      url: `${baseUrl}/set-allowance-period/`,
      headers: {
        Authorization: `Bearer ${main.state.accessToken}`,
      },
      data: {
        period_type: periodType,
        allowance_day: allowanceDay,
      },
    });
    fetchUser({ accessToken: main.state.accessToken, main });
    console.log('ALLOWANCE PERIOD: ', response);
    return response.data;
  } catch (error) {
    console.log('Error with establishAllowancePeriod api call: ', error);
  }
};

export const createStoreItem = async ({ main, name, price }) => {
  try {
    const response = await axios({
      method: 'post',
      url: `${baseUrl}/create-store-item/`,
      headers: {
        Authorization: `Bearer ${main.state.accessToken}`,
      },
      data: {
        name,
        price,
      },
    });
    main.dispatch({
      type: 'SET_FAMILY_STORE_ITEMS',
      familyStoreItems: response.data,
    });
    await fetchUser({ accessToken: main.state.accessToken, main });
    console.log('CREATE STORE ITEM: ', response);
    return response.data;
  } catch (error) {
    console.error('Error with createStoreItem api call: ', error);
  }
};

export const updateStoreItem = async ({ main, id, name, price }) => {
  try {
    const response = await axios({
      method: 'put',
      url: `${baseUrl}/update-store-item/`,
      headers: {
        Authorization: `Bearer ${main.state.accessToken}`,
      },
      data: {
        id,
        name,
        price,
      },
    });
    main.dispatch({
      type: 'SET_FAMILY_STORE_ITEMS',
      familyStoreItems: response.data,
    });
    await fetchUser({ accessToken: main.state.accessToken, main });
    console.log('UPDATE STORE ITEMS: ', response);
    return response.data;
  } catch (error) {
    console.error('Error with updateStoreItem api call: ', error);
  }
};

export const getFamilyStoreItems = async ({ main }) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${baseUrl}/get-store-items/`,
      headers: {
        Authorization: `Bearer ${main.state.accessToken}`,
      },
    });
    main.dispatch({
      type: 'SET_FAMILY_STORE_ITEMS',
      familyStoreItems: response.data,
    });
    await fetchUser({ accessToken: main.state.accessToken, main });
    console.log('GET STORE ITEMS: ', response);
    return response.data;
  } catch (error) {
    console.error('Error with getFamilyStoreItems api call: ', error);
  }
};

export const deleteFamilyStoreItems = async ({ main, itemId }) => {
  try {
    const response = await axios({
      method: 'delete',
      url: `${baseUrl}/delete-store-items/`,
      headers: {
        Authorization: `Bearer ${main.state.accessToken}`,
      },
      data: {
        item_id: itemId,
      },
    });
    console.log('DELETE STORE ITEMS: ', response);
    await fetchUser({ accessToken: main.state.accessToken, main });
    main.dispatch({
      type: 'SET_FAMILY_STORE_ITEMS',
      familyStoreItems: response.data,
    });
    return response.data;
  } catch (error) {
    console.error('Error with deleteFamilyStoreItems api call: ', error);
  }
};

export const handleApproveStoreItemRequest = async ({ main, itemId }) => {
  try {
    const response = await axios({
      method: 'put',
      url: `${baseUrl}/approve-store-item/`,
      headers: {
        Authorization: `Bearer ${main.state.accessToken}`,
      },
      data: {
        id: itemId,
      },
    });
    main.dispatch({
      type: 'SET_FAMILY_STORE_ITEMS',
      familyStoreItems: response.data,
    });
    await fetchUser({ accessToken: main.state.accessToken, main });
    console.log('APPROVE STORE ITEM: ', response);

    return response.data;
  } catch (error) {
    console.error('Error with handleApproveStoreItemRequest api call: ', error);
  }
};

export const purchaseStoreItem = async ({ main, itemId }) => {
  try {
    const response = await axios({
      method: 'put',
      url: `${baseUrl}/purchase-store-item/`,
      headers: {
        Authorization: `Bearer ${main.state.accessToken}`,
      },
      data: {
        id: itemId,
      },
    });
    await fetchUser({ accessToken: main.state.accessToken, main });
    console.log('PURCHASE STORE ITEM: ', response);
    main.dispatch({
      type: 'SET_PROFILE',
      profile: response.data,
    });
    return response.data;
  } catch (error) {
    console.error('Error with purchaseStoreItem api call: ', error);
  }
};

export const getUnnaprovedPurchases = async ({ main }) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${baseUrl}/list-unnaproved-purchases/`,
      headers: {
        Authorization: `Bearer ${main.state.accessToken}`,
      },
    });

    console.log('GET PURCHASES: ', response);
    return response.data;
  } catch (error) {
    console.error('Error with getPurchases api call: ', error);
  }
};

export const updatePurchaseApproval = async ({
  main,
  purchaseId,
  newStatus,
}) => {
  try {
    const response = await axios({
      method: 'put',
      url: `${baseUrl}/approve-purchase/`,
      headers: {
        Authorization: `Bearer ${main.state.accessToken}`,
      },
      data: {
        id: purchaseId,
        approved: newStatus,
      },
    });
    await fetchUser({ accessToken: main.state.accessToken, main });
    console.log('UPDATE PURCHASE APPROVAL: ', response);
    return response.data;
  } catch (error) {
    console.error('Error with updatePurchaseApproval api call:', error);
  }
};

export const listAccountTypes = async ({ main }) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${baseUrl}/list-account-types/`,
      headers: {
        Authorization: `Bearer ${main.state.accessToken}`,
      },
    });
    await fetchUser({ accessToken: main.state.accessToken, main });
    console.log('LIST ACCOUNT TYPES: ', response);
    return response.data;
  } catch (error) {
    console.error('Error with listAccountTypes api call: ', error);
  }
};

export const createFinancialAccount = async ({
  main,
  accountType,
  interestRate,
  interestPeriodType,
  interestDay,
  potentialLoss,
  potentialGain,
}) => {
  try {
    console.log('POTENTIALLLLL', interestDay);
    const response = await axios({
      method: 'post',
      url: `${baseUrl}/create-account/`,
      headers: {
        Authorization: `Bearer ${main.state.accessToken}`,
      },
      data: {
        account_type: accountType,
        interest_rate: interestRate,
        interest_period_type: interestPeriodType,
        interest_day: interestDay,
        potential_loss: potentialLoss,
        potential_gain: potentialGain,
      },
    });
    await fetchUser({ accessToken: main.state.accessToken, main });
    console.log('CREATE FINANCIAL ACCOUNT: ', response);
    return response.data;
  } catch (error) {
    console.error('Error with createFinancialAccount api call: ', error);
  }
};

export const updateFinancialAccount = async ({
  main,
  accountId,
  accountType,
  interestRate,
  interestPeriodType,
  interestDay,
}) => {
  try {
    const response = await axios({
      method: 'put',
      url: `${baseUrl}/update-account/`,
      headers: {
        Authorization: `Bearer ${main.state.accessToken}`,
      },
      data: {
        id: accountId,
        account_type: accountType,
        interest_rate: interestRate,
        interest_period_type: interestPeriodType,
        interest_day: interestDay,
      },
    });
    console.log('UPDATE FINANCIAL ACCOUNT: ', response);
    await fetchUser({ accessToken: main.state.accessToken, main });
    return response.data;
  } catch (error) {
    console.error('Error with updateFinancialAccount api call: ', error);
  }
};

export const viewAvailableAccounts = async ({ main }) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${baseUrl}/view-available-accounts/`,
      headers: {
        Authorization: `Bearer ${main.state.accessToken}`,
      },
    });
    console.log('VIEW AVAILABLE ACCOUNTS: ', response);
    await fetchUser({ accessToken: main.state.accessToken, main });
    return response.data;
  } catch (error) {
    console.error('Error with viewAvailableAccounts api call: ', error);
  }
};

export const deleteFinancialAccount = async ({ main, accountId }) => {
  try {
    const response = await axios({
      method: 'delete',
      url: `${baseUrl}/delete-account/`,
      headers: {
        Authorization: `Bearer ${main.state.accessToken}`,
      },
      data: {
        id: accountId,
      },
    });
    console.log('DELETE FINANCIAL ACCOUNT: ', response);
    await fetchUser({ accessToken: main.state.accessToken, main });
    return response.data;
  } catch (error) {
    console.error('Error with deleteFinancialAccount api call: ', error);
  }
};

export const investMoney = async ({ main, accountId, amount }) => {
  try {
    const response = await axios({
      method: 'post',
      url: `${baseUrl}/invest-money/`,
      headers: {
        Authorization: `Bearer ${main.state.accessToken}`,
      },
      data: {
        account_id: accountId,
        amount: amount,
      },
    });
    console.log('INVEST MONEY: ', response);
    await fetchUser({ accessToken: main.state.accessToken, main });
    return response.data;
  } catch (error) {
    console.error('Error with investMoney api call: ', error);
  }
};

export const viewInvestments = async ({ main }) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${baseUrl}/view-investments/`,
      headers: {
        Authorization: `Bearer ${main.state.accessToken}`,
      },
    });
    console.log('VIEW INVESTMENTS: ', response);
    return response.data;
  } catch (error) {
    console.error('Error with viewInvestments api call: ', error);
  }
};

export const cashOut = async ({ main, investmentId }) => {
  try {
    const response = await axios({
      method: 'put',
      url: `${baseUrl}/cash-out/`,
      headers: {
        Authorization: `Bearer ${main.state.accessToken}`,
      },
      data: {
        id: investmentId,
      },
    });
    await fetchUser({ accessToken: main.state.accessToken, main });
    console.log('CASH OUT: ', response);
    return response.data;
  } catch (error) {
    console.error('Error with cashOut api call: ', error);
  }
};

export const updateDifficultyPointValue = async ({ main, price }) => {
  try {
    console.log('PRICE', price);
    const response = await axios({
      method: 'put',
      url: `${baseUrl}/update-difficulty-point-value/`,
      headers: {
        Authorization: `Bearer ${main.state.accessToken}`,
      },
      data: {
        price,
      },
    });
    await fetchUser({ accessToken: main.state.accessToken, main });
    console.log('updateDifficultyPointValue: ', response);
    return response.data;
  } catch (error) {
    console.error('Error with updateDifficultyPointValue api call: ', error);
  }
};

export const completeWholeSeries = async ({ main, profileId, seriesId }) => {
  try {
    const response = await axios({
      method: 'put',
      url: `${baseUrl}/complete-responsibility-series/`,
      headers: {
        Authorization: `Bearer ${main.state.accessToken}`,
      },
      data: {
        profile_id: profileId,
        series_id: seriesId,
      },
    });
    await fetchUser({ accessToken: main.state.accessToken, main });
    console.log('completeWholeSeries: ', response);
    return response.data;
  } catch (error) {
    console.error('Error with updateDifficultyPointValue api call: ', error);
  }
};
