const JSONStorage = JSON.parse(localStorage.getItem('STATE'));

export const initialMainState = JSONStorage ?? {
  accessToken: '',
  profile: {},
};

export const mainReducer = (state, action) => {
  let newState;

  switch (action.type) {
    case 'SET_ACCESS_TOKEN':
      newState = {
        ...state,
        accessToken: action.accessToken,
      };
      break;
    case 'SET_PROFILE':
      newState = {
        ...state,
        profile: action.profile,
      };
      break;
    default:
      return state;
  }

  localStorage.setItem('STATE', JSON.stringify(newState));

  return newState;
};
