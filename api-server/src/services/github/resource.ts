import axios from "axios";

export const getUserDetails = async (token: string) => {
  try {
    const res = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {}
};
