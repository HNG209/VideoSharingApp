export interface User {
  id: string;
  username: string;
  email: string;
  // avatar: string;
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
