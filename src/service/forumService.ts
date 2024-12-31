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
export interface ForumPostResponse {
  success: boolean;
  message: string;
  response: ForumPost | null;
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

export const likePost = async (post: ForumPost) => {
  try {
    const response = await patchReq(`${endpoints['like-forum-feed']}/${post._id}`, {});
    if (response) {
      return 200;
    } else {
      throw new Error('Failed to update post');
    }
  } catch (error) {
    return 500;
  }
}

export const getComments = async (post: ForumPost): Promise<ForumFeedCommentsResponse | null> => {
  const response = await getReq(`${endpoints["get-forum-feed-comments"]}/${post._id}`)
  if (response.ok) {
    const data = await response.json();
    console.log("DATA", data)
    return data
  } else {
    return null
  }
}

export const postComments = async (postID: string, text: string): Promise<ForumFeedCommentResponse | null> => {
  const body = { 'text': text, 'parentID': null };
  const response = await postReq(`${endpoints["create-forum-feed-comment"]}/${postID}`, body)
  if (response.ok) {
    const data = await response.json();
    return data as FeedCommentResponse;
  } else {
    return null
  }
}

export const createForumPost = async (reqData: object, forumID: string): Promise<ForumPostResponse | null> => {
  try {
    const response = await postReq(`${endpoints['create-forum-post']}/${forumID}`, reqData);
    const data = await response.json();
    return data
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch",
      response: null,
    };
  }
}