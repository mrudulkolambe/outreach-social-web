type MainUser = {
    _id: string;
    name: string;
    username: string;
    imageUrl: string;
    bio: string
}

type Media = {
    url: string;
    type: string;
}

type Post = {
    _id: string;
    user: MainUser;
    tags: string[];
    public: boolean;
    content: string;
    media: Media[];
    block: boolean;
    reportsOrFlag: any[];
    commentCount: number;
    createdAt: string;
    updatedAt: string;
    likesCount: number;
    liked: boolean;
}

type ApiResponse = {
    success: boolean;
    message: string;
    response: Post[];
    error: any;
}

type PrimaryPostResponse = {
    success: boolean;
    message: string;
    response: Post;
}

type FeedCommentsResponse = {
    success: boolean;
    message: string;
    response: FeedComment[]
}

type FeedCommentResponse = {
    success: boolean;
    message: string;
    response: FeedComment
}

type FeedComment = {
    author: MainUser;
    createdAt: number;
    parentID?: string;
    postID: string;
    text: string;
    _id: string
}