import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuthContext } from "@/context/Auth";
import { ZIM, ZIMConversation, ZIMMessage } from "zego-zim-web";
import { sendMessage, zim, zp } from "@/utils/zim";
import Avatar from "react-avatar";
import { endpoints } from "@/config/endpoints";
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';


const ConversationList = ({
	conversations,
	onSelect,
	onGlobalUserSelect,
	baseUser
}: {
	conversations: ZIMConversation[];
	onSelect: (chat: ZIMConversation) => void;
	onGlobalUserSelect: (user: ZIMConversation) => void;
	baseUser: BaseUser | null
}) => {
	const [search, setSearch] = useState("");
	const [globalUsers, setGlobalUsers] = useState<ZIMConversation[]>([]);
	const [loading, setLoading] = useState(false);

	// Filter conversations based on search input
	const filteredConversations = conversations.filter((conv) =>
		conv.conversationName.toLowerCase().includes(search.toLowerCase())
	);

	// Fetch global users based on search input
	useEffect(() => {
		if (search.trim() === "") {
			setGlobalUsers([]);
			return;
		}

		const fetchGlobalUsers = async () => {
			setLoading(true);
			try {
				const res = await axios.get(`${endpoints["global-search"]}?query=${search}&user=${baseUser?._id}`);
				setGlobalUsers(res.data.response.map((item: BaseUser) => {
					return {
						conversationID: item._id,
						conversationName: item.username
					}
				}) || []); // Assuming the API returns `users` array
			} catch (error) {
				console.error("Error fetching global users:", error);
			} finally {
				setLoading(false);
			}
		};

		const debounceTimeout = setTimeout(fetchGlobalUsers, 300); // Debounce API calls by 300ms
		return () => clearTimeout(debounceTimeout); // Clear timeout if search changes quickly
	}, [search]);

	return (
		<div className="h-full bg-gray-100 p-4 border-r">
			{/* Search Input */}
			<div className="mb-4">
				<input
					type="text"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Search..."
					className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			{/* Filtered Conversations */}
			<ul className="space-y-2">
				{filteredConversations.map((conv) => (
					<li
						key={conv.conversationID}
						onClick={() => onSelect(conv)}
						className="p-3 bg-white rounded-lg cursor-pointer hover:bg-blue-100 shadow-sm"
					>
						<div className="font-semibold">{conv.conversationName}</div>
					</li>
				))}
			</ul>

			{/* Divider */}
			{search && (
				<div className="my-4 text-gray-500 text-sm text-center">Search Results</div>
			)}

			{/* Global Users */}
			<ul className="space-y-2">
				{loading ? (
					<p className="text-gray-500 text-center">Searching...</p>
				) : (
					globalUsers.map((user) => (
						<li
							key={user.conversationID}
							onClick={() => onGlobalUserSelect(user)}
							className="p-3 bg-white rounded-lg cursor-pointer hover:bg-green-100 shadow-sm"
						>
							<div className="font-semibold">{user.conversationName}</div>
							<div className="text-sm text-gray-500">{user.conversationID}</div>
						</li>
					))
				)}
			</ul>
		</div>
	);
};


const Chat = () => {
	const { conversations, baseUser } = useAuthContext();
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
		if (currentChat) {
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

	}, [currentChat])


	const init = async () => {
		zim.on("peerMessageReceived", function (zim, { messageList, fromConversationID }) {
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

	const handleSendMessage = async () => {
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
			{/* Sidebar */}
			<div className="w-1/4 h-full">
				<ConversationList
					conversations={conversations}
					onSelect={handleConversationSelect}
					onGlobalUserSelect={handleGlobalUserSelect}
					baseUser={baseUser}
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
					<div onClick={inviteVideo}>Video</div>
					<div onClick={inviteVoice}>Voice</div>
				</header>

				{currentChat ? (
					<div className="flex flex-col flex-1 overflow-y-auto">
						<div key={currentChat.conversationID} className="flex-grow overflow-y-auto p-6 space-y-4">
							{currentChatConv.map((msg, index) => {
								return <div
									key={index}
									className={`flex ${msg.direction === 0 ? "justify-end" : "justify-start"
										}`}
								>
									<div
										className={`max-w-xs px-4 py-2 rounded-xl shadow-md ${msg.direction === 0
											? "bg-blue-500 text-white"
											: "bg-gray-200 text-black"
											}`}
									>
										<p className="text-base">{msg.message}</p>
									</div>
								</div>
							})}
							<div ref={messagesEndRef}></div>
						</div>

						{/* Message Input */}
						<div className="p-4 bg-white border-t flex items-center space-x-4">
							<input
								type="text"
								value={input}
								onChange={(e) => setInput(e.target.value)}
								placeholder="Type a message..."
								className="flex-grow px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							<button
								onClick={handleSendMessage}
								className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
							>
								Send
							</button>
						</div>
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
