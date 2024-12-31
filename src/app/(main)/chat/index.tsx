// import React, { Component, useEffect } from "react";
// import {
// 	Provider,
// 	Chat,
// 	ConversationList,
// 	useClient,
// 	rootStore,
// 	Conversation,
// } from "chatuim2";
// import "chatuim2/style.css";
// import Topbar from "@/components/Topbar";

// const appKey = "711253789#1445631"; // your appKey
// const user = "66c1c4e387e2c395e6b5f21e"; // your user ID
// const agoraToken = "007eJxTYFh6QcDq9onKj+ImU1crzZqf0FBa813cLmG9yf2DKd+tn3xXYLA0NLQwMjQ2MksztTAxMLNMMko2TUs2STQ2MzIzSU41PMEckt4QyMjAbTOdiZGBlYERCEF8FYZUSyMD86REA93EtKQkXUPD1DTdxCSzRF1zUwvTFOPE1ERzgyQApGYn6Q=="; // agora chat token

// const conversation = {
// 	chatType: "singleChat",
// 	conversationId: "66be1bbec3ac3fa2bd5d52b6",
// 	name: "Mrudul K",
// 	lastMessage: {},
// };
// const ChatApp = () => {
// 	const client = useClient();
// 	useEffect(() => {
// 		client &&
// 			client
// 				.open({
// 					user,
// 					agoraToken,
// 				})
// 				.then((res: any) => {
// 					console.log("get token success", res);
// 					// rootStore.conversationStore.addConversation({ ...conversation, } as Conversation);
// 				});
// 	}, [client]);

// 	return (
// 		<>
// 			<div className="w-screen flex flex-col h-screen">
// 				<Topbar />
// 				<div className="w-screen flex primary-height">
// 					<div className="w-1/2">
// 						<ConversationList />
// 					</div>
// 					<div className="w-1/2">
// 						<Chat className="Poppins" messageListProps={{
// 							// renderMessage: (message) => {
// 							// 	console.log(message.type, (message))
// 							// 	return <p>{message.msg}</p>
// 							// },
// 							messageProps: {
// 								bubbleType: "primary",
// 							}
// 						}} />
// 					</div>
// 				</div>
// 			</div>
// 		</>
// 	);
// };

// class App extends Component {
// 	render() {
// 		return (
// 			<Provider
// 				initConfig={{
// 					appKey,
// 				}}
// 			>
// 				<ChatApp />
// 			</Provider>
// 		);
// 	}
// }

// export default App;