export interface User {
  id: string;
  username: string;
  email: string;
  profile: {
    displayName: string;
    bio: string;
    avatar: string;
  };
}

export interface ChangePasswordValues {
  currentPassword: string;
  newPassword: string;
}

export interface LoginValues {
  username: string;
  password: string;
}

export interface RegisterValues {
  username: string;
  email: string;
  password: string;
}
