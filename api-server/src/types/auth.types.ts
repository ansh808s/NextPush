export interface User {
  username: string;
  email?: string;
  avatarUrl?: string;
}
export interface AuthToken {
  id: string;
  username: string;
}

export interface Repository {
  gitURL: string;
  name: string;
  updatedAt: Date;
}

export interface GithubRepoRes {
  clone_url: string;
  name: string;
  updated_at: Date;
}
