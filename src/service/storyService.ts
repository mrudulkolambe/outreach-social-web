import { endpoints } from "@/config/endpoints";
import { getReq, postReq } from "@/utils/api";

export async function createStory(body: Record<string, any>): Promise<number> {
	const response = await postReq(endpoints["create-story"], body);
	console.log(response?.body);
	if (response && (response.status === 200 || response.status === 201)) {
		return 200;
	} else {
		return 500;
	}
}

export async function getUserStories(): Promise<UserStoryResponse | null> {
	const response = await getReq(endpoints["get-story"]);
	console.log(response?.body);

	if (response && (response.status === 200 || response.status === 201)) {
		const responseData = await response.json()
		return responseData
	} else {
		console.log(response.body)
		return null;
	}
}