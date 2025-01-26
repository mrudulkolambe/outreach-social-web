import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Navigation, Pagination } from 'swiper/modules';
import VideoComponent from "../Video";
import { ChevronLeft, ChevronRight, EllipsisVertical } from "lucide-react";
import { memo, ReactElement, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { GoHeart, GoComment, GoHeartFill } from "react-icons/go";
import { deletePost, getComments, likePost, postComments } from '../../service/postService';
import { useFeedContext } from '../../context/Feed';
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

const Postcard = memo(({ post }: { post: Post }) => {
	const { baseUser } = useAuthContext()
	const { updatePost } = useFeedContext();
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
		}else{
			toast.error("Please fill the report form completely!");;
		}
	}
	return (
		<>
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
							{baseUser?._id === post.user._id && <DropdownMenuItem className='text-base'>Edit</DropdownMenuItem>}
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