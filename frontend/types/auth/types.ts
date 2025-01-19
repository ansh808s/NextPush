export type AuthCode = {
  code: string;
};

export type User = {
  username: string;
  avatar: string;
  email: string;
};

export interface AuthResponse extends AuthCode {
  data: User;
}
