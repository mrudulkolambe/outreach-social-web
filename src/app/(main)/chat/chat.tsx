import { useState, useEffect, useRef } from "react";
import { useAuthContext } from "@/context/Auth";
import { ZIM, ZIMConversation, ZIMMessage } from "zego-zim-web";
import { sendMessage, zim, zp } from "@/utils/zim";
import Avatar from "react-avatar";
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import ConversationList from "./convList";
import moment from "moment";
import { Phone, Video } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { useSearchParams } from "react-router-dom";


const Chat = () => {
	const { conversations, baseUser } = useAuthContext();
	const [searchParams] = useSearchParams();
	const user = searchParams.get("user");
	const [input, setInput] = useState("");
	const [currentChat, setCurrentChat] = useState<ZIMConversation | null>(null);
	const [currentChatConv, setCurrentChatConv] = useState<ZIMMessage[]>([]);
	const messagesEndRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		scrollToBottom(); // Scroll to the bottom whenever messages update
	}, [currentChatConv]);

	const scrollToBottom = () => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	};

	useEffect(() => {
		if (user) {
			const userData = conversations.find((userItem) => {
				return userItem.conversationID === user;
			})
			if (userData) {
				setCurrentChat(userData);
			}
		} else if (currentChat) {
			init();
			zim.queryHistoryMessage(currentChat?.conversationID, ZIM.ConversationType.Peer, {
				count: 30,
				reverse: true
			})
				.then((res) => {
					console.log("peerMessageReceived_CHAT_NEW", res)
					setCurrentChatConv(res.messageList)
				})

			return () => {
				zim.off("peerMessageReceived");
			};
		}

	}, [currentChat, user])


	const init = async () => {
		zim.on("peerMessageReceived", function (zim, { messageList, fromConversationID }) {
			console.log("peerMessageReceived_msglist", zim);
			console.log("peerMessageReceived_msglist", messageList);
			console.log("peerMessageReceived_currentConv", fromConversationID, currentChat?.conversationID);
			setCurrentChatConv((prevChatConv) => {
				if (fromConversationID === currentChat?.conversationID) {
					return [...prevChatConv, ...messageList];
				}
				return prevChatConv;
			});
		});
	};

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault()
		if (input.trim() && currentChat) {
			const message = await sendMessage(currentChat.conversationID, input);
			if (message) {
				setCurrentChatConv([...currentChatConv, message!])
				setInput("");
			}
		}
	};

	const handleConversationSelect = (chat: ZIMConversation) => {
		setCurrentChat(chat);
	};

	const handleGlobalUserSelect = async (user: ZIMConversation) => {
		setCurrentChat({
			conversationID: user.conversationID,
			conversationName: user.conversationName
		} as ZIMConversation)
	};

	function inviteVideo() {
		if (currentChat) {
			zp!.sendCallInvitation({
				callees: [{
					userID: currentChat?.conversationID,
					userName: currentChat?.conversationName
				}],
				callType: ZegoUIKitPrebuilt.InvitationTypeVideoCall,
				timeout: 60, // Timeout duration (second). 60s by default, range from [1-600s].
			}).then((res) => {
				console.warn(res);
			})
				.catch((err) => {
					console.warn(err);
				});
		}
	}
	function inviteVoice() {
		if (currentChat) {
			zp!.sendCallInvitation({
				callees: [{
					userID: currentChat?.conversationID,
					userName: currentChat?.conversationName
				}],
				callType: ZegoUIKitPrebuilt.InvitationTypeVoiceCall,
				timeout: 60, // Timeout duration (second). 60s by default, range from [1-600s].
			}).then((res) => {
				console.warn(res);
			})
				.catch((err) => {
					console.warn(err);
				});
		}
	}


	return (
		<div className="flex h-screen bg-gray-100">
			<Sidebar collapsed={true} />
			{/* Sidebar */}
			<div className="w-1/4 h-full">
				<ConversationList
					conversations={conversations}
					onSelect={handleConversationSelect}
					onGlobalUserSelect={handleGlobalUserSelect}
					baseUser={baseUser}
					fetchGlobal={true}
				/>
			</div>

			{/* Chat Section */}
			<div className="flex-1 flex flex-col ">
				<header className="bg-[#D9D9D94D] text-black text-lg font-bold py-5 px-6 shadow-lg Poppins gap-3 flex items-center justify-between">
					<div className="flex items-center gap-3">
						{currentChat && (
							<Avatar
								name={currentChat?.conversationName}
								size={"35"}
								round
								textSizeRatio={2}
							/>
						)}
						{currentChat ? currentChat.conversationName : ""}
					</div>
					<div className="flex gap-14">
						<div className="bg-gray-300 flex items-center justify-center cursor-pointer h-10 w-10 rounded-full" onClick={inviteVoice}><Phone /></div>
						<div className="bg-gray-300 flex items-center justify-center cursor-pointer h-10 w-10 rounded-full" onClick={inviteVideo}><Video /></div>
					</div>
				</header>

				{currentChat ? (
					<div className="flex flex-col flex-1 overflow-y-auto">
						<div key={currentChat.conversationID} className="flex-grow overflow-y-auto p-6 space-y-4">
							{currentChatConv.map((msg, index) => {
								const message = msg as ZIMMessage;
								const text = msg?.message as string || ""; // Ensure `msg.message` is always a string

								return (
									<div key={index} className={`flex flex-col ${msg.direction === 0 ? "items-end" : "items-start"}`}>
										<div className={`max-w-xs px-4 py-2 rounded-xl shadow-md ${message.direction === 0 ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
											{msg.type == 11 ? (
												// @ts-ignore
												<img src={msg?.fileDownloadUrl} alt="Sent media" height={msg?.largeImageHeight ?? 0} width={msg?.largeImageWidth ?? 0} className="object-cover rounded-lg" />
											) : msg.type == 12 ? (
												<video src={msg?.fileDownloadUrl} controls className="w-[500px] h-[250px] rounded-lg" />
											) : (
												<p className="text-base">{text}</p>
											)}
										</div>
										<p className="text-xs mt-2">{moment(msg.timestamp).format("hh:mm")}</p>
									</div>
								);
							})}


							<div ref={messagesEndRef}></div>
						</div>

						{/* Message Input */}
						<form onSubmit={handleSendMessage} className="p-4 bg-white border-t flex items-center space-x-4">
							<input
								type="text"
								value={input}
								onChange={(e) => setInput(e.target.value)}
								placeholder="Type a message..."
								className="flex-grow px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							<button
								type="submit"
								className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
							>
								Send
							</button>
						</form>
					</div>
				) : (
					<div className="flex-grow flex items-center justify-center">
						<p className="text-gray-500 text-lg">
							Select a conversation to start chatting
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default Chat;
