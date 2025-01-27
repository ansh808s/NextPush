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
  description: string | null;
}

export interface GithubRepoRes {
  clone_url: string;
  name: string;
  updated_at: Date;
  description: string | null;
}

export interface GitHubSearch {
  query: string;
  user: string;
}

export interface GithubRepoQueryRes {
  items: GithubRepoRes[];
}

export interface GetRepoTreeProps {
  user: string;
  repo: string;
  sha: string;
}
export enum FileType {
  dir = "tree",
  file = "blob",
}
export interface GithubRepoTree {
  path: string;
  type: FileType;
  sha: string;
}
export interface GetRepoTreeResponse {
  sha: string;
  tree: GithubRepoTree[];
}
