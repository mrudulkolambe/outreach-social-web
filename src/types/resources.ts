
type ResourceCategoryResponse = {
	success: boolean;
	message: string;
	response: ResourceCategory[];
}

type ResourceCategory = {
	_id: string;
	title: string;
	createdAt: number;
	enabled: boolean;
}

type ResourcePost = {
	title: string;
	_id: string;
	user: MainUser;
	tags: string[];
	content: string;
	media: Media[];
	approved: boolean;
	reportsOrFlag: any[];
	commentCount: number;
	createdAt: string;
	updatedAt: string;
	likesCount: number;
	liked: boolean;
	category: string;
}

type ResourcePostsResponse = {
	currentPage: number;
	success: boolean;
	totalFeeds: number;
	totalPages: number;
	response: ResourcePost[];
}