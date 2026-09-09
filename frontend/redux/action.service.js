export const CONTAINER_ID = "CONTAINER_ID";

export const SET_USER_PROFILE = "SET_USER_PROFILE";
export const setUserProfile = (profile) => ({ type: SET_USER_PROFILE, payload: profile });

export const INCREMENT_HEADER_NOTIFICATIONS_COUNT = "INCREMENT_HEADER_NOTIFICATIONS_COUNT";
export const DECREMENT_HEADER_NOTIFICATIONS_COUNT = "DECREMENT_HEADER_NOTIFICATIONS_COUNT";

export const SET_HEADER_NOTIFICATIONS_COUNT = "SET_HEADER_NOTIFICATIONS_COUNT";

export const increment_header_notifications_count = (count) => ({
  type: INCREMENT_HEADER_NOTIFICATIONS_COUNT,
  payload: count,
});

export const decrement_header_notifications_count = () => ({
  type: DECREMENT_HEADER_NOTIFICATIONS_COUNT,
});

export const set_header_notifications_count = (count) => ({
  type: SET_HEADER_NOTIFICATIONS_COUNT,
  payload: count,
})