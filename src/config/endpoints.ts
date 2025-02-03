const baseURL = "https://outreach-backend-development.vercel.app";
// const baseURL = "http://localhost:2000";

// const uploadBaseURL = "http://localhost:8080";
// const uploadBaseURL = "http://15.207.14.199:8080";
const uploadBaseURL = "https://outreach-upload.vercel.app";

export const endpoints = {
    'register-user': `${baseURL}/user/register`,
    'get-current-user': `${baseURL}/user/current-user`,
    'update-user': `${baseURL}/user/update`,
    'search-user': `${baseURL}/user/profile`,
    'get-post': `${baseURL}/feed/get`,
    'create-post': `${baseURL}/feed/create`,
    'update-post': `${baseURL}/feed/update`,
    'like-feed': `${baseURL}/feed/like`,
    'create-support': `${baseURL}/support/register`,
    'get-feed': `${baseURL}/feed/get`,
    'delete-feed': `${baseURL}/feed/delete`,
    'follow': `${baseURL}/follow`,

    // FORUM
    'create-forum': `${baseURL}/forum`,
    'get-forums': `${baseURL}/forum`,
    'get-forum': `${baseURL}/forum`,
    'join-forum': `${baseURL}/forum/join`,
    'leave-forum': `${baseURL}/forum/leave`,
    'get-forum-post': `${baseURL}/forum/forum-post`,
    'create-forum-post': `${baseURL}/forum/forum-post`,
    'like-forum-feed': `${baseURL}/forum/forum-post/like`,
    'delete-forum-feed': `${baseURL}/forum/forum-post`,

    // FEED
    'create-feed-comment': `${baseURL}/feed-comment`,
    'get-feed-comments': `${baseURL}/feed-comment`,
    'create-forum-feed-comment': `${baseURL}/forum-feed-comment`,
    'get-forum-feed-comments': `${baseURL}/forum-feed-comment`,
    
    // RESOURCE
    'get-resource-categories': `${baseURL}/resource-category/get`,
    'get-resources': `${baseURL}/resource/get`,
    'like-resource': `${baseURL}/resource/like`,
    'delete-resource': `${baseURL}/resource/delete`,
    'create-resource': `${baseURL}/resource/create`,

    // STORY
    'create-story': `${baseURL}/story/create`,
    'get-story': `${baseURL}/story/get`,

    'single-file-upload': `${uploadBaseURL}/upload`,
    'multi-file-upload': `${uploadBaseURL}/multi-upload`,
    'all-users': `${baseURL}/user/get`,
    'query-users': `${baseURL}/user/search`,

    // REPORT
    'create-report': `${baseURL}/report/create`,


    // AGORA
    'agora-chat-token': `${baseURL}/agora/chat/token`,

    // ZEGO
    'zego': `${baseURL}/zego/generate-token`,


    // GLOBAL SEARCH
    'global-search': `${baseURL}/user/global/search`
};
