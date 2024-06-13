const JSONStorage = JSON.parse(localStorage.getItem('STATE'));

export const initialMainState = JSONStorage ?? {
  accessToken: '',
  profile: {},
  childImSeeingsResponsibilities: [],
  childImSeeingsId: 0,
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
    case 'SET_CHILD_IM_SEEINGS_RESPONSIBILITIES':
      newState = {
        ...state,
        childImSeeingsResponsibilities: action.childImSeeingsResponsibilities,
      };
      break;
    case 'SET_CHILD_IM_SEEINGS_ID':
      newState = {
        ...state,
        childImSeeingsId: action.childImSeeingsId,
      };
      break;
    default:
      return state;
  }

  localStorage.setItem('STATE', JSON.stringify(newState));

  return newState;
};
