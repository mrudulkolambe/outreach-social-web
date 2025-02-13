import { useAuthContext } from '@/context/Auth'
import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5'
import axios from 'axios'
import { endpoints } from '@/config/endpoints'
import Avatar from 'react-avatar'
import { useClickOutside } from "react-haiku"

const Topbar = () => {
	const { user, baseUser } = useAuthContext()
	const [search, setSearch] = useState("")
	const [globalUsers, setGlobalUsers] = useState<SearchUser[]>([]);
	const [loading, setLoading] = useState(false);
	const suggestionRef = useRef<HTMLDivElement | null>(null)
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
				setGlobalUsers(res.data.response || []); // Assuming the API returns `users` array
			} catch (error) {
				console.error("Error fetching global users:", error);
			} finally {
				setLoading(false);
			}
		};
		// @ts-ignore
		let debounceTimeout;

		debounceTimeout = setTimeout(fetchGlobalUsers, 300); // Debounce API calls by 300ms
		// @ts-ignore
		return () => clearTimeout(debounceTimeout); // Clear timeout if search changes quickly
	}, [search]);

	const [showSuggestions, setShowSuggestions] = useState(false)
	useClickOutside(suggestionRef, () => {
		console.log("OUTSIDE");
		setShowSuggestions(false)
	});
	return (
		<div className='border-b h-[60px] sm:h-[80px] w-full flex items-center justify-between sm:justify-end px-4 sm:px-6 lg:px-9 gap-3 sm:gap-5'>
			<div className='flex-1 sm:flex-none relative'>
				<input 
					id='search' 
					onFocus={() => setShowSuggestions(true)} 
					onChange={(e) => setSearch(e.currentTarget.value)} 
					placeholder='Search...' 
					type='text' 
					value={search} 
					className='w-full sm:w-[300px] lg:w-[400px] px-3 sm:px-4 py-2 bg-black/5 rounded-lg border-2 text-sm sm:text-base' 
				/>
				{showSuggestions && (
					<div 
						ref={suggestionRef} 
						className='bg-white z-50 max-h-[60vh] sm:max-h-[400px] overflow-y-auto absolute top-full mt-2 w-full sm:w-[300px] lg:w-[400px] right-0 rounded-lg shadow-xl p-2 sm:p-3 flex flex-col gap-2 sm:gap-3'
					>
						{globalUsers.map((user) => (
							<Link 
								to={`/user/${user._id}`} 
								key={user._id} 
								className='cursor-pointer bg-white hover:bg-gray-50 rounded-lg p-2 flex items-center gap-2'
								onClick={() => {
									setShowSuggestions(false);
									setSearch('');
								}}
							>
								<Avatar 
									size='36' 
									className='flex-shrink-0'
									name={user.name} 
									src={user.imageUrl} 
									round 
								/>
								<div className='flex flex-col min-w-0'>
									<h3 className='text-sm sm:text-base font-semibold truncate'>{user.name}</h3>
									<p className='text-xs sm:text-sm text-gray-600 truncate'>@{user.username}</p>
								</div>
							</Link>
						))}
						{globalUsers.length === 0 && (
							<div className='flex items-center justify-center py-4 text-sm sm:text-base text-gray-500'>
								{loading ? 'Searching...' : 'No results found'}
							</div>
						)}
					</div>
				)}
			</div>

			<div className='flex items-center gap-3 sm:gap-5'>
				<Link 
					to="/chat" 
					className='flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 hover:bg-gray-100 rounded-full transition-colors'
				>
					<IoChatbubbleEllipsesOutline className='h-5 w-5 sm:h-6 sm:w-6' />
				</Link>

				<Link 
					to="/profile" 
					className='flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-full overflow-hidden'
				>
					{user?.imageUrl ? (
						<img 
							className='h-full w-full object-cover' 
							src={user?.imageUrl} 
							alt={user?.name} 
						/>
					) : (
						<div className='h-full w-full flex items-center justify-center bg-blue-500 text-white text-base sm:text-lg font-medium uppercase'>
							{user?.name.charAt(0)}
						</div>
					)}
				</Link>
			</div>
		</div>
	)
}

export default Topbar