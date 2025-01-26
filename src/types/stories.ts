type UserStoryResponse = {
	success: boolean;
	message: string;
	response: StoryResponse;
};

type StoryResponse = {
	own: UserStory[];
	user: UserStory[];
};

type UserStory = {
	_id: string;
	userId: MainUser;
	content: string;
	media: Media;
	timestamp: number;
	deleted: boolean;
	createdAt: string;
	updatedAt: string;
	public: boolean;
};

type UploadStoryResponse = {
	success: boolean;
	message: string;
	response: UserStory;
};

type UserStoryGroup = {
	username: string;
	imageUrl?: string;
	stories: UserStory[];
};