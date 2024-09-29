import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Navigation, Pagination } from 'swiper/modules';
import VideoComponent from "../Video";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { memo } from "react";
import { twMerge } from "tailwind-merge";
import { GoHeart, GoComment, GoHeartFill  } from "react-icons/go";
// import { likePost } from '../../service/postService';
// import { useFeedContext } from '../../context/Feed';

const ForumPostCard = memo(({ post }: { post: ForumPost }) => {
	// const { updatePost } = useFeedContext();
	// const handleLike = async () => {
	// 	let tempPost: Post = {
	// 		_id: post._id,
	// 		block: post.block,
	// 		commentCount: post.commentCount,
	// 		content: post.content,
	// 		createdAt: post.createdAt,
	// 		liked: !post.liked,
	// 		likesCount: post.liked ? post.likesCount - 1 : post.likesCount + 1,
	// 		media: post.media,
	// 		public: post.public,
	// 		reportsOrFlag: post.reportsOrFlag,
	// 		tags: post.tags,
	// 		updatedAt: post.updatedAt,
	// 		user: post.user
	// 	}
	// 	updatePost(tempPost);
	// 	await likePost(post)
	// }
	return (
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
					<span className='flex gap-1 items-center text-lg'>{post.liked ? <GoHeartFill onClick={() => {}} className='fill-red-600 text-gray-500 text-2xl' /> : <GoHeart onClick={() => {}} className='text-gray-500 text-2xl' />} {post.likesCount}</span>
					<span className='flex gap-1 items-center text-lg'><GoComment className='text-gray-500 text-2xl' /> {post.commentCount}</span>
				</div>
			</div>
		</div >
	)
})

export default ForumPostCard