import Topbar from '@/components/Topbar'
import RootLayout from '../layout'
import { twMerge } from 'tailwind-merge'
import { useForumContext } from '@/context/Forum'
import { useAuthContext } from '@/context/Auth'
import { Link } from 'react-router-dom'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/forum_dialog'
import { useEffect, useState } from 'react'
import interestsOptions from '@/lib/interests'
import { SearchableDropdown } from '@/components/ui/searchable_dropdown'
import { createForum } from '@/service/forumService'
import Spinner from '@/components/spinner'

const ForumHome = () => {
	const { forums } = useForumContext()
	const { user } = useAuthContext()
	const [isPublic, setIsPublic] = useState(true)
	const [loading, setLoading] = useState(true)
	const [name, setName] = useState("")
	const [desc, setDesc] = useState("")
	const [category, setCategory] = useState<string>(interestsOptions[0].interest)
	const [createForumLoading, setCreateForumLoading] = useState(false)


	useEffect(() => {

		setTimeout(() => {
			setLoading(false)
		}, 4000);
	}, [])


	const handleCreateForum = async () => {
		setCreateForumLoading(true)
		const obj = {
			'public': isPublic,
			'name': name,
			'category': category,
			'description': desc,
			'image': "https://outreachapps3bucket.s3.ap-south-1.amazonaws.com/forum/NKQP9Cv7uCRyJTpu4uUDio4oy2l2/c0e38ce9-55d8-4985-b7d2-ee6abb15cb08-Internet_20240704_101545_6.jpeg"
		}
		await createForum(obj)
		setCreateForumLoading(false)
	}
	return (
		<RootLayout loading={loading}>
			<div className='flex flex-col h-screen max-h-screen'>
				<Topbar />
				<div className='flex flex-col items-start py-3 px-10 w-full bg-accent/5 primary-height overflow-hidden'>
					<div className='w-full grid grid-cols-12 gap-x-6 flex-1'>
						<div className='col-span-9 flex flex-col'>
							<h2 className='page-heading mb-5'>Explore new forum</h2>
							<div className='gap-x-3 w-full grid grid-cols-2 overflow-auto max-h-[83vh] scrollbar pb-3'>
								{
									forums.filter((forum: Forum) => !forum.joined.includes(user?._id as string) && forum.userId._id != user?._id).map((forum: Forum) => {
										return (
											<div key={forum._id} className='h-max p-3 bg-white rounded-lg mb-3 shadow-lg'>
												<Link to={`/forum/${forum._id}`}><img src={forum.image} className='h-48 w-full object-cover rounded-md' alt={forum.name} /></Link>
												<h3 className='text-lg font-semibold mt-2'>{forum.name}</h3>
												<div className='flex items-center justify-between'>
													<p className='text-gray-500 font-semibold'>Created by</p>
													<div className='flex gap-1 items-center justify-center'>
														<img src={forum.userId.imageUrl} className='h-6 w-6 rounded-full' alt="" />
														<p className='font-semibold'>@{forum.userId.username}</p>
													</div>
												</div>
												<div className='flex items-center justify-between'>
													<p>{forum.joined.length} joined</p>
													<span className='flex items-center'>
														<img className="-mr-1 border-white h-5 w-5 rounded-full border-2" src={forum.userId.imageUrl} alt="" />
														<img className="-mr-1 border-white h-5 w-5 rounded-full border-2" src={forum.userId.imageUrl} alt="" />
														<img className=" border-white h-5 w-5 rounded-full border-2" src={forum.userId.imageUrl} alt="" />
													</span>
												</div>
												<div>
													<button className='button py-2 mt-3 h-max'>Join now</button>
												</div>
											</div>
										)
									})
								}
							</div>
						</div>
						<div className='flex-1 flex flex-col col-span-3 items-end'>
							<Dialog>
								<DialogTrigger asChild>
									<button className={twMerge('button w-max h-max', "py-2")}>New Forum</button>
								</DialogTrigger>
								<DialogContent className="w-[50vw]">
									<DialogHeader>
										<DialogTitle className='text-2xl font-bold'>Create Forum</DialogTitle>
									</DialogHeader>
									<div className="grid gap-4 py-4">
										<div className='flex flex-col gap-1'>
											<label htmlFor="name">Forum name: </label>
											<input onChange={(e) => setName(e.target.value)} value={name} className='input' id='name' />
										</div>
										<div className='flex flex-col gap-1'>
											<label>Forum type: </label>
											<div className='w-max flex gap-3'>
												<button onClick={() => setIsPublic(true)} className={twMerge('button px-3 py-1 text-sm w-max', isPublic ? "" : "bg-gray-400 text-white")}>Public</button>
												<button onClick={() => setIsPublic(false)} className={twMerge('button px-3 py-1 text-sm w-max', !isPublic ? "" : "bg-gray-400 text-white")}>Private</button>
											</div>
										</div>
										<div className='flex flex-col w-full overflow-x-auto scrollbar overflow-y-hidden gap-1'>
											<label>Category: </label>
											<SearchableDropdown interests={interestsOptions} setCategory={setCategory} category={category} />
										</div>
										<div className='flex flex-col w-full overflow-x-auto scrollbar overflow-y-hidden gap-1'>
											<label htmlFor='desc'>Description: </label>
											<textarea onChange={(e) => setDesc(e.target.value)} value={desc} name="" id="desc" className='input h-32 resize-none'></textarea>
										</div>
										<button onClick={handleCreateForum} className='button py-3 mt-3 h-max'>{createForumLoading ? <Spinner /> : "Create"}</button>
									</div>
								</DialogContent>
							</Dialog>
							<div className='shadow-lg px-5 w-full mt-3 flex flex-col flex-1 max-h-[83vh] bg-white overflow-auto scrollbar gap-3 py-3 rounded-lg'>
								<h3 className='text-xl font-bold mb-1'>List of joined forums</h3>
								{
									forums.filter((forum: Forum) => forum.joined.includes(user?._id as string) || forum.userId._id === user?._id).map((forum: Forum) => {
										return (
											<>
												<Link to={`/forum/${forum._id}`} className='w-full gap-3 flex'>
													<img src={forum.image} className='h-12 w-12 rounded-full' alt="" />
													<div>
														<h4 className='font-bold'>{forum.name}</h4>
														<p className='text-sm font-semibold text-gray-500'>{forum.joined.length} members</p>
													</div>
												</Link>
											</>
										)
									})
								}
							</div>
						</div>
					</div>
				</div>
			</div>
		</RootLayout>
	)
}

export default ForumHome
