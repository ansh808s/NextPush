export type AuthToken = {
  token: string;
};

export type User = {
  username: string;
  avatar: string;
  email: string;
};

export interface AuthResponse extends AuthToken {
  data: User;
}
