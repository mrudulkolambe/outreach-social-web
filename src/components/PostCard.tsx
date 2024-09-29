const PostCard = () => {
  return (
	<div className='p-4 rounded-lg w-[372px] bg-white shadow-md'>
		<img className='w-[340px] h-[260px] rounded-lg' src="https://s3-alpha-sig.figma.com/img/7877/3cb8/5b993f943e1462247f1d8f24552349c3?Expires=1719187200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Zpm3w6jgmrugjhbOP~GrMIqyLtmUIL--qq~44dLKHcY11q6O4ppy~wS3WD5czUOH02~7AJkPINQoD7WygY3vXX9oQ3c4llncgB6ETxr4kyj0UirBtkKdBU54hsadfZbwgJiemoHzmD78BT-j87r0NhxKz~pFZFZBBVdBEYuYbZJwNDFfhUPYxLeYA5W63ng7p1BkBoOGMI568PkVhKL6Zlyu0zpgE4V9NeTrIaI86shRy4vaTtnBeOTsZNxAiyHZImFFF8BJ5ogwZEUHDNOFm6phtiHvpBHfjUbdOqi7222Imt5jA9USaPPzkjjvJwWRHZI2cNgKXdUdqyCj0GIHrw__" alt="" />
		<p className='mt-3'>Empower Yourself: Take Charge of Your Health Today! #Lifestyle</p>
		<div className='mt-3 flex gap-3'>
			<span className='flex items-center gap-1'>
				<img src="/icons/like-filled.svg" alt="" />
				<p>55k</p>
			</span>
			<span className='flex items-center gap-1'>
				<img src="/icons/comment.svg" alt="" />
				<p>50</p>
			</span>
		</div>
	</div>
  )
}

export default PostCard