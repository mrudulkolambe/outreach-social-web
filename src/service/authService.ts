import { endpoints } from "../config/endpoints";
import { getReq, patchReq, postReq } from "../utils/api";

export interface ApiResponse {
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

export const getUserByID = async (id: string, userID: string): Promise<ApiResponse> => {
  try {
    const response = await getReq(`${endpoints["search-user"]}/${id}/${userID}`);
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

export const updateUserData = async (body: any): Promise<ApiResponse> => {
  try {
    const response = await patchReq(endpoints["update-user"], body);
    console.log("body", body)
    const data = await response.json();
    console.log(data)
    return {
      success: true,
      message: "User updated successfully",
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

export const followUser = async (userID: string, id: string): Promise<ApiResponse> => {
  try {
    const response = await postReq(`${endpoints["follow"]}/${userID}/${id}`, {});

    const data = await response.json();
    console.log(data)
    return {
      success: true,
      message: "User updated successfully",
      response: data.response,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch",
      response: null,
    };
  }
}