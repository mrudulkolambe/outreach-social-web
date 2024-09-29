import { endpoints } from "../config/endpoints";
import { getReq, patchReq, postReq } from "../utils/api";

interface ForumsResponse {
  success: boolean;
  message: string;
  response: Forum[] | null;
}

export interface ForumResponse {
  success: boolean;
  message: string;
  response: Forum | null;
}

export interface ForumPostsResponse {
  success: boolean;
  message: string;
  currentPage: number,
  totalPosts: number,
  totalPages: number,
  response: ForumPost[] | null;
}

export const getForums = async (): Promise<ForumsResponse> => {
  try {
    const response = await getReq(endpoints["get-forums"]);
    const data = await response.json();
    return {
      success: true,
      message: "Forums fetched successfully",
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

export const getForum = async (_id: string): Promise<ForumResponse> => {
  try {
    const response = await getReq(`${endpoints['get-forum']}/${_id}`);
    const data = await response.json();
    return {
      success: true,
      message: "Forum fetched successfully",
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

export const createForum = async (reqData: object): Promise<ForumResponse> => {
  try {
    const response = await postReq(`${endpoints['create-forum']}`, reqData);
    const data = await response.json();
    return {
      success: true,
      message: "Forum created successfully",
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

export const handleJoinForum = async (_id: string): Promise<ForumResponse> => {
  try {
    const response = await patchReq(`${endpoints['join-forum']}/${_id}`, {});
    const data = await response.json();
    window.location.reload()
    return {
      success: true,
      message: "Forum joined successfully",
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

export const getForumPosts = async (_id: string, currentPage: number): Promise<ForumPostsResponse> => {
  try {
    const response = await getReq(`${endpoints['get-forum-post']}/${_id}?page=${currentPage}`);
    const data = await response.json();
    console.log(data)
    return {
      totalPosts: data.response.totalPosts,
      totalPages: data.response.totalPages,
      currentPage: data.response.currentPage,
      success: true,
      message: "Forum joined successfully",
      response: data.response.forumPosts,
    };
  } catch (error) {
    return {
      totalPosts: 0,
      totalPages: 0,
      currentPage: 0,
      success: false,
      message: "Failed to fetch",
      response: [],
    };
  }
}