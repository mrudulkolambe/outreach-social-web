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
        <div className='grid grid-cols-12 py-3 px-10 w-full bg-white primary-height overflow-hidden'>
          <div className='col-span-12 h-full'>
            {/* Category Filter */}
            <div className='w-full flex border-b-2 overflow-x-auto no-scrollbar'>
              <span
                onClick={() => handleCategoryChange("all")}
                className={twMerge(
                  'min-w-36 flex items-center justify-center px-8 py-3 cursor-pointer border-b-2',
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
                    'min-w-36 flex items-center justify-center px-8 py-3 cursor-pointer border-b-2',
                    selectedCategory === category._id
                      ? 'border-blue-500 text-blue-600 font-medium'
                      : 'border-transparent hover:border-gray-200'
                  )}
                >
                  {category.title}
                </span>
              ))}
            </div>

            {/* Resource Posts */}
            <div className='grid grid-cols-12 mt-4'>
              <div
                className='max-h-[80vh] min-h-[80vh] w-full px-5 overflow-y-auto scrollbar col-span-8'
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

              {/* Create Post Dialog */}
              <div className='col-span-4 h-full hidden lg:flex items-start justify-end'>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className={twMerge('button w-max h-max py-2')}>New Post</button>
                  </DialogTrigger>
                  <DialogContent className="w-[50vw]">
                    <DialogHeader>
                      <DialogTitle className='text-2xl font-bold text-black'>Create Post</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className='flex flex-col gap-1'>
                        <label htmlFor="name">Title: </label>
                        <input
                          onChange={(e) => setTitle(e.target.value)}
                          value={title}
                          className='input'
                          id='name'
                        />
                      </div>
                      <div className='hidden flex-col gap-1'>
                        <label>Post type: </label>
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
                        <label>Category: </label>
                        <select
                          value={postCategory}
                          onChange={(e) => setPostCategory(e.target.value)}
                          className='input'
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
                        <label htmlFor='desc'>Description: </label>
                        <textarea
                          onChange={(e) => setContent(e.target.value)}
                          value={content}
                          id="desc"
                          className='input h-32 resize-none'
                        />
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {renderPreviews(selectedFiles)}
                      </div>
                      <TextButton text='Upload Media' type='button' className='text-accent text-xs font-semibold underline' onClick={() => inputRef.current?.click()} />
                      <div className="flex justify-between items-center">
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
                          className='button py-3 mt-3 h-max px-8'
                          disabled={uploading}
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