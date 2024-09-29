import { useEffect, useState } from 'react'
import RootLayout from '../layout'
import JoinedForumSidebar from '@/components/forum/JoinedForumSidebar'
import Topbar from '@/components/Topbar'
import { useParams } from 'react-router-dom'
import { ForumPostsResponse, ForumResponse, getForum, getForumPosts, handleJoinForum } from '@/service/forumService'
import { CiLock } from "react-icons/ci";
import { useAuthContext } from '@/context/Auth'
import InfiniteScroll from 'react-infinite-scroll-component'
import ForumPostCard from '@/components/forum/ForumPostCard'


const Forum = () => {
	const { _id } = useParams();
	const { user } = useAuthContext();
	const [forum, setForum] = useState<ForumResponse | null>()
	const [forumPosts, setForumPosts] = useState<ForumPostsResponse | null>()
	const [hasMorePost, setHasMorePost] = useState<boolean>(false);
	// const [currentPage, setCurrentPage] = useState<number>(1);


	const fetchForum = async () => {
		setForum(await getForum(_id as string));
		const posts = await getForumPosts(_id as string, 1)
		console.log(posts)
		console.log(posts.currentPage < posts.totalPages)
		setHasMorePost(posts.currentPage < posts.totalPages)
		setForumPosts(posts);
	}

	useEffect(() => {
		fetchForum()
	}, [_id])


	return (
		<>
			<RootLayout sidebar={<JoinedForumSidebar />}>
				<div className='flex flex-col h-screen max-h-screen'>
					<Topbar />
					<div className='flex flex-col items-start py-3 px-10 w-full bg-accent/5 primary-height overflow-auto scrollbar'>
						<img src={forum?.response?.image} className='animate-shimmer skeleton min-h-[50vh] h-[50vh] w-full rounded-lg object-cover' alt="" />
						<h1 className='text-3xl font-bold mt-4'>{forum?.response?.name || "loading..."}</h1>
						<div className='flex items-center justify-between w-full'>
							<div className='flex gap-4 items-center'>
								<p className='text-gray-600'>Created By</p>
								<div className='flex items-center gap-2'>
									<img src={forum?.response?.userId.imageUrl} className='h-10 w-10 rounded-full' alt="" />
									<p className='text-lg font-bold'>@{forum?.response?.userId.username}</p>
								</div>
							</div>
							<div className='flex items-center'>
								<img src={forum?.response?.userId.imageUrl} className='h-10 w-10 rounded-full border-2 border-white -mr-3' alt="" />
								<img src={forum?.response?.userId.imageUrl} className='h-10 w-10 rounded-full border-2 border-white -mr-3' alt="" />
								<img src={forum?.response?.userId.imageUrl} className='h-10 w-10 rounded-full border-2 border-white -mr-3' alt="" />
							</div>
						</div>
						{
							!forum?.response?.joined.includes(user?._id as string) && <div className={'flex flex-col'}>
								<h3 className='text-xl font-bold'>About</h3>
								<p className='mt-3'>{forum?.response?.description}</p>
								{
									!forum?.response?.public && <div className='mt-5 flex flex-col gap-1'>
										<div className='flex items-center gap-3'>
											<CiLock className='text-accent stroke-2' />
											<p className='font-bold'>Private</p>
										</div>
										<p>Only members can see who's in the group and what they post.</p>
									</div>
								}
								{
									forum?.response?.userId._id !== user?._id && !forum?.response?.joined.includes(user?._id as string) && <div className='mt-6'>
										<button onClick={() => handleJoinForum(forum?.response?._id as string)} className='button py-2 px-8 w-max'>Join now</button>
									</div>
								}
							</div>
						}
						{
							forum?.response?.joined.includes(user?._id as string) && <div className='h-56 mt-4 grid grid-cols-12 w-full'>
								<div className='col-span-8'>
									<InfiniteScroll
										dataLength={10}
										next={() => {
											// loadMorePosts()
										}}
										hasMore={hasMorePost}
										loader={<h4>Loading...</h4>}
										scrollableTarget={"forum-feed"}
										endMessage={
											<p style={{ textAlign: 'center' }}>
												<b>Yay! You have seen it all</b>
											</p>
										}
									>
										{
											forumPosts?.response?.map((forumPost: ForumPost) => {
												return <ForumPostCard post={forumPost}/>
											})
										}
									</InfiniteScroll>
								</div>
								<div className='px-4 py-3 col-span-4'>
									<h3 className='text-xl font-bold'>About</h3>
									<p className='mt-3'>{forum?.response?.description}</p>
									{
										!forum?.response?.public && <div className='mt-5 flex flex-col gap-1'>
											<div className='flex items-center gap-3'>
												<CiLock className='text-accent stroke-2' />
												<p className='font-bold'>Private</p>
											</div>
											<p>Only members can see who's in the group and what they post.</p>
										</div>
									}
								</div>
							</div>
						}
					</div>
				</div>
			</RootLayout>
		</>
	)
}

export default Forum