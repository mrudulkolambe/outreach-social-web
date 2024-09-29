import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Navigation, Pagination } from 'swiper/modules';
import VideoComponent from "../Video";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { GoHeart, GoComment, GoHeartFill } from "react-icons/go";
import { getComments, likePost, postComments } from '../../service/postService';
import { useFeedContext } from '../../context/Feed';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../ui/post_dialog';
import moment from 'moment';
import { FaArrowUp } from "react-icons/fa6";
import { toast } from 'sonner';

const Postcard = memo(({ post }: { post: Post }) => {
	const { updatePost } = useFeedContext();
	const [isDialogOpen, setDialogOpen] = useState(false)
	const [comments, setComments] = useState<FeedCommentsResponse | null>(null)
	const [tempComments, setTempComments] = useState<FeedCommentsResponse | null>(null)
	const [commentsLoading, setCommentsLoading] = useState(true)
	const [postCommentLoading,  setPostCommentLoading] = useState(false)
	const [liked, setLiked] = useState({
		liked: post.liked,
		likeCount: post.likesCount
	})
	const [commentText, setCommentText] = useState("")

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
		const commentResponse = await getComments(post);
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
		}else{
			toast.error("Couldn't post the comment.")
		}
		setPostCommentLoading(false)
	}

	useEffect(() => {
		if (tempComments) {
			const sortedCommentsResponse = tempComments.response.sort((a, b) => b.createdAt - a.createdAt);
			setComments({...tempComments, response: sortedCommentsResponse});
		}
	}, [tempComments])

	return (
		<Dialog onOpenChange={(e) => {
			setDialogOpen(e)
			if (e) {
				fetchComments()
			}
		}} open={isDialogOpen}>
			<div className='px-7 flex flex-col pt-4'>
				<div className='flex gap-4 items-center'>
					{
						!post.public ?
							<div className='h-[42px] w-[42px] bg-accent flex items-center justify-center text-center text-xl text-white rounded-full font-semibold'>A</div> :
							<img src={post.user.imageUrl} className='h-[42px] w-[42px] rounded-full object-cover' />
					}
					<h4 className='font-medium'>{post.public ? post.user.name : "Anonymous"}</h4>
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
					<p className='text-lg' dangerouslySetInnerHTML={{ __html: post.content }}></p>
					<div className='flex gap-3' key={`${post._id} ${liked.liked} ${liked.likeCount}`}>
						<span className='flex gap-1 items-center text-lg'>{liked.liked ? <GoHeartFill onClick={handleLike} className='fill-red-600 text-gray-500 text-2xl' /> : <GoHeart onClick={handleLike} className='text-gray-500 text-2xl' />} {liked.likeCount}</span>
						<DialogTrigger>
							<span className='flex gap-1 items-center text-lg'><GoComment className='text-gray-500 text-2xl' /> {post.commentCount}</span>
						</DialogTrigger>
					</div>
				</div>
			</div >
			<DialogTitle className='hidden'>POST by {post.user.username}</DialogTitle>
			<DialogContent className="border-0 flex w-[80vw] h-[90vh] p-0 gap-0 overflow-hidden">
				<div className='w-3/5 h-full bg-green-500'>
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
							<img src={post.user.imageUrl} className='h-10 w-10 rounded-full' alt="" />
							<h2 className='font-semibold text-black text-lg'>@{post.user.username}</h2>
						</div>
					</div>
					<div className='px-4 py-3 flex-1 w-full gap-y-4 flex-col flex overflow-auto scrollbar'>
						<ContentDisplay user={post.user} text={post.content} timestamp={post.createdAt} />
						{
							commentsLoading ? <p className='text-sm'>Loading...</p> : comments?.response.map((comment: FeedComment) => {
								return <ContentDisplay text={comment.text} timestamp={comment.createdAt} user={comment.author} />
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
		</Dialog >
	)
})

export default Postcard

const ContentDisplay = ({ user, text, timestamp }: { user: MainUser, text: string, timestamp: string | number }) => {
	return <div className='w-full flex gap-3 items-start'>
		<img src={user.imageUrl} className='h-10 w-10 rounded-full' alt="" />
		<div className='flex flex-col'>
			<div className='inline-block text-sm'>
				<b className='inline-flex mr-1 font-extrabold '>@{user.username}</b>
				<p className='whitespace-pre-line flex-1 inline-flex font-medium' dangerouslySetInnerHTML={{ __html: text }}></p>
			</div>
			<p className='text-xs font-semibold mt-2'>{moment(timestamp).fromNow()}</p>
		</div>
	</div>
}