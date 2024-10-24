import { endpoints } from "../config/endpoints";
import { getReq } from "../utils/api";

interface ApiResponse {
  success: boolean;
  message: string;
  response: any | null;
}

export const getUser = async (): Promise<ApiResponse> => {
  try {
    const response = await getReq(endpoints["get-current-user"]);
    const data = await response.json();
    return {
      success: true,
      message: "User fetched successfully",
      response: data.response,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch",
      response: null,
    };
  }
};
