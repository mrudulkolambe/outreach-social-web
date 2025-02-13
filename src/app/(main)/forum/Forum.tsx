import { ChangeEvent, useEffect, useRef, useState } from 'react'
import RootLayout from '../layout'
import JoinedForumSidebar from '@/components/forum/JoinedForumSidebar'
import Topbar from '@/components/Topbar'
import { useParams } from 'react-router-dom'
import { createForumPost, ForumPostsResponse, ForumResponse, getForum, getForumPosts, handleJoinForum } from '@/service/forumService'
import { CiLock } from "react-icons/ci";
import { useAuthContext } from '@/context/Auth'
import InfiniteScroll from 'react-infinite-scroll-component'
import ForumPostCard from '@/components/forum/ForumPostCard'
import { IoClose } from 'react-icons/io5'
import { twMerge } from 'tailwind-merge'
import { getFileType } from '@/utils/file'
import { File } from 'lucide-react'
import { uploadMultipleFiles } from '@/service/uploadService'
import { toast } from 'sonner'


const Forum = () => {
	const { _id } = useParams();
	const { user } = useAuthContext();
	const [forum, setForum] = useState<ForumResponse | null>()
	const [forumPosts, setForumPosts] = useState<ForumPostsResponse | null>()
	const [hasMorePost, setHasMorePost] = useState<boolean>(false);
	const [loading, setLoading] = useState(true)
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [postDialog, setPostDialog] = useState(false)
	const [isPublic, setIsPublic] = useState(true)
	const [content, setContent] = useState("")
	const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
	const [uploading, setUploading] = useState<Boolean>(false);
	const inputRef = useRef<HTMLInputElement | null>(null);
	const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			const files = Array.from(event.target.files);
			const fileArray = files.map((file) => ({
				file,
				type: getFileType(file)
			}));
			setSelectedFiles((prevFiles) => prevFiles.concat(fileArray));
		}
	}

	const createPost = async () => {
		setUploading(true)
		try {
			let urls = await uploadMultipleFiles(selectedFiles, 'posts');
			if (urls) {
				const body = {
					"public": isPublic,
					"content": content,
					"media": urls?.results,
				};
				const result = await createForumPost(body, _id as string);
				if (result) {
					const posts = await getForumPosts(_id as string, 1)
					console.log(posts)
					console.log(posts.currentPage < posts.totalPages)
					setHasMorePost(posts.currentPage < posts.totalPages)
					setForumPosts(posts);
					setLoading(false)
					toast.success("Post published successfully!");
				} else {
					toast.error("Something went wrong, Please try again!")
				}
				setUploading(false)
			}
			return 200
		} catch (error) {
			setUploading(false)
			return 400
		}
		// createForumPost(body, _id as string);
	}

	const loadMorePosts = async () => {
		if (hasMorePost) {
			const nextPage = currentPage + 1;
			const morePostsResponse = await getForumPosts(_id as string, nextPage);
			if (morePostsResponse) {
				const sortedData = forumPosts?.response!.concat(morePostsResponse.response!) ?? []
				setForumPosts({ ...morePostsResponse, response: sortedData.sort((a, b) => b.createdAt - a.createdAt) })
				setCurrentPage(nextPage);
				setHasMorePost(morePostsResponse.totalPages > morePostsResponse.currentPage);
			}
		} else {
			console.log("Else Load More Posts");
		}
	};

	const fetchForum = async () => {
		setForum(await getForum(_id as string));
		const posts = await getForumPosts(_id as string, 1)
		console.log(posts)
		console.log(posts.currentPage < posts.totalPages)
		setHasMorePost(posts.currentPage < posts.totalPages)
		setForumPosts(posts);
		setLoading(false)
	}

	useEffect(() => {
		fetchForum()
	}, [_id])
	
	const removeFile = (index: number) => {
		setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
	};
	const renderPreviews = (source: SelectedFile[]) => {
		return source.map((item, index) => {
			const fileUrl = URL.createObjectURL(item.file);
			return <div className="flex relative" key={index}>
				<button type="button" className="absolute h-5 w-5 bg-white flex items-center justify-center rounded-full top-1 right-1" onClick={() => removeFile(index)}><IoClose /></button>
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

	return (
		<>
			{postDialog && <div className='fixed h-screen w-screen bg-black/50 z-20 top-0 left-0 flex items-center justify-center p-4'>
				<form className='w-full md:w-[56vw] h-[80vh] md:h-[65vh] bg-white rounded-xl py-5 px-4 md:px-8'>
					<div className='flex items-center justify-between'>
						<h1 className='text-xl md:text-2xl font-bold'>Share your post</h1>
						<span onClick={() => setPostDialog(false)} className='h-6 w-6 rounded-md bg-accent/10 flex items-center justify-center hover:bg-accent/20 duration-100 cursor-pointer'>
							<IoClose />
						</span>
					</div>
					<div className='mt-2 flex gap-3 items-center'>
						<img className='h-[60px] w-[60px] md:h-[80px] md:w-[80px] rounded-full object-cover' src={user?.imageUrl} alt="" />
						<div>
							<h3 className='text-base md:text-lg font-semibold'>{user?.name}</h3>
							<div className='flex items-center gap-3 mt-2'>
								<button onClick={() => setIsPublic(true)} type="button" className={twMerge('text-xs md:text-sm px-3 py-1 rounded-lg', isPublic ? "bg-accent text-white" : "text-black bg-accent/20 hover:bg-accent/10 ")}>Public</button>
								<button onClick={() => setIsPublic(false)} type="button" className={twMerge('text-xs md:text-sm px-3 py-1 rounded-lg', !isPublic ? "bg-accent text-white" : "text-black bg-accent/20 hover:bg-accent/10 ")}>Private</button>
							</div>
							<input ref={inputRef} type="file" hidden multiple accept=".png,.jpg,.jpeg,.mov,.mp4" onChange={handleFileChange} />
						</div>
					</div>

					<div className="relative h-[45%] md:h-[55%]">
						<textarea value={content} ref={textAreaRef} onChange={(e) => setContent(e.target.value)} className="bg-accent/5 px-4 py-2 rounded-lg resize-none scrollbar outline-none border-0 flex-1 mt-3 w-full h-full" placeholder="What's on your mind?"></textarea>
					</div>
					<div className="h-24 result flex gap-2 flex-wrap">{renderPreviews(selectedFiles)}</div>
					<div className="items-center flex justify-between">
						<button onClick={() => inputRef.current?.click()} type="button" className="flex items-center justify-center text-accent text-xs md:text-sm bg-accent/10 px-2 md:px-3 py-1 rounded-lg"><File className="h-3 w-3" />&nbsp; Upload</button>
						<button onClick={async () => {
							const status = await createPost();
							if (status == 200) {
								setPostDialog(false);
								setSelectedFiles([]);
								setContent("")
							}
						}} type="button" className="flex items-center justify-center text-white text-xs md:text-sm bg-accent px-4 md:px-6 py-1.5 md:py-2 rounded-lg">{uploading ? "Publishing" : "Post"}</button>
					</div>
				</form>
			</div>}
			<RootLayout loading={loading} sidebar={<JoinedForumSidebar />}>
				<div className='flex flex-col h-screen max-h-screen'>
					<Topbar />
					<div className='flex flex-col items-start py-3 px-4 md:px-10 w-full bg-accent/5 primary-height overflow-auto scrollbar'>
						<img src={forum?.response?.image} className='animate-shimmer skeleton min-h-[30vh] md:min-h-[50vh] h-[30vh] md:h-[50vh] w-full rounded-lg object-cover' alt="" />
						<h1 className='text-2xl md:text-3xl font-bold mt-4'>{forum?.response?.name || "loading..."}</h1>
						<div className='flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-4 md:gap-0'>
							<div className='flex gap-4 items-center'>
								<p className='text-gray-600 text-sm md:text-base'>Created By</p>
								<div className='flex items-center gap-2'>
									<img src={forum?.response?.userId.imageUrl} className='h-8 w-8 md:h-10 md:w-10 rounded-full' alt="" />
									<p className='text-base md:text-lg font-bold text-black'>@{forum?.response?.userId.username}</p>
								</div>
							</div>
							<div className='flex items-center'>
								<img src={forum?.response?.userId.imageUrl} className='h-8 w-8 md:h-10 md:w-10 rounded-full border-2 border-white -mr-3' alt="" />
								<img src={forum?.response?.userId.imageUrl} className='h-8 w-8 md:h-10 md:w-10 rounded-full border-2 border-white -mr-3' alt="" />
								<img src={forum?.response?.userId.imageUrl} className='h-8 w-8 md:h-10 md:w-10 rounded-full border-2 border-white -mr-3' alt="" />
							</div>
						</div>
						{
							!forum?.response?.joined.includes(user?._id as string) && <div className={'flex flex-col w-full'}>
								<h3 className='text-lg md:text-xl font-bold'>About</h3>
								<p className='mt-3 text-sm md:text-base'>{forum?.response?.description}</p>
								{
									!forum?.response?.public && <div className='mt-5 flex flex-col gap-1'>
										<div className='flex items-center gap-3'>
											<CiLock className='text-accent stroke-2' />
											<p className='font-bold text-sm md:text-base'>Private</p>
										</div>
										<p className='text-sm md:text-base'>Only members can see who's in the group and what they post.</p>
									</div>
								}
								{
									forum?.response?.userId._id !== user?._id && !forum?.response?.joined.includes(user?._id as string) && <div className='mt-6'>
										<button onClick={() => handleJoinForum(forum?.response?._id as string)} className='button py-2 px-8 w-max'>Join now</button>
									</div>
								}
							</div>
						}

						<div className='grid grid-cols-1 md:grid-cols-12 mt-4 w-full gap-6 md:gap-0'>
							<div className='px-0 md:px-4 py-3 col-span-1 md:col-span-4 h-max sticky md:top-0 left-0 w-full order-1 md:order-2'>
								<h3 className='text-lg md:text-xl font-bold'>About</h3>
								<p className='mt-3 text-sm md:text-base'>{forum?.response?.description}</p>
								<button type='button' onClick={() => setPostDialog(true)} className='button py-2 mt-3 h-max w-full md:w-auto'>Create Post</button>
								{
									!forum?.response?.public && <div className='mt-5 flex flex-col gap-1'>
										<div className='flex items-center gap-3'>
											<CiLock className='text-accent stroke-2' />
											<p className='font-bold text-sm md:text-base'>Private</p>
										</div>
										<p className='text-sm md:text-base'>Only members can see who's in the group and what they post.</p>
									</div>
								}
							</div>
							{forum?.response?.joined.includes(user?._id as string) && <div key={currentPage + "forum_feed_page" + forumPosts?.totalPosts} className='max-h-[60vh] md:max-h-[80vh] min-h-[60vh] md:min-h-[80vh] w-full px-0 md:px-5 overflow-y-auto scrollbar md:col-span-8 order-2 md:order-1' id="home-feed-test">
								<InfiniteScroll
									dataLength={forumPosts?.response?.length ?? 0}
									next={() => {
										loadMorePosts()
									}}
									hasMore={hasMorePost}
									loader={<h4>Loading...</h4>}
									scrollableTarget={"home-feed-test"}
									endMessage={
										<p style={{ textAlign: 'center' }}>
											<b>Yay! You have seen it all</b>
										</p>
									}
								>
									{
										forumPosts?.response?.map((forumPost: ForumPost) => {
											return <ForumPostCard forumPost={forumPost} />
										})
									}
								</InfiniteScroll>
							</div>}
						</div>
					</div>
				</div>
			</RootLayout>
		</>
	)
}

export default Forum