const JSONStorage = JSON.parse(localStorage.getItem('STATE'));

export const initialMainState = JSONStorage ?? {
  accessToken: '',
  profile: {},
};

export const mainReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ACCESS_TOKEN':
      localStorage.setItem(
        'STATE',
        JSON.stringify({ ...state, accessToken: action.accessToken })
      );
      return {
        ...state,
        accessToken: action.accessToken,
      };
    case 'SET_PROFILE':
      localStorage.setItem(
        'STATE',
        JSON.stringify({ ...state, profile: action.profile })
      );
      return {
        ...state,
        profile: action.profile,
      };
  }
};
