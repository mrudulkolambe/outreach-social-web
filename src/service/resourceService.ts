import { endpoints } from '@/config/endpoints';
import { deleteReq, getReq, patchReq, postReq } from '@/utils/api';
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

const deleteResource = async (_id: string): Promise<number> => {
  try {
	const deletePostResponse = await deleteReq(`${endpoints["delete-resource"]}/${_id}`);
	if (deletePostResponse.status === 200) {
	  return 200;
	} else {
	  return 500;
	}
  } catch (error) {
	return 500;
  }
}

export const createResourcePost = async (reqData: object): Promise<ResourcePostResponse | null> => {
  try {
	const response = await postReq(`${endpoints['create-resource']}`, reqData);
	const data = await response.json();
	return data
  } catch (error) {
	return {
	  success: false,
	  message: "Failed to fetch",
	  response: null,
	};
  }
}


export { getResourceCategories, getResources, likeResource, deleteResource }