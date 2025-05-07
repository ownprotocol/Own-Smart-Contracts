"use client";
import { useQuery } from "@tanstack/react-query";
import axios, { type AxiosResponse } from "axios";

export const GetUserQueryKey = "get-auth-user";

interface UserAuthState {
  address: string | null;
  accessToken: string | null;
  isValid: boolean;
}
const getAuthUser = async (): Promise<AxiosResponse<UserAuthState>> =>
  axios.get("/api/users/auth/get-user");

export const useGetAuthUser = () => {
  const { data, ...queryResponse } = useQuery({
    queryKey: [GetUserQueryKey],
    queryFn: () => getAuthUser(),
  });
  const userAuthState = data?.data;
  return {
    isValid: userAuthState?.isValid,
    address: userAuthState?.address,
    accessToken: userAuthState?.accessToken,
    ...queryResponse,
  };
};
