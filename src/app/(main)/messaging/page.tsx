import React, { Component, useEffect } from "react";
import {
	UIKitProvider,
	Chat,
	ConversationList,
	useClient,
	rootStore,
} from "agora-chat-uikit";
import "agora-chat-uikit/style.css";

const appKey = "711253789#1445631"; // your appKey
const user = "66be1bbec3ac3fa2bd5d52b6"; // your user ID
const agoraToken = "007eJxTYDgh9bOo4r8Pl+wOScbI1XcZXFc+i5T6ksp48EPs55W2TS8VGCwNDS2MDI2NzNJMLUwMzCyTjJJN05JNEo3NjMxMklMNn08tTm8IZGSQ2j2FmZGBlYERCEF8FQZT82QLM0sLA90kU9NUXUPD1DQgyzxJNzHNJCU51czA3DDVHABR0Cdg"

const conversation = {
	chatType: "singleChat", // 'singleChat' || 'groupChat'
	conversationId: "agora", // target user id or group id
	name: "Agora", // target user nickname or group name
	lastMessage: {},
};

const ChatApp = () => {
	const client = useClient();
	useEffect(() => {
		client &&
			client
				.open({
					user,
					agoraToken,
				})
				.then((res: any) => {
					console.log("Token fetched successfully", res);
					//   rootStore.conversationStore.addConversation(conversation); // Add a conversation
				});
	}, [client]);

	return (
		<div className="flex h-screen">
			<div className="w-1/2">
				<ConversationList />
			</div>
			<div className="w-1/2">
				<Chat />
			</div>
		</div>
	);
};

class App extends Component {
	render() {
		return (
			<UIKitProvider
				initConfig={{
					appKey,
				}}
			>
				<ChatApp />
			</UIKitProvider>
		);
	}
}

export default App;