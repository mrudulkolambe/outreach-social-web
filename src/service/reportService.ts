import { endpoints } from "@/config/endpoints";
import { postReq } from "@/utils/api";

export const createReport = async (data: {
	userID: string,
	postId: string,
	text: string,
	reason: string,
	type: "post" | "resource" | "forum"
}): Promise<number> => {
	try {
		const response = await postReq(`${endpoints["create-report"]}`, {
			"user": data.userID,
			"post": data.postId,
			"description": data.text,
			"title": data.reason,
			"type": data.type
		});
		const responseData = await response.json();
		console.log(responseData)
		return 200;
	} catch (error) {
		return 500;
	}
};