import api from "@/app/lib/api";

export interface UserType {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

export const getCurrentUser = async (token: string): Promise<UserType> => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await api.get("user/me", { headers });
  return response.data;
};

// TODO: çalışmıyor
export const logout = async (): Promise<void> => {
  const response = await api.post("auth/sign-out");
  return response.data;
};
