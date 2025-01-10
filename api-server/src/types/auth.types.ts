export interface User {
  username: string;
  email?: string;
  avatarUrl?: string;
}
export interface AuthToken {
  id: string;
  username: string;
}
