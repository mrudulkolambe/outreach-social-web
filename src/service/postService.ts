import { endpoints } from "../config/endpoints";
import { getReq, patchReq, postReq } from "../utils/api";

export type GetPostsResponse = {
  success: boolean;
  message: string;
  currentPage: number,
  totalFeeds: number,
  totalPages: number,
  response: Post[];
}

// type CreatePostResponse = {
//   success: boolean;
//   message: string;
//   response: Post | null;
// }

export const getPosts = async (currentPage: number): Promise<GetPostsResponse> => {
  try {
    const response = await getReq(`${endpoints["get-post"]}?page=${currentPage}`);
    const data = await response.json();
    return {
      currentPage: data.response.currentPage,
      totalFeeds: data.response.totalFeeds,
      totalPages: data.response.totalPages,
      success: true,
      message: "Posts fetched successfully",
      response: data.response.feeds,
    };
  } catch (error) {
    return {
      currentPage: 0,
      totalFeeds: 0,
      totalPages: 0,
      success: false,
      message: "Failed to fetch posts",
      response: [],
    };
  }
};

export const createPost = async (content: string, urls: UploadedFile[], isPublic: boolean, user: MainUser, _tags?: string[],): Promise<PrimaryPostResponse | null> => {
  try {
    const body = {
      "public": isPublic,
      "content": content,
      "media": urls,
      "tags": _tags ?? ""
    };
    const response = await postReq(endpoints['create-post'], body);
    const data = await response.json()
    data.response.user = user;
    return data.response
  } catch (error) {
    return null
  }
}

export const likePost = async (post: Post) => {
  try {
    const response = await patchReq(`${endpoints['like-feed']}/${post._id}`, {});
    if (response) {
      return 200;
    } else {
      throw new Error('Failed to update post');
    }
  } catch (error) {
    return 500;
  }
}

export const getComments = async (post: Post): Promise<FeedCommentsResponse | null> => {
  const response = await getReq(`${endpoints["get-feed-comments"]}/${post._id}`)
  if (response.ok) {
    const data = await response.json();
    return data
  } else {
    return null
  }
}

export const postComments = async (postID: string, text: string): Promise<FeedCommentResponse | null> => {
  const body = {'text': text, 'parentID': null};
  const response = await postReq(`${endpoints["create-feed-comment"]}/${postID}`, body)
  if(response.ok){
    const data = await response.json();
    return data  as FeedCommentResponse;
  }else{
    return null
  }
}