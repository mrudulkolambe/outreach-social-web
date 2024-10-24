import { Link } from "react-router-dom"
import Postcard from "../../../components/post/Postcard"
import ForumCard from "../../../components/forum/ForumCard"
import RootLayout from "../layout"
import { useFeedContext } from "../../../context/Feed"
import { Swiper, SwiperSlide } from "swiper/react"
import { Plus } from "lucide-react"
import Storycard from "../../../components/Storycard"
import { useAuthContext } from "../../../context/Auth"
import InfiniteScroll from "react-infinite-scroll-component"
import { useForumContext } from "../../../context/Forum"
import { useEffect, useState } from "react"

const Home = () => {
	const { posts, uploading, uploadProgress, loadMorePosts, hasMorePost } = useFeedContext()
	const { forums } = useForumContext()
	const { user } = useAuthContext()
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		setTimeout(() => {
			setLoading(false)
		}, 4000);
	}, [])

	return (
		<RootLayout loading={loading}>
			<div className='flex flex-col'>
				<div className='border-b h-[80px] w-full flex items-center justify-end px-9'>
					<Link to={"/profile"}><img className='h-[30px] w-[30px] rounded-full object-cover' src={user?.imageUrl} alt="" /></Link>
				</div>
				<div className='flex items-center py-3 px-10 w-full h-[155px]'>
					<Swiper
						freeMode={true}
						className='w-full'
						grabCursor
						spaceBetween={20}
					>
						<SwiperSlide className='storycard-layout'>
							<div className='flex flex-col gap-2 items-center'>
								<div className='flex flex-col h-[100px] w-[85px] bg-accent/20 rounded-lg items-center justify-center px-2 py-3 gap-3'>
									<span className='h-6 w-6 p-0.5 bg-accent rounded-full flex items-center justify-center text-white'>
										<Plus />
									</span>
									<p className='text-center leading-4 text-sm'>Add your story</p>
								</div>
								<p>Your story</p>
							</div>
						</SwiperSlide>
						<SwiperSlide className='storycard-layout'>
							<Storycard />
						</SwiperSlide>
						<SwiperSlide className='storycard-layout'>
							<Storycard />
						</SwiperSlide>
						<SwiperSlide className='storycard-layout'>
							<Storycard />
						</SwiperSlide>
						<SwiperSlide className='storycard-layout'>
							<Storycard />
						</SwiperSlide>
						<SwiperSlide className='storycard-layout'>
							<Storycard />
						</SwiperSlide>
						<SwiperSlide className='storycard-layout'>
							<Storycard />
						</SwiperSlide>
						<SwiperSlide className='storycard-layout'>
							<Storycard />
						</SwiperSlide>
						<SwiperSlide className='storycard-layout'>
							<Storycard />
						</SwiperSlide>
						<SwiperSlide className='storycard-layout'>
							<Storycard />
						</SwiperSlide>
						<SwiperSlide className='storycard-layout'>
							<Storycard />
						</SwiperSlide>
						<SwiperSlide className='storycard-layout'>
							<Storycard />
						</SwiperSlide>
						<SwiperSlide className='storycard-layout'>
							<Storycard />
						</SwiperSlide>
						<SwiperSlide className='storycard-layout'>
							<Storycard />
						</SwiperSlide>
					</Swiper>
				</div>
				<div className='flex '>
					<div className='main-height w-[55vw] px-5 overflow-y-auto scrollbar' id="home-feed">
						{
							uploading && <div className="flex flex-col gap-1 py-6">
								<span className="relative w-full rounded-full h-2 bg-gray-200 overflow-hidden">
									<span className="bg-accent rounded-full absolute top-0 left-0 h-full duration-100" style={{
										width: `${uploadProgress}%`
									}}></span>
								</span>
								<p>Your post is publishing...</p>
							</div>
						}
						<InfiniteScroll
							dataLength={posts?.response.length ?? 0}
							next={() => {
								loadMorePosts()
							}}
							hasMore={hasMorePost}
							loader={<h4>Loading...</h4>}
							scrollableTarget={"home-feed"}
							endMessage={
								<p style={{ textAlign: 'center' }}>
									<b>Yay! You have seen it all</b>
								</p>
							}
						>
							{
								posts?.response.map((post) => {
									return <Postcard post={post} key={post._id} />
								})
							}
						</InfiniteScroll>
					</div>
					<div className='main-height w-[25vw] px-5 py-5'>
						<h2 className='text-2xl font-bold'>Join new forum</h2>
						<div className='mt-4'>
							{
								forums.filter((forum: Forum) => !forum.joined.includes(user?._id as string) && forum.userId._id !== user?._id).map((forum: Forum) => {
									return <ForumCard forum={forum} />
								})
							}
						</div>
					</div>
				</div>
			</div>
		</RootLayout>
	)
}

export default Home