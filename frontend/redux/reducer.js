import {
  CONTAINER_ID,
  DECREMENT_HEADER_NOTIFICATIONS_COUNT,
  INCREMENT_HEADER_NOTIFICATIONS_COUNT,
  SET_HEADER_NOTIFICATIONS_COUNT,
  SET_USER_PROFILE,
} from "./action.service";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

const initialState = {
  newNotificationsCount: 0,
  searchTerm: "",
};

const persitState = {
  container: "",
};

const rootReducerPersit = (state = persitState, action) => {
  switch (action.type) {
    case CONTAINER_ID:
      return {
        ...state,
        container: action.payload,
      };
    default:
      return state;
  }
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case INCREMENT_HEADER_NOTIFICATIONS_COUNT:
      return {
        ...state,
        newNotificationsCount: state.newNotificationsCount  + 1,
      };
    case DECREMENT_HEADER_NOTIFICATIONS_COUNT:
      return {
        ...state,
        newNotificationsCount: state.newNotificationsCount  - 1,
      };
    case SET_HEADER_NOTIFICATIONS_COUNT:
      return {
        ...state,
        newNotificationsCount: action.payload,
      };
    default:
      return state;
  }
};

const userProfileState = {
  roles: [],
  userId: "",
  accountId: "",
  applicationContainerId: "",
  ownerSummary: "",
};

const userProfileReducer = (state = userProfileState, action) => {
  if (action.type === SET_USER_PROFILE) return { ...state, ...action.payload };
  return state;
};

const persistConfig = {
  key: "root",
  storage,
};

const persistedRootReducer = persistReducer(persistConfig, rootReducerPersit);

const rootReducerFinal = combineReducers({
  persisted: persistedRootReducer,
  nonPersisted: rootReducer,
  userProfile: userProfileReducer,
});

export default rootReducerFinal;
