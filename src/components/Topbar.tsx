import { useAuthContext } from '@/context/Auth'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'
import Input from './Input'
// import { ConversationList } from 'chatuim2'

const Topbar = () => {
	const { user } = useAuthContext()
	const [search, setSearch] = useState("")
	return (
		<div className='border-b h-[80px] w-full flex items-center justify-end px-9 gap-5'>
			<input id='search' onChange={(e) => setSearch(e.currentTarget.value)} placeholder='Search...' type='text' value={search} className='px-4 py-2 bg-black/10 rounded-lg' />
			<Sheet>
				<SheetTrigger>
					<IoChatbubbleEllipsesOutline className='h-6 w-6 cursor-pointer' />
				</SheetTrigger>
				<SheetContent className='px-0'>
					<SheetHeader>
						{/* <SheetTitle className='text-2xl'>Chat</SheetTitle> */}
						<div className='flex flex-col gap-2 border-black/20 py-4'>
							{/* <Input id='search' placeholder='Search...' onChange={() => { }} value='' type='text' disabled={false} /> */}
							{/* <ConversationList style={{
								background: "red"
							}}/> */}
						</div>
					</SheetHeader>
				</SheetContent>
			</Sheet>

			<Link to={"/profile"}>
				{
					user?.imageUrl ? <img className='h-[30px] w-[30px] rounded-full object-cover' src={user?.imageUrl} alt="" /> : <span className='h-[30px] w-[30px] rounded-full object-cover uppercase text-white text-2xl font-bold'>{user?.name.charAt(0)}</span>
				}
			</Link>
		</div>
	)
}

export default Topbar