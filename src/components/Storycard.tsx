const Storycard = ({userStoryGrp}: {userStoryGrp: UserStoryGroup}) => {
	return (
		<div className='flex flex-col gap-2 items-center'>
			<img className='h-[100px] w-[85px] rounded-lg' src={userStoryGrp.imageUrl}/>
			<p className="w-[85px] whitespace-nowrap text-ellipsis overflow-hidden text-center">@{userStoryGrp.username}</p>
		</div>
	)
}

export default Storycard