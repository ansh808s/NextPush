import axios from "axios";
import type { User } from "../../types/auth.types";

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
  } catch (error) {}
};
