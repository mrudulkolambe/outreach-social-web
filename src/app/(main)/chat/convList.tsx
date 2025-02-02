import { endpoints } from "@/config/endpoints";
import axios from "axios";
import { useEffect, useState } from "react";
import { ZIMConversation } from "zego-zim-web";

const ConversationList = ({
	conversations,
	onSelect,
	onGlobalUserSelect,
	baseUser,
	fetchGlobal,
}: {
	conversations: ZIMConversation[];
	onSelect: (chat: ZIMConversation) => void;
	onGlobalUserSelect: (user: ZIMConversation) => void;
	baseUser: BaseUser | null,
	fetchGlobal: boolean,
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
		// @ts-ignore
		let debounceTimeout;
		if (fetchGlobal) {
			debounceTimeout = setTimeout(fetchGlobalUsers, 300); // Debounce API calls by 300ms
			// @ts-ignore
			return () => clearTimeout(debounceTimeout); // Clear timeout if search changes quickly
		}
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
						<p className="text-xs text-gray-500">{conv.lastMessage?.direction == 0 ? "Sent: " : ""}{conv.lastMessage?.message}</p>
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

export default ConversationList
