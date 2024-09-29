const baseURL = "https://outreach-backend-development.vercel.app";
// const baseURL = "http://localhost:2000";

const uploadBaseURL = "http://13.233.246.217:8080";

export const endpoints = {
    'register-user': `${baseURL}/user/register`,
    'get-current-user': `${baseURL}/user/current-user`,
    'update-user': `${baseURL}/user/update`,
    'get-post': `${baseURL}/feed/get`,
    'create-post': `${baseURL}/feed/create`,
    'like-feed': `${baseURL}/feed/like`,
    'create-support': `${baseURL}/support/register`,
    'get-feed': `${baseURL}/feed/get`,

    // FORUM
    'create-forum': `${baseURL}/forum`,
    'get-forums': `${baseURL}/forum`,
    'get-forum': `${baseURL}/forum`,
    'join-forum': `${baseURL}/forum/join`,
    'leave-forum': `${baseURL}/forum/leave`,
    'get-forum-post': `${baseURL}/forum/forum-post`,
    'create-forum-post': `${baseURL}/forum/forum-post`,
    'like-forum-feed': `${baseURL}/forum/forum-post/like`,
    'create-feed-comment': `${baseURL}/feed-comment`,
    'get-feed-comments': `${baseURL}/feed-comment`,
    'create-forum-feed-comment': `${baseURL}/forum-feed-comment`,
    'get-forum-feed-comments': `${baseURL}/forum-feed-comment`,
    'single-file-upload': `${uploadBaseURL}/upload`,
    'multi-file-upload': `${uploadBaseURL}/multi-upload`,
    'all-users': `${baseURL}/user/get`,
    'query-users': `${baseURL}/user/search`
};
