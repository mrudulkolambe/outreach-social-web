import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Navigation, Pagination } from 'swiper/modules';
import VideoComponent from "../Video";
import { ChevronLeft, ChevronRight, EllipsisVertical } from "lucide-react";
import { ChangeEvent, memo, ReactElement, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { GoHeart, GoComment, GoHeartFill } from "react-icons/go";
import { deletePost, getComments, likePost, postComments, updateFeedPost } from '../../service/postService';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../ui/post_dialog';
import { Dialog as DialogDefault, DialogContent as DialogContentDefault, DialogTitle as DialogTitleDefault, DialogDescription as DialogDescriptionDefault } from '../ui/post_dialog';
import moment from 'moment';
import { FaArrowUp } from "react-icons/fa6";
import { toast } from 'sonner';
import HighlighHashtags from '../HighlighHashtags';
import Avatar from "react-avatar"
import { DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger, DropdownMenu } from '../ui/dropdown-menu';
import { useAuthContext } from '@/context/Auth';
import Input from '../Input';
import Button from '../Button';
import { createReport } from '@/service/reportService';
import interestsOptions from '@/lib/interests';
import { IoClose } from 'react-icons/io5';
import { getFileType } from '@/utils/file';
import { useNavigate } from 'react-router-dom';
import { useFeedContext } from '@/context/Feed';

const Postcard = memo(({ post }: { post: Post }) => {
	const { baseUser } = useAuthContext()
	const {updatePost} = useFeedContext()
	const [isDialogOpen, setDialogOpen] = useState(false)
	const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
	const [isDeleted, setIsDeleted] = useState(false)
	const [deleteLoading, setDeleteLoading] = useState(false)
	const [comments, setComments] = useState<FeedCommentsResponse | null>(null)
	const [tempComments, setTempComments] = useState<FeedCommentsResponse | null>(null)
	const [commentsLoading, setCommentsLoading] = useState(true)
	const [postCommentLoading, setPostCommentLoading] = useState(false)
	const [reportLoading, setReportLoading] = useState(false)
	const [liked, setLiked] = useState({
		liked: post.liked,
		likeCount: post.likesCount
	})
	const reportReasons = [
		"Reason 1",
		"Reason 2",
		"Reason 3",
	]
	const [commentText, setCommentText] = useState("")
	const [reportReason, setReportReason] = useState("")
	const [reportText, setReportText] = useState("")
	const [showMore, setShowMore] = useState(false)
	const handleLike = async () => {
		let tempPost: Post = {
			_id: post._id,
			block: post.block,
			commentCount: post.commentCount,
			content: post.content,
			createdAt: post.createdAt,
			liked: !post.liked,
			likesCount: post.liked ? post.likesCount - 1 : post.likesCount + 1,
			media: post.media,
			public: post.public,
			reportsOrFlag: post.reportsOrFlag,
			tags: post.tags,
			updatedAt: post.updatedAt,
			user: post.user
		}
		setLiked({
			likeCount: tempPost.likesCount,
			liked: tempPost.liked
		})
		updatePost(tempPost);
		await likePost(post)
	}

	const fetchComments = async () => {
		const commentResponse = await getComments(post._id);
		setTempComments(commentResponse)
		setCommentsLoading(false)
	}

	const commentPost = async () => {
		setPostCommentLoading(true)
		const comment = await postComments(post._id, commentText);
		if (comment) {
			const oldComments = { ...tempComments };
			const oldCommentArray = oldComments.response;
			oldCommentArray?.push(comment.response);
			setTempComments(oldComments as FeedCommentsResponse);
			setCommentText("")
		} else {
			toast.error("Couldn't post the comment.")
		}
		setPostCommentLoading(false)
	}

	useEffect(() => {
		if (tempComments) {
			const sortedCommentsResponse = tempComments.response.sort((a, b) => b.createdAt - a.createdAt);
			setComments({ ...tempComments, response: sortedCommentsResponse });
		}
	}, [tempComments])
	const handleOpenChange = (isOpen: boolean) => {
		setIsReportDialogOpen(isOpen);
		if (!isOpen) {
			document.body.style.pointerEvents = "";
		}
	};
	const handleDeleteOpenChange = (isOpen: boolean) => {
		setIsDeleteDialogOpen(isOpen);
		if (!isOpen) {
			document.body.style.pointerEvents = "";
		}
	};

	const handleDelete = async (e: React.FormEvent) => {
		e.preventDefault()
		setDeleteLoading(true)
		await deletePost(post._id);
		setIsDeleted(true)
		setDeleteLoading(false)
		setIsDeleteDialogOpen(false)
	}

	const handleReportSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (reportText.length != 0 || reportReason.length != 0) {
			setReportLoading(true)
			const response = await createReport({
				userID: baseUser?._id ?? "",
				postId: post._id,
				text: reportText,
				reason: reportReason,
				type: "post"
			})
			if (response == 200 || response == 201) {
				toast.success("Post reported successfully");
			} else {
				toast.error("Something went wrong!, Please try again later");
			}
			setReportText("")
			setReportReason("")
			setReportLoading(false)
			setIsReportDialogOpen(false)
		} else {
			toast.error("Please fill the report form completely!");;
		}
	}

	const navigate = useNavigate()

	const postInputRef = useRef<HTMLInputElement | null>(null);
	const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
	const [postDialog, setPostDialog] = useState<{show: Boolean, data: object | null}>({show: false, data: null})
	const [isPublic, setIsPublic] = useState(true)
	const [content, setContent] = useState("")
	const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);

	const handleFileChangePost = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			const files = Array.from(event.target.files);
			const fileArray = files.map((file) => ({
				file,
				type: getFileType(file)
			}));
			setSelectedFiles((prevFiles) => prevFiles.concat(fileArray));
		}
	}

	const [hashTags, setHashTags] = useState(interestsOptions.map((interest) => interest.tag));
	const [filteredTags, setFilteredTags] = useState(hashTags);

	const removeFilePost = (index: number) => {
		setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
	};

	const renderPreviewsPost = (source: SelectedFile[]) => {
		return source.map((item, index) => {
			const fileUrl = URL.createObjectURL(item.file);
			return <div className="flex relative" key={index}>
				<button type="button" className="absolute h-5 w-5 bg-white flex items-center justify-center rounded-full top-1 right-1" onClick={() => removeFilePost(index)}><IoClose /></button>
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

	const [cursorY, setCursorY] = useState(20); // Y-position of the cursor
	const [showSuggestions, setShowSuggestions] = useState(false);

	useEffect(() => {
		setHashTags(interestsOptions.map((interest) => interest.tag))
		const handleCursorTracking = () => {
			const inputRect = postInputRef.current?.getBoundingClientRect();
			if (inputRect) {
				setCursorY(inputRect.top + inputRect.height); // Position below the input field
			}
		};

		window.addEventListener("resize", handleCursorTracking);
		window.addEventListener("scroll", handleCursorTracking);

		return () => {
			window.removeEventListener("resize", handleCursorTracking);
			window.removeEventListener("scroll", handleCursorTracking);
		};
	}, []);

	const handleInputChange = (content: string) => {
		setContent(content);

		const hashIndex = content.lastIndexOf("#");

		if (hashIndex !== -1) {
			const searchText = content.substring(hashIndex + 1);
			const filtered = hashTags.filter((tag) =>
				tag.toLowerCase().startsWith(searchText.toLowerCase())
			);
			setFilteredTags(filtered);
			setShowSuggestions(true);
		} else {
			setShowSuggestions(false);
		}
	};


	const handleTagSelection = (tag: string) => {
		const lastHashIndex = content.lastIndexOf("#");
		const newText =
			content.substring(0, lastHashIndex) + `#${tag} `; // Replace text after the last #
		setContent(newText);
		setShowSuggestions(false);
	};

	const { user } = useAuthContext()
	return (
		<>

			{postDialog.show && <div className='fixed h-screen w-screen bg-black/50 z-20 top-0 left-0 flex items-center justify-center'>
				<form className='w-[56vw] h-[65vh] bg-white rounded-xl py-5 px-8'>
					<div className='flex items-center justify-between'>
						<h1 className='text-2xl font-bold'>Share your post</h1>
						<span onClick={() => setPostDialog({ show: false, data: null })} className='h-6 w-6 rounded-md bg-accent/10 flex items-center justify-center hover:bg-accent/20 duration-100 cursor-pointer'>
							<IoClose />
						</span>
					</div>
					<div className='mt-2 flex gap-3 items-center'>
						<img className='h-[80px] w-[80px] rounded-full object-cover' src={user?.imageUrl} alt="" />
						<div>
							<h3 className='text-lg font-semibold'>{user?.name}</h3>
							<div className='flex items-center gap-3 mt-2'>
								<button onClick={() => setIsPublic(true)} type="button" className={twMerge('text-sm px-3 py-1 rounded-lg', isPublic ? "bg-accent text-white" : "text-black bg-accent/20 hover:bg-accent/10 ")}>Public</button>
								<button onClick={() => setIsPublic(false)} type="button" className={twMerge('text-sm px-3 py-1 rounded-lg', !isPublic ? "bg-accent text-white" : "text-black bg-accent/20 hover:bg-accent/10 ")}>Private</button>
							</div>
							<input ref={postInputRef} type="file" hidden multiple accept=".png,.jpg,.jpeg,.mov,.mp4" onChange={handleFileChangePost} />
						</div>
					</div>

					<div className="relative h-[55%]">
						<textarea value={content} ref={textAreaRef} onChange={(e) => handleInputChange(e.target.value)} className="bg-accent/5 px-4 py-2 rounded-lg resize-none scrollbar outline-none border-0 flex-1 mt-3 w-full h-full" placeholder="What's on your mind?"></textarea>
						{showSuggestions && (
							<div
								className="absolute left-0 right-0 z-50 w-full bg-white border border-gray-300 rounded-md shadow-lg"
								style={{
									top: `${cursorY}px`, // Dynamic positioning below the cursor
								}}
							>
								<div className="max-h-48 overflow-auto flex flex-col-reverse">
									{filteredTags.map((tag, index) => (
										<div
											key={index}
											className="px-4 py-2 cursor-pointer hover:bg-blue-100"
											onClick={() => handleTagSelection(tag)}
										>
											#{tag}
										</div>
									))}
								</div>
							</div>
						)}
					</div>
					<div className="h-24 result flex gap-2 flex-wrap">{renderPreviewsPost(selectedFiles)}</div>
					<div className="items-center flex justify-end">
						{/* <button onClick={() => postInputRef.current?.click()} type="button" className="flex items-center justify-center text-accent text-sm bg-accent/10 px-3 py-1 rounded-lg"><File className="h-3 w-3" />&nbsp; Upload Photos/Videos</button> */}
						<button onClick={async () => {
							setPostDialog({ show: false, data: null });
							const status = await updateFeedPost(post._id, {
								...postDialog.data! as object,
								content: content
							});
							if (status == 200) {
								setSelectedFiles([]);
								setContent("")
							}
							navigate(0)
						}} type="button" className="flex items-center justify-center text-white text-sm bg-accent px-6 py-2 rounded-lg">Post</button>
					</div>
				</form>
			</div>}
			{!isDeleted && <div className='px-7 flex flex-col pt-4'>
				<div className=' w-full flex items-center justify-between'>
					<div className='flex gap-4 items-center'>
						{
							!post.public ?
								<div className='h-[42px] w-[42px] bg-accent flex items-center justify-center text-center text-xl text-white rounded-full font-semibold'>A</div> :
								post.user.imageUrl ? <img src={post.user.imageUrl} className='h-[42px] w-[42px] rounded-full object-cover' /> : <Avatar name={post.user.name} size={"42"} round color='#1b57bf' />
						}
						<h4 className='font-medium'>{post.public ? post.user.name : "Anonymous"}</h4>
					</div>
					<DropdownMenu onOpenChange={(e) => {
						if (!e) {
							document.body.style.pointerEvents = "";
						}
					}}>
						<DropdownMenuTrigger><span className='h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center'><EllipsisVertical size={20} /></span></DropdownMenuTrigger>
						<DropdownMenuContent className='w-[200px]'>
							{baseUser?._id === post.user._id && <DropdownMenuItem className='text-base' onClick={() => {
								setPostDialog({show: true, data: post})
								setContent(post.content)
							}}>Edit</DropdownMenuItem>}
							{baseUser?._id === post.user._id && <DropdownMenuItem className='text-base' onClick={() => setIsDeleteDialogOpen(true)}>Delete</DropdownMenuItem>}
							{baseUser?._id !== post.user._id && <DropdownMenuItem className='text-base' onClick={() => setIsReportDialogOpen(true)}>Report</DropdownMenuItem>}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<div className='mt-3 relative' onDoubleClick={handleLike}>
					{post.media.length > 1 && <span className={twMerge("z-[5] h-6 w-6 rounded-full bg-white flex items-center justify-center absolute top-1/2 left-1 -translate-y-1/2 p-0.5 cursor-pointer", `prev_${post._id}`)}><ChevronLeft className="text-sm" /></span>}
					<Swiper
						modules={[Navigation, Pagination]}
						className='w-full'
						grabCursor
						spaceBetween={40}
						pagination
						navigation={
							{
								nextEl: `.next_${post._id}`,
								prevEl: `.prev_${post._id}`
							}
						}
						slidesPerView={1}
					>
						{
							post.media.map((media) => {
								return <SwiperSlide key={media.url}>
									{
										media.type == "video" ? <VideoComponent isPopup={false} videoUrl={media.url} /> : <img className='rounded-xl w-full h-[402px] object-cover' src={media.url} alt="" />
									}
								</SwiperSlide>
							})
						}
					</Swiper>
					{post.media.length > 1 && <span className={twMerge("z-[5] h-6 w-6 rounded-full bg-white flex items-center justify-center absolute top-1/2 right-1 -translate-y-1/2 p-0.5 cursor-pointer", `next_${post._id}`)}><ChevronRight /></span>}
				</div>
				<div className='mt-3 flex flex-col gap-3 border-b pb-4'>
					<p className='text-lg whitespace-pre-wrap' >{post.content.length > 100 && showMore ? <HighlighHashtags text={post.content} /> : `${post.content.slice(0, 100)}...`}</p>
					{post.content.length > 100 && <p className='text-accent cursor-pointer' onClick={() => setShowMore(!showMore)}>{showMore ? "Show less" : "Show More"}</p>}
					<div className='flex gap-3' key={`${post._id} ${liked.liked} ${liked.likeCount}`}>
						<span className='flex gap-1 items-center text-lg'>{liked.liked ? <GoHeartFill onClick={handleLike} className='fill-red-600 text-gray-500 text-2xl' /> : <GoHeart onClick={handleLike} className='text-gray-500 text-2xl' />} {liked.likeCount}</span>
						<Dialog onOpenChange={(e) => {
							setDialogOpen(e)
							if (e) {
								fetchComments()
							}
						}} open={isDialogOpen}><DialogTrigger>
								<span className='flex gap-1 items-center text-lg'><GoComment className='text-gray-500 text-2xl' /> {post.commentCount}</span>
							</DialogTrigger>
							<DialogTitle className='hidden'>POST by {post.user.username}</DialogTitle>
							<DialogContent className="border-0 flex w-[80vw] h-[90vh] p-0 gap-0 overflow-hidden">
								<div className='w-3/5 h-full'>
									<div className='relative h-full' onDoubleClick={handleLike}>
										{post.media.length > 1 && <span className={twMerge("z-[5] h-6 w-6 rounded-full bg-white flex items-center justify-center absolute top-1/2 left-1 -translate-y-1/2 p-0.5 cursor-pointer", `prev_${post._id}`)}><ChevronLeft className="text-sm" /></span>}
										<Swiper
											modules={[Navigation, Pagination]}
											className='w-full h-full'
											grabCursor
											spaceBetween={40}
											pagination
											navigation={
												{
													nextEl: `.next_${post._id}`,
													prevEl: `.prev_${post._id}`
												}
											}
											slidesPerView={1}
										>
											{
												post.media.map((media) => {
													return <SwiperSlide key={media.url} className='h-full'>
														{
															media.type == "video" ? <VideoComponent isPopup={true} videoUrl={media.url} /> : <img className={'w-full h-full object-cover'} src={media.url} alt="" />
														}
													</SwiperSlide>
												})
											}
										</Swiper>
										{post.media.length > 1 && <span className={twMerge("z-[5] h-6 w-6 rounded-full bg-white flex items-center justify-center absolute top-1/2 right-1 -translate-y-1/2 p-0.5 cursor-pointer", `next_${post._id}`)}><ChevronRight /></span>}
									</div>
								</div>
								<div className='w-2/5 h-[90vh] flex flex-col'>
									<div className='flex items-center w-full h-16 px-4 border-b border-black/10'>
										<div className='flex gap-2 items-center'>
											{post.user.imageUrl ? <img src={post.user.imageUrl} className='h-10 w-10 rounded-full' alt="" /> : <Avatar name={post.user.name} round size='40' color='#1b57bf' />}
											<h2 className='font-semibold text-black text-lg'>@{post.user.username}</h2>
										</div>
									</div>
									<div className='px-4 py-3 flex-1 w-full gap-y-4 flex-col flex overflow-auto scrollbar'>
										<ContentDisplay user={post.user} text={post.content} timestamp={post.createdAt} comments={[]} />
										{
											commentsLoading ? <p className='text-sm'>Loading...</p> : comments?.response?.filter((comment: FeedComment) => {
												return comment.parentID == null || comment.parentID == undefined || comment.parentID == ""
											}).map((comment: FeedComment) => {
												return <ContentDisplay text={comment.text} timestamp={comment.createdAt} user={comment.author} comments={comments.response.filter((nestedComment) => {
													return nestedComment.parentID === comment._id;
												})} />
											})
										}
									</div>
									<div className=' pt-3 h-32 w-full border-t-2 border-black/20 flex flex-col justify-between'>
										<div className='flex flex-col'>
											<span onClick={handleLike} className='px-6 scale-105 cursor-pointer flex gap-1 items-center'>{liked.liked ? <GoHeartFill className='fill-red-600 text-gray-500 text-2xl' /> : <GoHeart className='text-gray-500 text-2xl' />} {liked.likeCount} likes</span>
											<p className='px-6 text-xs font-semibold mt-2'>{moment(post.createdAt).fromNow()}</p>
										</div>
										<div className='pr-3 items-center mt-3 border-t-2 border-black/20 flex-1 flex relative'>
											<input onChange={(e) => setCommentText(e.target.value)} value={commentText} type="text" className='flex-1 h-full input rounded-none border-0' placeholder='Comment here...' />
											<button onClick={commentPost} disabled={postCommentLoading} className='disabled:bg-accent/50 bg-accent max-h-10 h-10 w-10 max-w-10 aspect-square rounded-full flex items-center justify-center text-white'><FaArrowUp className='text-white' /></button>
										</div>
									</div>
								</div>
							</DialogContent>
						</Dialog>
					</div>
				</div>
			</div >}

			<DialogDefault onOpenChange={handleOpenChange} open={isReportDialogOpen}>
				<DialogContentDefault className='w-[30vw]'>
					<DialogTitleDefault className='text-black text-xl font-bold'>Report Post</DialogTitleDefault>
					<DialogDescriptionDefault >Are you sure you want to report the post?</DialogDescriptionDefault>
					<form onSubmit={handleReportSubmit}>
						<div className='flex flex-wrap gap-x-4 gap-y-3 mb-3'>
							{
								reportReasons.map((reason) => {
									return <div onClick={() => setReportReason(reason)} key={reason} className={twMerge('px-4 py-2 bg-accent/90 hover:bg-accent duration-150 text-white rounded-lg cursor-pointer', reason === reportReason ? "bg-accent" : "bg-accent/70")}>{reason}</div>
								})
							}
						</div>
						<Input textarea={true} id='report' onChange={(e) => setReportText(e.target.value)} placeholder='Message' type='text' value={reportText} />
						<Button text='Submit' disabled={reportLoading} className='' loading={reportLoading} type='submit' />
					</form>
				</DialogContentDefault>
			</DialogDefault>

			<DialogDefault onOpenChange={handleDeleteOpenChange} open={isDeleteDialogOpen}>
				<DialogContentDefault className='w-[30vw]'>
					<DialogTitleDefault className='text-black text-xl font-bold'>Delete Post</DialogTitleDefault>
					<DialogDescriptionDefault >Are you sure you want to delete the post?</DialogDescriptionDefault>
					<form onSubmit={handleDelete} className='grid grid-cols-2 items-center gap-x-4 justify-between'>
						<button onClick={() => setIsDeleteDialogOpen(false)} type='button' className='text-accent border-accent button bg-transparent border-2'>
							Cancel
						</button>
						<Button text='Proceed' disabled={deleteLoading} className='border-2 border-accent disabled:border-accent/50' loading={deleteLoading} type='submit' />
					</form>
				</DialogContentDefault>
			</DialogDefault>
		</>
	)
})

export default Postcard

const ContentDisplay = ({ user, text, timestamp, comments }: { user: MainUser, text: string, timestamp: string | number, comments: FeedComment[] }) => {
	let feedComments = comments.map((comment) => {
		return <DisplayComment user={comment.author} text={comment.text} timestamp={comment.createdAt} comments={null} />
	})
	console.log("COMMENT", feedComments)
	return <div className='flex flex-col'>
		<DisplayComment text={text} timestamp={timestamp} user={user} comments={feedComments} />
	</div>
}

const DisplayComment = ({ user, text, timestamp, comments }: { user: MainUser, text: string, timestamp: string | number, comments: ReactElement[] | null }) => {
	const [show, setShow] = useState(false)
	return <div className='w-full flex gap-3 items-start'>
		<img src={user.imageUrl} className='h-10 w-10 rounded-full' alt="" />
		<div className='flex flex-col'>
			<div className='inline-block text-sm'>
				<b className='inline-flex mr-1 font-extrabold '>@{user.username}</b>
				<p className='whitespace-pre-wrap flex-1 inline-flex font-medium' dangerouslySetInnerHTML={{ __html: text }}></p>
			</div>
			<div className='flex gap-x-3'>
				<p className='text-xs font-semibold mt-2'>{moment(timestamp).fromNow()}</p>
				{comments?.length != 0 && <p onClick={() => setShow(!show)} className='text-xs font-semibold mt-2 cursor-pointer'>{show ? "Hide Comments" : "Show Comments"}</p>}
			</div>
			{show && <div className='flex flex-col gap-3 mt-3'>
				{comments}
			</div>}
		</div>
	</div>
}