import Topbar from '@/components/Topbar'
import RootLayout from '../layout'
import { twMerge } from 'tailwind-merge'
import { useForumContext } from '@/context/Forum'
import { useAuthContext } from '@/context/Auth'
import { Link } from 'react-router-dom'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/forum_dialog'
import { useEffect, useRef, useState } from 'react'
import interestsOptions from '@/lib/interests'
import { SearchableDropdown } from '@/components/ui/searchable_dropdown'
import { createForum } from '@/service/forumService'
import Spinner from '@/components/spinner'
import { Upload } from 'lucide-react'
import { uploadSingleFile } from '@/service/uploadService'

const ForumHome = () => {
	const { forums } = useForumContext()
	const { user } = useAuthContext()
	const [isPublic, setIsPublic] = useState(true)
	const [loading, setLoading] = useState(true)
	const [name, setName] = useState("")
	const [desc, setDesc] = useState("")
	const [category, setCategory] = useState<string>(interestsOptions[0].interest)
	const [createForumLoading, setCreateForumLoading] = useState(false)
	const [openCreateDialog, setOpenCreateDialog] = useState(false)

	useEffect(() => {

		setTimeout(() => {
			setLoading(false)
		}, 4000);
	}, [])


	const [forumImage, setForumImage] = useState<File | null>(null);
	const handleCreateForum = async () => {
		if (forumImage) {
			setCreateForumLoading(true)
			const forumImageURL = await uploadSingleFile({
				file: forumImage,
				type: 'jpeg'
			}, `forum/${Date.now() + Math.random() * 1234234}`)
			console.log(forumImageURL)
			const obj = {
				'public': isPublic,
				'name': name,
				'category': category,
				'description': desc,
				'image': forumImageURL?.media.url
			}
			await createForum(obj)
			setCreateForumLoading(false)
			setOpenCreateDialog(false)
		}
	}

	const handleImageChange = (img: File) => {
		if (img) {
			const imageUrl = URL.createObjectURL(img);
			return imageUrl
		}
	};
	const forumImageRef = useRef<HTMLInputElement | null>(null);
	return (
		<RootLayout loading={loading}>
			<div className='flex flex-col h-screen max-h-screen'>
				<Topbar />
				<div className='flex flex-col items-start w-full bg-accent/5 primary-height overflow-hidden'>
					{/* Create Forum Button - Always visible */}
					<div className='w-full flex justify-end p-3 sm:p-4 lg:px-10 lg:pt-10'>
						<Dialog onOpenChange={(e) => setOpenCreateDialog(e)} open={openCreateDialog}>
							<DialogTrigger asChild>
								<button className='button py-2 px-4 w-max h-max'>New Forum</button>
							</DialogTrigger>
							<DialogContent className="w-[95vw] sm:w-[80vw] lg:w-[50vw] max-h-[90vh] overflow-y-auto">
								<DialogHeader>
									<DialogTitle className='text-xl sm:text-2xl font-bold text-black'>Create Forum</DialogTitle>
								</DialogHeader>
								<div className="grid gap-4 py-4">
									<div onClick={() => forumImageRef.current?.click()} className="flex justify-center sm:justify-start">
										<div className='cursor-pointer h-16 w-16 sm:h-20 sm:w-20 flex items-center justify-center rounded-full overflow-hidden bg-gray-100 border'>
											{forumImage ? <img src={handleImageChange(forumImage)} className='h-full w-full object-cover' alt="Forum preview" /> : <Upload className="h-6 w-6 sm:h-8 sm:w-8" />}
										</div>
										<input ref={forumImageRef} onChange={(e) => {
											if (e.target.files) {
												setForumImage(e.target.files[0])
											}
										}} type='file' className='hidden' accept=".png,.jpg,.jpeg" />
									</div>
									<div className='flex flex-col gap-1'>
										<label htmlFor="name" className="text-sm sm:text-base">Forum name: </label>
										<input onChange={(e) => setName(e.target.value)} value={name} className='input' id='name' />
									</div>
									<div className='flex flex-col gap-1'>
										<label className="text-sm sm:text-base">Forum type: </label>
										<div className='w-max flex gap-3'>
											<button onClick={() => setIsPublic(true)} className={twMerge('button px-3 py-1 text-sm w-max', isPublic ? "" : "bg-gray-400 text-white")}>Public</button>
											<button onClick={() => setIsPublic(false)} className={twMerge('button px-3 py-1 text-sm w-max', !isPublic ? "" : "bg-gray-400 text-white")}>Private</button>
										</div>
									</div>
									<div className='flex flex-col w-full gap-1'>
										<label className="text-sm sm:text-base">Category: </label>
										<SearchableDropdown interests={interestsOptions} setCategory={setCategory} category={category} />
									</div>
									<div className='flex flex-col w-full gap-1'>
										<label htmlFor='desc' className="text-sm sm:text-base">Description: </label>
										<textarea onChange={(e) => setDesc(e.target.value)} value={desc} id="desc" className='input h-24 sm:h-32 resize-none'></textarea>
									</div>
									<button onClick={handleCreateForum} className='button py-2 sm:py-3 mt-2 h-max'>{createForumLoading ? <Spinner /> : "Create"}</button>
								</div>
							</DialogContent>
						</Dialog>
					</div>

					{/* Main Scrollable Content */}
					<div className='w-full flex-1 overflow-y-auto scrollbar px-3 sm:px-4 lg:px-10 pb-3 sm:pb-4 lg:pb-10'>
						<div className='flex flex-col lg:flex-row lg:gap-6'>
							{/* Explore Forums Section - 9/12 width on desktop */}
							<div className='w-full lg:w-9/12 order-2 lg:order-1'>
								<h2 className='text-xl sm:text-2xl font-bold mb-3 text-black'>Explore new forums</h2>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									{forums
										.filter((forum: Forum) => !forum.joined.includes(user?._id as string) && forum.userId._id != user?._id)
										.map((forum: Forum) => (
											<div key={forum._id} className='bg-white rounded-lg p-3 shadow-lg flex flex-col'>
												<Link to={`/forum/${forum._id}`} className='block aspect-video mb-3'>
													<img 
														src={forum.image} 
														className='h-full w-full object-cover rounded-md aspect-square' 
														alt={forum.name} 
													/>
												</Link>
												<h3 className='text-base sm:text-lg font-semibold mb-2'>{forum.name}</h3>
												<div className='flex items-center justify-between mb-2'>
													<p className='text-sm text-gray-500 font-semibold'>Created by</p>
													<div className='flex gap-1 items-center'>
														<img src={forum.userId.imageUrl} className='h-5 w-5 sm:h-6 sm:w-6 rounded-full' alt="" />
														<p className='text-sm font-semibold'>@{forum.userId.username}</p>
													</div>
												</div>
												<div className='flex items-center justify-between mb-3'>
													<p className='text-sm'>{forum.joined.length} joined</p>
													<span className='flex items-center'>
														<img className="-mr-1 border-white h-5 w-5 rounded-full border-2" src={forum.userId.imageUrl} alt="" />
														<img className="-mr-1 border-white h-5 w-5 rounded-full border-2" src={forum.userId.imageUrl} alt="" />
														<img className="border-white h-5 w-5 rounded-full border-2" src={forum.userId.imageUrl} alt="" />
													</span>
												</div>
												<button className='button py-2 mt-auto'>Join now</button>
											</div>
										))
									}
								</div>
							</div>

							{/* Joined Forums Section - 3/12 width on desktop */}
							<div className='w-full lg:w-3/12 order-1 lg:order-2 mb-4 lg:mb-0'>
								<div className='bg-white rounded-lg shadow-lg p-3 sm:p-4'>
									<h3 className='text-lg sm:text-xl font-bold mb-3 text-black'>Joined forums</h3>
									<div className='flex flex-col gap-3'>
										{forums
											.filter((forum: Forum) => forum.joined.includes(user?._id as string) || forum.userId._id === user?._id)
											.map((forum: Forum) => (
												<Link 
													key={forum._id}
													to={`/forum/${forum._id}`} 
													className='w-full bg-accent/5 rounded-lg p-2 hover:bg-accent/10 transition-colors'
												>
													<div className='flex gap-2 items-center'>
														<img src={forum.image} className='h-10 w-10 rounded-full object-cover' alt="" />
														<div className='flex-1 min-w-0'>
															<h4 className='font-bold truncate'>{forum.name}</h4>
															<p className='text-xs sm:text-sm font-semibold text-gray-500'>{forum.joined.length} members</p>
														</div>
													</div>
												</Link>
											))
										}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</RootLayout>
	)
}

export default ForumHome
