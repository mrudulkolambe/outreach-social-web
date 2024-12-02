interface Forum {
    _id: string;
    userId: MainUser;
    public: boolean;
    name: string;
    category: string;
    description: string;
    timestamp: number;
    image: string;
    joined: string[];
}


interface ForumPost {
    _id: string;
    content: string;
    media: Media[];
    public: boolean;
    user: MainUser;
    likesCount: number;
    commentCount: number;
    liked: boolean;
    createdAt: number
}


type ForumFeedCommentsResponse = {
    success: boolean;
    message: string;
    response: {
        comments: ForumFeedComment[]
    }
}

type ForumFeedCommentResponse = {
    success: boolean;
    message: string;
    response: ForumFeedComment
}

type ForumFeedComment = {
    author: MainUser;
    createdAt: number;
    parentID?: string;
    postID: string;
    text: string;
    _id: string;
}