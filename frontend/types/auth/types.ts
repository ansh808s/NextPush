export type AuthCode = {
  code: string;
};

export type User = {
  username: string;
  avatar: string;
  email: string;
};

export interface AuthResponse {
  token: string;
  data: User;
}

export interface Repository {
  gitURL: string;
  name: string;
  updatedAt: Date;
  description: string;
}

export interface RepoResponse {
  repos: Repository[];
}

export interface Tree {
  path: string;
  type: string;
  sha: string;
}
export interface GetRepoTreeResponse {
  tree: Tree[];
}

export interface GetRepoTreeProps {
  sha: string;
  repo: string;
}
