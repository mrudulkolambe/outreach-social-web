import { useState, useEffect, useRef } from "react";
import { useAuthContext } from "@/context/Auth";
import { ZIM, ZIMConversation, ZIMMessage } from "zego-zim-web";
import { sendMessage, zim, zp } from "@/utils/zim";
import Avatar from "react-avatar";
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import ConversationList from "./convList";
import moment from "moment";
import { ArrowLeft, Phone, Video } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { useSearchParams } from "react-router-dom";

const Chat = () => {
	const { conversations, baseUser, setConversations } = useAuthContext();
	const [searchParams] = useSearchParams();
	const user = searchParams.get("user");
	const [input, setInput] = useState("");
	const [currentChat, setCurrentChat] = useState<ZIMConversation | null>(null);
	const [currentChatConv, setCurrentChatConv] = useState<ZIMMessage[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [showConversations, setShowConversations] = useState(true);
	const messagesEndRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const handleResize = () => {
			// Show conversations list by default on desktop
			if (window.innerWidth >= 1024) {
				setShowConversations(true);
			}
		};

		window.addEventListener('resize', handleResize);
		handleResize(); // Initial check

		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		// Hide conversations list on mobile when chat is selected
		if (currentChat && window.innerWidth < 1024) {
			setShowConversations(false);
		}
	}, [currentChat]);

	useEffect(() => {
		const initializeChat = async () => {
			setIsLoading(true);
			try {
				const convList = await zim.queryConversationList({
					count: 40
				});
				setConversations(convList.conversationList);
			} catch (error) {
				console.error("Error fetching conversations:", error);
			} finally {
				setIsLoading(false);
			}
		};

		initializeChat();
	}, []);

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

				// Check if this conversation exists in the conversations list
				const existingConv = conversations.find(conv => conv.conversationID === currentChat.conversationID);
				if (!existingConv) {
					// If it doesn't exist, add it to the conversations list
					const newConversation: ZIMConversation = {
						...currentChat,
						lastMessage: message
					};
					setConversations([...conversations, newConversation]);
				}
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

	const handleBack = () => {
		setShowConversations(true);
		setCurrentChat(null);
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
			<Sidebar collapsed={false}/>

			{/* Main Chat Container */}
			<div className="flex-1 flex relative h-full">
				{/* Conversation List - Hidden on mobile when chat is active */}
				<div className={`${showConversations ? 'flex' : 'hidden'} lg:flex absolute lg:relative inset-0 lg:inset-auto w-full lg:w-[350px] h-full bg-white z-10 border-r border-gray-200`}>
					<div className="w-full h-full flex flex-col">
						<header className="bg-[#D9D9D94D] text-black text-lg font-bold py-3 px-3 sm:py-5 sm:px-6 shadow-lg Poppins">
							<h1 className="text-xl font-bold">Messages</h1>
						</header>
						<div className="flex-1 overflow-hidden">
							<ConversationList
								conversations={conversations}
								onSelect={handleConversationSelect}
								onGlobalUserSelect={handleGlobalUserSelect}
								baseUser={baseUser}
								fetchGlobal={true}
								isLoading={isLoading}
							/>
						</div>
					</div>
				</div>

				{/* Chat Section */}
				<div className={`${!showConversations ? 'flex' : 'hidden'} lg:flex flex-1 flex-col bg-white h-full`}>
					<header className="bg-[#D9D9D94D] text-black py-3 px-3 sm:py-5 sm:px-6 shadow-lg Poppins flex items-center justify-between">
						<div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
							{/* Back button - visible only on mobile when chat is active */}
							{currentChat && (
								<button
									onClick={handleBack}
									className="lg:hidden p-1.5 hover:bg-gray-200 rounded-full"
								>
									<ArrowLeft size={20} className="sm:size-6" />
								</button>
							)}
							{currentChat && (
								<Avatar
									name={currentChat?.conversationName}
									size="32"
									round
									textSizeRatio={2}
									className="sm:size-9 flex-shrink-0"
								/>
							)}
							<span className="truncate text-base sm:text-lg font-semibold">
								{currentChat ? currentChat.conversationName : ""}
							</span>
						</div>
						{currentChat && (
							<div className="flex gap-3 sm:gap-14 ml-2 flex-shrink-0">
								<button
									className="bg-gray-300 flex items-center justify-center cursor-pointer h-8 w-8 sm:h-10 sm:w-10 rounded-full hover:bg-gray-400 transition-colors"
									onClick={inviteVoice}
								>
									<Phone size={16} className="sm:size-5" />
								</button>
								<button
									className="bg-gray-300 flex items-center justify-center cursor-pointer h-8 w-8 sm:h-10 sm:w-10 rounded-full hover:bg-gray-400 transition-colors"
									onClick={inviteVideo}
								>
									<Video size={16} className="sm:size-5" />
								</button>
							</div>
						)}
					</header>

					{currentChat ? (
						<div className="flex flex-col flex-1 overflow-hidden">
							<div key={currentChat.conversationID} className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-4">
								{currentChatConv.map((msg, index) => {
									const message = msg as ZIMMessage;
									const text = msg?.message as string || "";

									return (
										<div key={index} className={`flex flex-col ${msg.direction === 0 ? "items-end" : "items-start"}`}>
											<div className={`max-w-[75%] sm:max-w-xs px-3 py-2 sm:px-4 rounded-xl shadow-md ${message.direction === 0 ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
												<p className="text-sm sm:text-base break-words">{text}</p>
											</div>
											<p className="text-[10px] sm:text-xs mt-1 sm:mt-2 text-gray-500">{moment(msg.timestamp).format("hh:mm")}</p>
										</div>
									);
								})}
								<div ref={messagesEndRef}></div>
							</div>

							{/* Message Input */}
							<form onSubmit={handleSendMessage} className="p-3 sm:p-4 bg-white border-t flex items-center gap-2 sm:gap-4">
								<input
									type="text"
									value={input}
									onChange={(e) => setInput(e.target.value)}
									placeholder="Type a message..."
									className="flex-grow px-3 py-2 sm:px-4 border rounded-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
								<button
									type="submit"
									disabled={!input.trim()}
									className="bg-blue-500 text-white px-3 py-2 sm:px-4 rounded-full hover:bg-blue-600 text-sm sm:text-base whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed transition-all"
								>
									Send
								</button>
							</form>
						</div>
					) : (
						<div className="flex-grow flex items-center justify-center p-4 text-center">
							<p className="text-gray-500 text-base sm:text-lg">
								Select a conversation to start chatting
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Chat;
