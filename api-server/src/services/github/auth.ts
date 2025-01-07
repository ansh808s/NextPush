import axios from "axios";

export const getAccessToken = async (code: string) => {
  try {
    const res = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }
    );
    const token = new URLSearchParams(res.data).get("access_token");
    if (!token) {
      throw new Error("Cant fetch the users access token");
    }
    return token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error("Cant fetch the users access token ", error);
    }
  }
};
