import { useAuthContext } from '@/context/Auth'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const Topbar = () => {
	const { user } = useAuthContext()
	const [search, setSearch] = useState("")
	return (
		<div className='border-b h-[80px] w-full flex items-center justify-end px-9 gap-5'>
			<input id='search' onChange={(e) => setSearch(e.currentTarget.value)} placeholder='Search...' type='text' value={search} className='px-4 py-2 bg-black/10 rounded-lg' />
			<Link to={"/profile"}>
				{
					user?.imageUrl ? <img className='h-[30px] w-[30px] rounded-full object-cover' src={user?.imageUrl} alt="" /> : <span className='h-[30px] w-[30px] rounded-full object-cover uppercase text-white text-2xl font-bold'>{user?.name.charAt(0)}</span>

				}
			</Link>
		</div>
	)
}

export default Topbar