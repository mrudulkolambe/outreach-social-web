import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Navigation, Pagination } from 'swiper/modules';
import VideoComponent from "../Video";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { memo, ReactElement, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { GoHeart, GoComment, GoHeartFill } from "react-icons/go";
import { getComments, likePost, postComments } from '@/service/forumService';
import { Dialog, DialogContent, DialogTrigger } from '../ui/post_dialog';
import moment from 'moment';
import { toast } from 'sonner';
import { FaArrowUp } from 'react-icons/fa6';

const ForumPostCard = memo(({ forumPost }: { forumPost: ForumPost }) => {
	const [post, setPost] = useState(forumPost)
	const handleLike = async () => {
		let tempPost: ForumPost = {
			_id: post._id,
			commentCount: post.commentCount,
			content: post.content,
			createdAt: post.createdAt,
			liked: !post.liked,
			likesCount: post.liked ? post.likesCount - 1 : post.likesCount + 1,
			media: post.media,
			public: post.public,
			user: post.user
		}
		setPost(tempPost)
		await likePost(post);
	}
	const [commentText, setCommentText] = useState("")
	const [showMore, setShowMore] = useState(false)
	const [comments, setComments] = useState<ForumFeedCommentsResponse | null>(null)
	const [tempComments, setTempComments] = useState<ForumFeedCommentsResponse | null>(null)
	const [commentsLoading, setCommentsLoading] = useState(true)
	const [postCommentLoading, setPostCommentLoading] = useState(false)
	const fetchComments = async () => {
		const commentResponse = await getComments(post);
		if (commentResponse) {
			setTempComments(commentResponse as ForumFeedCommentsResponse)
		}
		setCommentsLoading(false)
	}

	const commentPost = async () => {
		setPostCommentLoading(true)
		const comment = await postComments(post._id, commentText);
		if (comment) {
			const oldComments = { ...tempComments };
			const oldCommentArray = oldComments.response?.comments;
			oldCommentArray?.push(comment.response as ForumFeedComment);
			setTempComments(oldComments as ForumFeedCommentsResponse);
			setCommentText("")
		} else {
			toast.error("Couldn't post the comment.")
		}
		setPostCommentLoading(false)
	}

	useEffect(() => {
		if (tempComments) {
			console.log(tempComments)
			const sortedCommentsResponse = tempComments.response.comments.sort((a, b) => b.createdAt - a.createdAt);
			setComments({
				...tempComments, response: {
					comments: sortedCommentsResponse
				}
			});
		}
	}, [tempComments])
	return (
		<>
			<Dialog>
				<div className='px-7 flex flex-col pt-4'>
					<div className='flex gap-4 items-center'>
						{
							!post.public ?
								<div className='h-[42px] w-[42px] bg-accent flex items-center justify-center text-center text-xl text-white rounded-full font-semibold'>A</div> :
								<img src={post.user.imageUrl} className='h-[42px] w-[42px] rounded-full object-cover' />
						}
						<h4 className='font-medium'>{post.public ? post.user.name : "Anonymous"}</h4>
					</div>
					<div className='mt-3 relative'>
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
									if (media.type == "video") {
										return <SwiperSlide key={media.url}>
											<VideoComponent isPopup={false} videoUrl={media.url} />
										</SwiperSlide>
									} else {
										return <SwiperSlide key={media.url}><img className='rounded-xl w-full h-[402px] object-cover' src={media.url} alt="" /></SwiperSlide>
									}
								})
							}
						</Swiper>
						{post.media.length > 1 && <span className={twMerge("z-[5] h-6 w-6 rounded-full bg-white flex items-center justify-center absolute top-1/2 right-1 -translate-y-1/2 p-0.5 cursor-pointer", `next_${post._id}`)}><ChevronRight /></span>}
					</div>
					<div className='mt-3 flex flex-col gap-3 border-b pb-4'>
						<p className='text-lg' dangerouslySetInnerHTML={{ __html: post.content }}></p>
						<div className='flex gap-3'>
							<span className='flex gap-1 items-center text-lg'>{post.liked ? <GoHeartFill onClick={() => handleLike()} className='fill-red-600 text-gray-500 text-2xl' /> : <GoHeart onClick={() => handleLike()} className='text-gray-500 text-2xl' />} {post.likesCount}</span>
							<DialogTrigger asChild onClick={() => fetchComments()}>
								<span className='flex gap-1 items-center text-lg'><GoComment className='text-gray-500 text-2xl' />{post.commentCount}</span>
							</DialogTrigger>
						</div>
					</div>
				</div >

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
							<ContentDisplay user={post.user} text={post.content} timestamp={post.createdAt} comments={[]} />
							{
								commentsLoading ? <p className='text-sm'>Loading...</p> : comments?.response.comments?.filter((comment: FeedComment) => {
									return comment.parentID == null || comment.parentID == undefined || comment.parentID == ""
								}).map((comment: FeedComment) => {
									return <ContentDisplay text={comment.text} timestamp={comment.createdAt} user={comment.author} comments={comments.response.comments.filter((nestedComment) => {
										return nestedComment.parentID === comment._id;
									})} />
								})
							}
						</div>
						<div className=' pt-3 h-32 w-full border-t-2 border-black/20 flex flex-col justify-between'>
							<div className='flex flex-col'>
								<span onClick={handleLike} className='px-6 scale-105 cursor-pointer flex gap-1 items-center'>{post.liked ? <GoHeartFill className='fill-red-600 text-gray-500 text-2xl' /> : <GoHeart className='text-gray-500 text-2xl' />} {post.likesCount} likes</span>
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
		</>
	)
})

export default ForumPostCard


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