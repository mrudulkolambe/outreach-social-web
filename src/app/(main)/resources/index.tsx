import { useEffect, useRef, useState } from 'react'
import RootLayout from '../layout'
import Topbar from '@/components/Topbar'
import { createResourcePost, getResourceCategories, getResources } from '@/service/resourceService'
import { twMerge } from 'tailwind-merge'
import InfiniteScroll from 'react-infinite-scroll-component'
import ResourcePostCard from '@/components/resource/ResourcePostCard'
import { uploadMultipleFiles } from '@/service/uploadService'
import { toast } from 'sonner'
import Spinner from '@/components/spinner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { IoClose } from "react-icons/io5"
import { getFileType } from '@/utils/file'
import TextButton from '@/components/TextButton'


const ResourceHome = () => {
  const [resourceCategories, setResourceCategories] = useState<ResourceCategory[]>([])
  const [allPosts, setAllPosts] = useState<ResourcePost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<ResourcePost[]>([])
  const [hasMorePost, setHasMorePost] = useState<boolean>(true)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([])
  const inputRef = useRef<HTMLInputElement | null>(null)

  // New post states
  const [uploading, setUploading] = useState(false)
  const [isPublic, setIsPublic] = useState(true)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [postCategory, setPostCategory] = useState<string>("")

  useEffect(() => {
    fetchCategories()
    fetchInitialResources()
  }, [])

  useEffect(() => {
    applyFilter()
  }, [selectedCategory, allPosts])

  const fetchCategories = async () => {
    const categoryResponse = await getResourceCategories()
    setResourceCategories(categoryResponse?.response || [])
  }

  const fetchInitialResources = async () => {
    const resourceResponse = await getResources(1)
    if (resourceResponse) {
      setAllPosts(resourceResponse.response || [])
      setHasMorePost(resourceResponse.currentPage < resourceResponse.totalPages)
    }
  }

  const loadMorePosts = async () => {
    const nextPage = currentPage + 1
    const morePostsResponse = await getResources(nextPage)

    if (morePostsResponse) {
      setAllPosts(prev => [...prev, ...morePostsResponse.response])
      setCurrentPage(nextPage)
      setHasMorePost(morePostsResponse.currentPage < morePostsResponse.totalPages)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files)
      const fileArray = files.map((file) => ({
        file,
        type: getFileType(file)
      }))
      setSelectedFiles((prevFiles) => prevFiles.concat(fileArray))
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }

  const renderPreviews = (source: SelectedFile[]) => {
    return source.map((item, index) => {
      const fileUrl = URL.createObjectURL(item.file)
      return (
        <div className="flex relative" key={index}>
          <button
            type="button"
            className="absolute h-5 w-5 bg-white flex items-center justify-center rounded-full top-1 right-1"
            onClick={() => removeFile(index)}
          >
            <IoClose />
          </button>
          {item.type === 'png' || item.type === 'jpg' || item.type === 'jpeg' ? (
            <img className="h-20 aspect-video object-cover" src={fileUrl} alt="preview" />
          ) : (
            <video className="h-20 aspect-video object-cover" controls>
              <source src={fileUrl} type={item.file.type} />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      )
    })
  }

  const createPost = async () => {
    setUploading(true)
    try {
      let urls = await uploadMultipleFiles(selectedFiles as SelectedFile[], 'resources')
      if (urls) {
        const body = {
          "public": isPublic,
          "category": postCategory,
          "content": content,
          "title": title,
          "media": urls?.results,
        }

        const result = await createResourcePost(body)
        if (result) {
          const posts = await getResources(1)
          if (posts) {
            setHasMorePost(posts.currentPage < posts.totalPages)
            setAllPosts(posts.response)
            toast.success("Post published successfully!")
            // Reset form
            setTitle("")
            setContent("")
            setPostCategory("")
            setSelectedFiles([])
            setIsPublic(true)
          }
        } else {
          toast.error("Something went wrong, Please try again!")
        }
      }
    } catch (error) {
      toast.error("Failed to create post")
    } finally {
      setUploading(false)
    }
  }

  const applyFilter = () => {
    if (selectedCategory === "all") {
      setFilteredPosts(allPosts)
    } else {
      const filtered = allPosts.filter(post =>
        post.category === selectedCategory
      )
      setFilteredPosts(filtered)
    }
  }

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
  }

  return (
    <RootLayout>
      <div className='flex flex-col h-screen max-h-screen'>
        <Topbar />
        <div className='flex flex-col w-full bg-white primary-height overflow-hidden p-3 sm:p-4 lg:px-10'>
          <div className='w-full h-full flex flex-col'>
            {/* Category Filter */}
            <div className='w-full flex border-b-2 overflow-x-auto scrollbar-none pb-1'>
              <span
                onClick={() => handleCategoryChange("all")}
                className={twMerge(
                  'whitespace-nowrap flex items-center justify-center px-4 sm:px-8 py-2 sm:py-3 cursor-pointer border-b-2 text-sm sm:text-base',
                  selectedCategory === "all"
                    ? 'border-blue-500 text-blue-600 font-medium'
                    : 'border-transparent hover:border-gray-200'
                )}
              >
                All
              </span>
              {resourceCategories.map(category => (
                <span
                  key={category._id}
                  onClick={() => handleCategoryChange(category._id)}
                  className={twMerge(
                    'whitespace-nowrap flex items-center justify-center px-4 sm:px-8 py-2 sm:py-3 cursor-pointer border-b-2 text-sm sm:text-base',
                    selectedCategory === category._id
                      ? 'border-blue-500 text-blue-600 font-medium'
                      : 'border-transparent hover:border-gray-200'
                  )}
                >
                  {category.title}
                </span>
              ))}
            </div>

            {/* Mobile Create Post Button */}
            <div className='lg:hidden w-full flex justify-end mt-3'>
              <Dialog>
                <DialogTrigger asChild>
                  <button className='button w-max h-max py-2 px-4'>New Post</button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] sm:w-[80vw] lg:w-[50vw] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className='text-xl sm:text-2xl font-bold text-black'>Create Post</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className='flex flex-col gap-1'>
                      <label htmlFor="name" className="text-sm sm:text-base">Title: </label>
                      <input
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                        className='input text-sm sm:text-base'
                        id='name'
                        placeholder="Enter post title"
                      />
                    </div>
                    <div className='hidden flex-col gap-1'>
                      <label className="text-sm sm:text-base">Post type: </label>
                      <div className='w-max flex gap-3'>
                        <button
                          type="button"
                          onClick={() => setIsPublic(true)}
                          className={twMerge(
                            'button px-3 py-1 text-sm w-max',
                            isPublic ? "" : "bg-gray-400 text-white"
                          )}
                        >
                          Public
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsPublic(false)}
                          className={twMerge(
                            'button px-3 py-1 text-sm w-max',
                            !isPublic ? "" : "bg-gray-400 text-white"
                          )}
                        >
                          Private
                        </button>
                      </div>
                    </div>
                    <div className='flex flex-col gap-1'>
                      <label className="text-sm sm:text-base">Category: </label>
                      <select
                        value={postCategory}
                        onChange={(e) => setPostCategory(e.target.value)}
                        className='input text-sm sm:text-base'
                      >
                        <option value="">Select a category</option>
                        {resourceCategories.map(category => (
                          <option key={category._id} value={category._id}>
                            {category.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className='flex flex-col gap-1'>
                      <label htmlFor='desc' className="text-sm sm:text-base">Description: </label>
                      <textarea
                        onChange={(e) => setContent(e.target.value)}
                        value={content}
                        id="desc"
                        placeholder="Write your post content..."
                        className='input h-24 sm:h-32 resize-none text-sm sm:text-base'
                      />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {renderPreviews(selectedFiles)}
                    </div>
                    <TextButton 
                      text='Upload Media' 
                      type='button' 
                      className='text-accent text-xs sm:text-sm font-semibold underline' 
                      onClick={() => inputRef.current?.click()} 
                    />
                    <div className="flex justify-end items-center">
                      <input
                        ref={inputRef}
                        type="file"
                        hidden
                        multiple
                        accept=".png,.jpg,.jpeg,.mov,.mp4"
                        onChange={handleFileChange}
                      />
                      <button
                        onClick={createPost}
                        className='button py-2 sm:py-3 px-6 sm:px-8 h-max text-sm sm:text-base'
                        disabled={uploading || !title.trim() || !content.trim() || !postCategory}
                      >
                        {uploading ? <Spinner /> : "Create"}
                      </button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Resource Posts */}
            <div className='flex flex-col lg:flex-row gap-4 mt-4 h-full'>
              <div
                className='flex-1 max-h-[calc(100vh-220px)] lg:max-h-[calc(100vh-180px)] overflow-y-auto scrollbar'
                id="resource-feed"
              >
                <InfiniteScroll
                  dataLength={allPosts.length}
                  next={loadMorePosts}
                  hasMore={hasMorePost}
                  loader={<div className="text-center py-4">Loading more resources...</div>}
                  scrollableTarget="resource-feed"
                  endMessage={
                    filteredPosts.length === 0 ? (
                      <p className="text-center py-4 text-gray-500">
                        No resources found in this category
                      </p>
                    ) : (
                      <p className="text-center py-4 text-gray-500">
                        You've seen all resources in this category
                      </p>
                    )
                  }
                >
                  {filteredPosts.map(post => (
                    <ResourcePostCard
                      key={post._id}
                      post={post}
                      selectedCategory={selectedCategory}
                    />
                  ))}
                </InfiniteScroll>
              </div>

              {/* Desktop Create Post Dialog */}
              <div className='hidden lg:flex w-80 flex-shrink-0'>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className='button w-max h-max py-2 px-4'>New Post</button>
                  </DialogTrigger>
                  <DialogContent className="w-[95vw] sm:w-[80vw] lg:w-[50vw] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className='text-xl sm:text-2xl font-bold text-black'>Create Post</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className='flex flex-col gap-1'>
                        <label htmlFor="name" className="text-sm sm:text-base">Title: </label>
                        <input
                          onChange={(e) => setTitle(e.target.value)}
                          value={title}
                          className='input text-sm sm:text-base'
                          id='name'
                          placeholder="Enter post title"
                        />
                      </div>
                      <div className='hidden flex-col gap-1'>
                        <label className="text-sm sm:text-base">Post type: </label>
                        <div className='w-max flex gap-3'>
                          <button
                            type="button"
                            onClick={() => setIsPublic(true)}
                            className={twMerge(
                              'button px-3 py-1 text-sm w-max',
                              isPublic ? "" : "bg-gray-400 text-white"
                            )}
                          >
                            Public
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsPublic(false)}
                            className={twMerge(
                              'button px-3 py-1 text-sm w-max',
                              !isPublic ? "" : "bg-gray-400 text-white"
                            )}
                          >
                            Private
                          </button>
                        </div>
                      </div>
                      <div className='flex flex-col gap-1'>
                        <label className="text-sm sm:text-base">Category: </label>
                        <select
                          value={postCategory}
                          onChange={(e) => setPostCategory(e.target.value)}
                          className='input text-sm sm:text-base'
                        >
                          <option value="">Select a category</option>
                          {resourceCategories.map(category => (
                            <option key={category._id} value={category._id}>
                              {category.title}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className='flex flex-col gap-1'>
                        <label htmlFor='desc' className="text-sm sm:text-base">Description: </label>
                        <textarea
                          onChange={(e) => setContent(e.target.value)}
                          value={content}
                          id="desc"
                          placeholder="Write your post content..."
                          className='input h-24 sm:h-32 resize-none text-sm sm:text-base'
                        />
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {renderPreviews(selectedFiles)}
                      </div>
                      <TextButton 
                        text='Upload Media' 
                        type='button' 
                        className='text-accent text-xs sm:text-sm font-semibold underline' 
                        onClick={() => inputRef.current?.click()} 
                      />
                      <div className="flex justify-end items-center">
                        <input
                          ref={inputRef}
                          type="file"
                          hidden
                          multiple
                          accept=".png,.jpg,.jpeg,.mov,.mp4"
                          onChange={handleFileChange}
                        />
                        <button
                          onClick={createPost}
                          className='button py-2 sm:py-3 px-6 sm:px-8 h-max text-sm sm:text-base'
                          disabled={uploading || !title.trim() || !content.trim() || !postCategory}
                        >
                          {uploading ? <Spinner /> : "Create"}
                        </button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  )
}

export default ResourceHome