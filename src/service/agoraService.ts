import axios from "axios";
import { endpoints } from "../config/endpoints";

export interface AgoraChatToken {
	chatToken: string;
	appId: string;
	expireTimestamp: string;
	orgName: number;
}

export const registerAgoraUserService = async (userID: string): Promise<void> => {
	// try {
	// 	const baseUrl = import.meta.env.VITE_AGORA_BASE_URL;
	// 	const password = import.meta.env.VITE_AGORA_USER_PASSWORD;
	// 	console.log(userID, baseUrl, password, "AUTH AGORA")
	// 	const token = await genAgoraToken()
	// 	const response = await axios("https://a41.chat.agora.io/app/chat/user/login", {
	// 	// const response = await axios(baseUrl, {
	// 		method: "POST",
	// 		headers: {
	// 			"Authorization": `Bearer ${token?.chatToken}`
	// 		},
	// 		data: {
	// 			"userAccount": userID,
	// 			"userPassword": password,
	// 		}
	// 	})
	// 	console.log(response.data);
	// } catch (error) {
	// 	console.log("ERROR AGORA", error, userID)
	// }
	return
};

export const genAgoraToken = async (): Promise<AgoraChatToken | null> => {
	return null;
	// try {
	// 	const response = await axios(endpoints["agora-chat-token"], {
	// 		method: "POST",
	// 	})
	// 	if (response.status == 200 || response.status == 201) {
	// 		console.log(response.data)
	// 		return response.data as AgoraChatToken
	// 	} else {
	// 		return null;
	// 	}
	// } catch (error) {
	// 	return null;
	// }
}