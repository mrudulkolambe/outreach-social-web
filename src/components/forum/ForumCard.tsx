import { Link } from 'react-router-dom'
import TextButton from '../TextButton'

const ForumCard = ({ forum }: { forum: Forum }) => {
	return (
		<Link to={`/forum/${forum._id}`}><div className='bg-white rounded-xl hover:bg-accent/5 duration-100 p-3 flex items-center justify-between'>
			<div className='flex gap-3 items-center'>
				<img className='h-12 w-12 rounded-full object-cover' src={forum.image} alt="" />
				<h3 className='font-medium'>{forum.name}</h3>
			</div>
			<TextButton text='Join' className='text-button text-base' type='button' />
		</div></Link>
	)
}

export default ForumCard