import { useAuthContext } from '@/context/Auth'
import { Link } from 'react-router-dom'

const Topbar = () => {
	const { user } = useAuthContext()
	return (
		<div className='border-b h-[80px] w-full flex items-center justify-end px-9'>
			<Link to={"/profile"}>
				{
					user?.imageUrl ? <img className='h-[30px] w-[30px] rounded-full object-cover' src={user?.imageUrl} alt="" /> : <span className='h-[30px] w-[30px] rounded-full object-cover uppercase text-white text-2xl font-bold'>{user?.name.charAt(0)}</span>

				}
			</Link>
		</div>
	)
}

export default Topbar