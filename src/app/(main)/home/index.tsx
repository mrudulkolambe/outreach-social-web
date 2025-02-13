import Postcard from "../../../components/post/Postcard"
import ForumCard from "../../../components/forum/ForumCard"
import RootLayout from "../layout"
import { useFeedContext } from "../../../context/Feed"
import { Swiper, SwiperSlide } from "swiper/react"
import Storycard from "../../../components/Storycard"
import { useAuthContext } from "../../../context/Auth"
import InfiniteScroll from "react-infinite-scroll-component"
import { useForumContext } from "../../../context/Forum"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import Stories from 'react-insta-stories';
import { createStory, getUserStories } from "@/service/storyService"
import moment from "moment"
import Topbar from "@/components/Topbar"
import { DialogTitle } from "@/components/ui/post_dialog"
import { DropdownMenuItem, DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { IoClose } from "react-icons/io5"
import { twMerge } from "tailwind-merge"
import { File } from "lucide-react"
import { getFileType } from "@/utils/file"
import { uploadSingleFile } from "@/service/uploadService"
import { useNavigate } from "react-router-dom"

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
			if (story.public) {
				// Group by username for public stories
				const username = story.userId.username;
				const imageUrl = story.userId.imageUrl;
				if (!groupedMap.hasOwnProperty(username)) {
					groupedMap[username] = {
						username: username,
						stories: [],
						imageUrl: imageUrl,
					};
				}
				groupedMap[username].stories.push(story);
			} else {
				// Group under "anonyms" for non-public stories
				const anonymousGroupName = "anonymous";
				if (!groupedMap.hasOwnProperty(anonymousGroupName)) {
					groupedMap[anonymousGroupName] = {
						username: anonymousGroupName,
						stories: [],
						imageUrl: "/icons/user-placeholder.svg", // No image for anonymous group
					};
				}
				groupedMap[anonymousGroupName].stories.push(story);
			}
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

	const [showAddStory, setShowAddStory] = useState(false)
	const [showDropdown, setShowDropdown] = useState(false)
	const [storyPublic, setStoryPublic] = useState(true)
	const inputRef = useRef<HTMLInputElement | null>(null)
	const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);

	const renderPreviews = (source: SelectedFile[]) => {
		return source.map((item, index) => {
			const fileUrl = URL.createObjectURL(item.file);
			return <div className="flex relative" key={index}>
				<button type="button" className="absolute h-5 w-5 bg-white flex items-center justify-center rounded-full top-1 right-1" onClick={() => removeFile()}><IoClose /></button>
				{item.type === 'png' || item.type === 'jpg' || item.type === 'jpeg' ? (
					<img className="h-20 aspect-video object-cover" src={fileUrl} alt="preview" onLoad={() => URL.revokeObjectURL(fileUrl)} />
				) : (
					<video className="h-20 aspect-video object-cover" controls controlsList="noremoteplayback">
						<source src={fileUrl} type={item.file.type} />
						Your browser does not support the video tag.
					</video>
				)}
			</div>
		});
	};

	const removeFile = () => {
		setSelectedFile(null);
	};

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			const files = Array.from(event.target.files);
			const fileArray = files.map((file) => ({
				file,
				type: getFileType(file)
			}))[0];
			setSelectedFile(fileArray);
		}
	}
	
	const navigate = useNavigate();

	return (
		<RootLayout loading={loading}>

			<Dialog open={storyOpen.show} onOpenChange={(e) => setStoryOpen({ ...storyOpen, show: e })}>
				<DialogContent className="w-[95vw] sm:w-[80vw] md:w-[60vw] lg:w-[50vw] max-w-4xl">
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
						height={window.innerWidth < 768 ? window.innerHeight : 768}
					/>
				</DialogContent>
			</Dialog>
			<Dialog open={showAddStory} onOpenChange={(e) => setShowAddStory(e)}>
				<DialogContent className="lg:w-[80vw] md:w-[60vw] w-full max-w-4xl">
					<DialogTitle>Add Story</DialogTitle>
					<div className='mt-2 flex flex-col sm:flex-row gap-4 sm:items-center'>
						<img className='h-[80px] w-[80px] rounded-full object-cover' src={user?.imageUrl} alt="" />
						<div className="w-full">
							<h3 className='text-lg font-semibold'>{user?.name}</h3>
							<div className='flex flex-wrap items-center gap-3 mt-2'>
								<button onClick={() => setStoryPublic(true)} type="button" className={twMerge('text-sm px-3 py-1 rounded-lg', storyPublic ? "bg-accent text-white" : "text-black bg-accent/20 hover:bg-accent/10 ")}>Public</button>
								<button onClick={() => setStoryPublic(false)} type="button" className={twMerge('text-sm px-3 py-1 rounded-lg', !storyPublic ? "bg-accent text-white" : "text-black bg-accent/20 hover:bg-accent/10 ")}>Private</button>
							</div>
							<input ref={inputRef} type="file" hidden accept=".png,.jpg,.jpeg,.mov,.mp4" onChange={handleFileChange} />
						</div>
					</div>
					<div className="h-24 result flex gap-2 flex-wrap">{selectedFile && renderPreviews([selectedFile])}</div>
					<div className="flex flex-col sm:flex-row items-center gap-3 sm:justify-between">
						<button onClick={() => inputRef.current?.click()} type="button" className="w-full sm:w-auto flex items-center justify-center text-accent text-sm bg-accent/10 px-3 py-1 rounded-lg"><File className="h-3 w-3" />&nbsp; Upload Photos/Videos</button>
						<button onClick={async () => {
							if (selectedFile) {
								const uploadedData = await uploadSingleFile(selectedFile, `story/${Date.now() * Math.random() * 1000}`)
								await createStory({
									public: storyPublic,
									content: "",
									media: uploadedData?.media
								})
								navigate(0)
							}
						}} type="button" className="w-full sm:w-auto flex items-center justify-center text-white text-sm bg-accent px-6 py-2 rounded-lg">{uploading ? "Publishing" : "Post"}</button>
					</div>
				</DialogContent>
			</Dialog>
			<div className='flex flex-col h-full'>
				<Topbar />
				<div className='flex flex-col flex-1 w-full overflow-hidden'>
					<div className='flex-shrink-0 py-3 px-4 sm:px-6 lg:px-10 w-full h-[120px] sm:h-[155px] border-b bg-white'>
						<Swiper
							className='w-full'
							grabCursor
							spaceBetween={10}
							slidesPerView="auto"
							breakpoints={{
								320: {
									slidesPerView: 3.5,
									spaceBetween: 8
								},
								640: {
									slidesPerView: 5,
									spaceBetween: 12
								},
								768: {
									slidesPerView: 6,
									spaceBetween: 16
								},
								1024: {
									slidesPerView: 8,
									spaceBetween: 20
								}
							}}
						>
							{stories.own && <SwiperSlide className='storycard-layout'>
								<DropdownMenu open={showDropdown} onOpenChange={setShowDropdown}>
									<div className='cursor-pointer flex flex-col gap-2 items-center'>
										<div className='flex flex-col h-[80px] sm:h-[100px] w-[70px] sm:w-[85px] bg-accent/20 rounded-lg items-center justify-center px-2 py-3 gap-2 sm:gap-3'>
											<span className='h-5 w-5 sm:h-6 sm:w-6 p-0.5 bg-accent rounded-full flex items-center justify-center text-white'>
												{/* <Plus /> */}
											</span>
											<p className='text-center leading-4 text-xs sm:text-sm'>Add your story</p>
										</div>
									</div>
									<DropdownMenuTrigger className="mt-1 sm:mt-2 text-sm">Your story</DropdownMenuTrigger>
									<DropdownMenuContent align="center">
										{stories.own.length != 0 && <DropdownMenuItem onClick={() => {
											setStoryOpen({
												show: true,
												stories: stories.own.map((story) => ({
													type: story.media.type,
													url: story.media.url,
													header: {
														heading: story.userId.name,
														subheading: moment(story.createdAt).fromNow(),
														profileImage: story.userId.imageUrl,
													},
												}))
											})
										}}>View</DropdownMenuItem>}
										<DropdownMenuItem onClick={() => setShowAddStory(true)}>Add</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</SwiperSlide>}
							{
								handleStories(stories.user).map((userStory) => {
									return <SwiperSlide onClick={() => {
										console.log(userStory.stories)
										setStoryOpen({
											show: true,
											stories: userStory.stories.map((story) => {
												return {
													public: story.public,
													type: story.media.type,
													url: story.media.url,
													header: {
														heading: story.public ? story.userId.name : "Anonymous",
														subheading: moment(story.createdAt).fromNow(),
														profileImage: story.public ? story.userId.imageUrl : "/icons/user-placeholder.svg",
													},
												}
											})
										})
									}} className='storycard-layout' key={userStory.username}>
										<Storycard userStoryGrp={userStory} />
									</SwiperSlide>
								})
							}
						</Swiper>
					</div>
					<div className='flex flex-col lg:flex-row flex-1 w-full overflow-hidden'>
						<div className='relative flex-1 lg:w-9/12 overflow-hidden'>
							<div 
								className='absolute inset-0 px-3 sm:px-4 lg:px-8 overflow-y-auto scrollbar' 
								id="home-feed"
							>
								{uploading && (
									<div className="flex flex-col gap-1 py-4 sm:py-6">
										<span className="relative w-full rounded-full h-2 bg-gray-200 overflow-hidden">
											<span 
												className="bg-accent rounded-full absolute top-0 left-0 h-full duration-100" 
												style={{ width: `${uploadProgress}%` }}
											/>
										</span>
										<p className="text-sm sm:text-base">Your post is publishing...</p>
									</div>
								)}
								<InfiniteScroll
									dataLength={posts?.response.length ?? 0}
									next={loadMorePosts}
									hasMore={hasMorePost}
									loader={<div className="py-4 text-center">Loading more posts...</div>}
									scrollableTarget="home-feed"
									endMessage={
										<p className="text-center py-4">
											<b>Yay! You have seen it all</b>
										</p>
									}
									className="flex flex-col gap-4 sm:gap-6 py-4 max-w-4xl mx-auto"
								>
									{posts?.response.map((post) => (
										<Postcard post={post} key={post._id} />
									))}
								</InfiniteScroll>
							</div>
						</div>
						
						{/* Forums section - hidden on mobile/tablet */}
						<div className='hidden lg:block lg:w-3/12 border-l bg-white'>
							<div className='h-full px-4 py-4 overflow-y-auto scrollbar'>
								<h2 className='text-lg font-bold text-black mb-3'>Join new forum</h2>
								<div className='flex flex-col gap-2.5'>
									{forums
										.filter((forum: Forum) => !forum.joined.includes(user?._id as string) && forum.userId._id !== user?._id)
										.map((forum: Forum) => (
											<ForumCard forum={forum} key={forum._id} />
										))
									}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</RootLayout>
	)
}

export default Home