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
		<div className='border-b h-[80px] w-full flex items-center justify-end px-9 gap-5'>
			<div className='flex relative'>
				<input id='search' onFocus={() => setShowSuggestions(true)} onChange={(e) => setSearch(e.currentTarget.value)} placeholder='Search...' type='text' value={search} className='w-[20vw] px-4 py-2 bg-black/5 rounded-lg border-2' />
				{showSuggestions && <div ref={suggestionRef} className='bg-white z-50 h-56 overflow-y-auto absolute top-full mt-2 w-[20vw] right-0 rounded-lg shadow-xl p-3 flex flex-col gap-3'>
					{
						globalUsers.map((user) => {
							return <Link to={`/user/${user._id}`} key={user._id} className='cursor-pointer bg-white rounded-lg p-2 flex gap-2'>
								<Avatar size='48' name={user.name} src={user.imageUrl} round />
								<div className='flex flex-col'>
									<h3 className='text-base font-semibold'>{user.name}</h3>
									<p className='text-sm text-gray-600'>@{user.username}</p>
								</div>
							</Link>
						})
					}
					{globalUsers.length == 0 && <p>No results!</p>}
				</div>}
			</div>

			<Link to={"/chat"} ><IoChatbubbleEllipsesOutline className='h-6 w-6 cursor-pointer' /></Link>

			{loading && ""}
			<Link to={"/profile"}>
				{
					user?.imageUrl ? <img className='h-[30px] w-[30px] rounded-full object-cover' src={user?.imageUrl} alt="" /> : <span className='h-[30px] w-[30px] rounded-full object-cover uppercase text-white text-2xl font-bold'>{user?.name.charAt(0)}</span>
				}
			</Link>
		</div>
	)
}

export default Topbar