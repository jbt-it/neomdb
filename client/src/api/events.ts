import { AxiosResponse } from "axios";
import api from "../utils/api";
import { CommonEventType } from "../types/eventTypes";

// GET ROUTES
export const getMembers = async (): Promise<AxiosResponse<CommonEventType[]>> => {
  return await api.get<CommonEventType[]>("/members/");
};
