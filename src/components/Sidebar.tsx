import { BiCog, BiHomeAlt2, BiGroup, BiPlus, BiBook } from "react-icons/bi";
import { twMerge } from 'tailwind-merge';
import { IoClose } from "react-icons/io5";
import { Link, useLocation } from 'react-router-dom';
import { ChangeEvent, useRef, useState } from "react";
import { File } from "lucide-react";
import { useFeedContext } from "../context/Feed";
import { useAuthContext } from "../context/Auth";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";


const Sidebar = ({
  children,
}: Readonly<{
  children?: React.ReactNode;
}>) => {
  const { pathname } = useLocation()
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [postDialog, setPostDialog] = useState(false)
  const [isPublic, setIsPublic] = useState(true)
  const [content, setContent] = useState("")
  const { handlePost } = useFeedContext();
  const { user } = useAuthContext()
  const routes = [
    {
      action: "link",
      url: "/",
      icon: <BiHomeAlt2 className='text-2xl' />,
      label: "Home"
    },
    {
      action: "button",
      url: "/post",
      icon: <BiPlus className='text-2xl' />,
      label: "Post"
    },
    {
      action: "link",
      url: "/forum",
      icon: <BiGroup className='text-2xl' />,
      label: "Forum"
    },
    {
      action: "link",
      url: "/resource",
      icon: <BiBook className='text-2xl' />,
      label: "Resource"
    },
    {
      action: "link",
      url: "/settings",
      icon: <BiCog className='text-2xl' />,
      label: "Settings"
    },
  ]
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);

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

  const getFileType = (file: File): SelectedFile['type'] => {
    const fileType = file.type;
    if (fileType === 'video/mp4') return 'mp4';
    if (fileType === 'video/quicktime') return 'mov';
    if (fileType === 'image/png') return 'png';
    if (fileType === 'image/jpeg') return 'jpg';
    if (fileType === 'image/jpg') return 'jpg';
    return 'unknown';
  };

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
      <aside className='w-[20vw] h-screen'>
        <div className='flex items-center px-9 h-[80px] w-full'>
          <img src={"/assets/logo/logo.svg"} alt="" />
        </div>
        <nav className='primary-height px-5 py-5 gap-2 flex flex-col border-t border-r justify-between'>
          {
            children ? children : <div>
              {
                routes.map((route) => {
                  if (route.action == "link") {
                    return <Link key={route.url} className={twMerge('text-gray-500 rounded-lg flex items-center gap-3 py-3 hover:bg-accent/5 duration-100 px-4 text-lg', pathname == route.url ? "text-accent bg-accent/10" : "text-gray-500 ")} to={route.url}>{route.icon} {route.label}</Link>
                  } else {
                    return <span key={route.url} className={twMerge('cursor-pointer text-gray-500 rounded-lg flex items-center gap-3 py-3 hover:bg-accent/5 duration-100 px-4 text-lg', pathname == route.url ? "text-accent bg-accent/10" : "text-gray-500 ")} onClick={() => setPostDialog(true)}>{route.icon} {route.label}</span>
                  }
                })
              }
            </div>
          }
          <span key={'logout'} className={twMerge('cursor-pointer text-red-500 rounded-lg flex items-center gap-3 py-3 hover:bg-accent/5 duration-100 px-4 text-lg ')} onClick={() => {
            signOut(auth).then(() => {
              // Sign-out successful.
            }).catch((error) => {
              console.log(error)
            });

          }}>{"Logout"}</span>
        </nav>
      </aside>
      {postDialog && <div className='fixed h-screen w-screen bg-black/50 z-20 top-0 left-0 flex items-center justify-center'>
        <form className='w-[56vw] h-[65vh] bg-white rounded-xl py-5 px-8'>
          <div className='flex items-center justify-between'>
            <h1 className='text-2xl font-bold'>Share your post</h1>
            <span onClick={() => setPostDialog(false)} className='h-6 w-6 rounded-md bg-accent/10 flex items-center justify-center hover:bg-accent/20 duration-100 cursor-pointer'>
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
              <input ref={inputRef} type="file" hidden multiple accept=".png,.jpg,.jpeg,.mov,.mp4" onChange={handleFileChange} />
            </div>
          </div>

          <textarea value={content} onChange={(e) => setContent(e.currentTarget.value)} className="bg-accent/5 px-4 py-2 rounded-lg resize-none scrollbar outline-none border-0 flex-1 mt-3 w-full h-48" placeholder="What's on your mind?"></textarea>
          <div className="h-24 result flex gap-2 flex-wrap">{renderPreviews(selectedFiles)}</div>
          <div className="items-center flex justify-between">
            <button onClick={() => inputRef.current?.click()} type="button" className="flex items-center justify-center text-accent text-sm bg-accent/10 px-3 py-1 rounded-lg"><File className="h-3 w-3" />&nbsp; Upload Photos/Videos</button>
            <button onClick={async () => {
              setPostDialog(false);
              const status = await handlePost(selectedFiles, content, isPublic);
              if (status == 200) {
                setSelectedFiles([]);
              }
            }} type="button" className="flex items-center justify-center text-white text-sm bg-accent px-6 py-2 rounded-lg">Post</button>
          </div>
        </form>
      </div>}
    </>
  )
}

export default Sidebar