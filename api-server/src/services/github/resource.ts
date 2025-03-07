import axios from "axios";
import {
  FileType,
  type GetRepoTreeProps,
  type GetRepoTreeResponse,
  type GithubRepoQueryRes,
  type GithubRepoRes,
  type GitHubSearch,
  type Repository,
  type User,
} from "../../types/auth.types";

export const getUserDetails = async (token: string) => {
  try {
    const res = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const user: User = {
      username: res.data.login,
      avatarUrl: res.data.avatar_url,
      email: res.data.email,
    };
    return user;
  } catch (error) {
    throw new Error("Cant get user details");
  }
};

export const getUserRepoDetails = async (token: string) => {
  try {
    const res = await axios.get<GithubRepoRes[]>(
      "https://api.github.com/users/ansh808s/repos?sort=updated&per_page=5",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const repos: Repository[] = res.data.map((repo) => ({
      gitURL: repo.clone_url,
      name: repo.name,
      updatedAt: repo.updated_at,
      description: repo.description,
    }));
    return repos;
  } catch (error) {
    throw new Error("Cant get repo details");
  }
};

export const getRepoDetailsUsingQuery = async (props: GitHubSearch) => {
  try {
    const res = await axios.get<GithubRepoQueryRes>(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(
        `${props.query} in:name user:${props.user}`
      )}`
    );
    const repos: Repository[] = res.data.items.map((repo) => ({
      gitURL: repo.clone_url,
      name: repo.name,
      updatedAt: repo.updated_at,
      description: repo.description,
    }));
    return repos;
  } catch (error) {
    console.log(error);
  }
};

export const getRepoTreeService = async (props: GetRepoTreeProps) => {
  try {
    const res = await axios.get<GetRepoTreeResponse>(
      `https://api.github.com/repos/${props.user}/${props.repo}/git/trees/${props.sha}`
    );
    return res.data.tree
      .filter((file) => file.type === FileType.dir)
      .map(({ path, type, sha }) => ({ path, type, sha }));
  } catch (error) {
    throw new Error("Cant get repo tree");
  }
};
