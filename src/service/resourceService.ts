import { endpoints } from '@/config/endpoints';
import { getReq, patchReq } from '@/utils/api';
import { toast } from 'sonner';

async function getResourceCategories(): Promise<ResourceCategoryResponse | null> {
	const response = await getReq(endpoints["get-resource-categories"]);
	if (response.status === 201 || response.status === 200) {
		const data = await response.json()
		return data;
	} else {
		return null;
		// toast.error("Something went wrong!")
	}
}

async function getResources(page: number): Promise<ResourcePostsResponse | null> {
	const response = await getReq(`${endpoints["get-resources"]}/?page=${page}`);
	if (response.status === 201 || response.status === 200) {
		const data = await response.json()
		return {
			totalFeeds: data.response.totalFeeds,
			totalPages: data.response.totalPages,
			currentPage: data.response.currentPage,
			success: true,
			response: data.response.feeds,
		};
	} else {
		return null;
		// toast.error("Something went wrong!")
	}
}

async function likeResource(_id: string): Promise<Number> {
	const response = await patchReq(`${endpoints["like-resource"]}/${_id}`, {});
	if (response.status === 201 || response.status === 200) {
		// const data = await response.json()
		return response.status
	} else {
		toast.error("Something went wrong!")
		return 500;
	}
}



export { getResourceCategories, getResources, likeResource }