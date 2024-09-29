import { useAuthContext } from '@/context/Auth';
import { useForumContext } from '@/context/Forum'
import { Link } from 'react-router-dom';

const JoinedForumSidebar = () => {
	const {forums} = useForumContext();
	const {user} = useAuthContext();
	return (
		<div className='flex flex-col gap-3'>
			<h2 className='font-bold text-xl'>List of joined forums</h2>
			{
				forums.filter((forum: Forum) => forum.joined.includes(user?._id as string) || forum.userId._id === user?._id).map((forum: Forum) => {
					return (
						<>
							<Link to={`/forum/${forum._id}`} className='w-full gap-3 flex'>
								<img src={forum.image} className='h-12 w-12 rounded-full' alt="" />
								<div>
									<h4 className='font-bold'>{forum.name}</h4>
									<p className='text-sm font-semibold text-gray-500'>{forum.joined.length} members</p>
								</div>
							</Link>
						</>
					)
				})
			}
		</div>
	)
}

export default JoinedForumSidebar