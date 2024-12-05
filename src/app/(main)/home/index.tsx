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
import { Dialog, DialogContent } from "@/components/ui/dialog"
import Stories from 'react-insta-stories';
import { getUserStories } from "@/service/storyService"
import moment from "moment"
import Topbar from "@/components/Topbar"

const Home = () => {
	const { posts, uploading, uploadProgress, loadMorePosts, hasMorePost, loading } = useFeedContext()
	const { forums } = useForumContext()
	const { user } = useAuthContext()
	const [stories, setStories] = useState<StoryResponse>({ own: [], user: [] });
	let emptyStories: any[] = []
	const [storyOpen, setStoryOpen] = useState({
		show: false,
		stories: emptyStories
	})


	function handleStories(stories: UserStory[]): UserStoryGroup[] {
		const groupedMap: Record<string, UserStoryGroup> = {};

		for (const story of stories) {
			const username = story.userId.username;
			const imageUrl = story.userId.imageUrl;
			if (!groupedMap.hasOwnProperty(username)) {
				groupedMap[username] = {
					username: username,
					stories: [],
					imageUrl: imageUrl
				};
			}
			groupedMap[username].stories.push(story);
		}

		return Object.values(groupedMap);
	}

	useEffect(() => {
		if (user) {
			initStories()
		}
	}, [user])

	const initStories = async () => {
		let stories = await getUserStories();
		console.log("STORIES", stories)
		if (stories) {
			setStories(stories.response)
		}
	}

	useEffect(() => {
		if (!storyOpen.show) {
			const timer = setTimeout(() => setStoryOpen({ show: false, stories: [] }), 300);
			return () => clearTimeout(timer);
		}
	}, [storyOpen.show, setStoryOpen]);

	return (
		<RootLayout loading={loading}>
			<Dialog open={storyOpen.show} onOpenChange={(e) => setStoryOpen({ ...storyOpen, show: e })}>
				<DialogContent>
					<Stories
						storyContainerStyles={{
							background: "#000",
						}}
						storyInnerContainerStyles={{
							background: "#000",
						}}
						keyboardNavigation={true}
						onAllStoriesEnd={() => {
							console.log("All stories ended");
							setStoryOpen(prev => ({ ...prev, show: false }));
						}}
						stories={storyOpen.stories || []}
						defaultInterval={8000}
						width={"100%"}
						height={768}
					/>
				</DialogContent>
			</Dialog>
			<div className='flex flex-col'>
				<Topbar />
				<div className='flex items-center py-3 px-10 w-full h-[155px]'>
					<Swiper
						className='w-full'
						grabCursor
						spaceBetween={20}
					>
						<SwiperSlide className='storycard-layout'>
							<div onClick={() => {
								setStoryOpen({
									show: true, stories: stories.own.map((story) => {
										return {
											type: story.media.type,
											url: story.media.url,
											header: {
												heading: story.userId.name,
												subheading: moment(story.createdAt).fromNow(),
												profileImage: story.userId.imageUrl,
											},
										}
									})
								})
							}} className='flex flex-col gap-2 items-center'>
								<div className='flex flex-col h-[100px] w-[85px] bg-accent/20 rounded-lg items-center justify-center px-2 py-3 gap-3'>
									<span className='h-6 w-6 p-0.5 bg-accent rounded-full flex items-center justify-center text-white'>
										<Plus />
									</span>
									<p className='text-center leading-4 text-sm'>Add your story</p>
								</div>
								<p>Your story</p>
							</div>
						</SwiperSlide>
						{
							handleStories(stories.user).map((userStory) => {
								return <SwiperSlide onClick={() => {
									setStoryOpen({
										show: true,
										stories: userStory.stories.map((story) => {
											return {
												type: story.media.type,
												url: story.media.url,
												header: {
													heading: story.userId.name,
													subheading: moment(story.createdAt).fromNow(),
													profileImage: story.userId.imageUrl,
												},
											}
										})
									})
								}} className='storycard-layout' key={userStory.username}>
									<Storycard userStoryGrp={userStory} />
								</SwiperSlide>
							})
						}
						{/* <SwiperSlide className='storycard-layout'>
							<Storycard />
						</SwiperSlide> */}
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
					<div className='main-height flex-1 px-5 py-5 overflow-y-auto scrollbar'>
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
		</RootLayout >
	)
}

export default Home