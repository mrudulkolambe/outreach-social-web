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
}