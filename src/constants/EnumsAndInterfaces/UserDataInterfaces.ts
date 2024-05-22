// Sample User Profile Interface to test authorization

export interface LoginDetails {
  email: string;
  password: string;
  username: string;
}

export interface UserProfileWithCredentials {
  id: string;
  email: string;
  username: string;
  password: string;
}

export type UserProfile = {
  username: string;
  authToken: string;
};
