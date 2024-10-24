import { endpoints } from '@/config/endpoints';
import { getReq } from '@/utils/api';

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



export { getResourceCategories, getResources }