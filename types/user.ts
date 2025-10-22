export interface User {
  id: string;
  username: string;
  name: string | null;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
    bio: string;
    avatar: string;
  };
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
