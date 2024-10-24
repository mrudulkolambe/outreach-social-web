import React, { useEffect, useState } from 'react'
import RootLayout from '../layout'
import Topbar from '@/components/Topbar'
import { getResourceCategories, getResources } from '@/service/resourceService';
import { twMerge } from 'tailwind-merge';
import InfiniteScroll from 'react-infinite-scroll-component';
import moment from 'moment';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import VideoComponent from '@/components/Video';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ResourceHome = () => {
  const [resourceCategories, setResourceCategories] = useState<ResourceCategory[]>([]);
  const [resourcePosts, setResourcePosts] = useState<ResourcePostsResponse | null>()
  const [hasMorePost, setHasMorePost] = useState<boolean>(false);
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    init()
  }, [])

  const loadMorePosts = async () => {
    if (hasMorePost) {
      const nextPage = currentPage + 1;
      const morePostsResponse = await getResources(nextPage);

      if (morePostsResponse) {
        setResourcePosts({ ...morePostsResponse, response: resourcePosts?.response!.concat(morePostsResponse.response!) ?? [] })
        setCurrentPage(nextPage);
        setHasMorePost(morePostsResponse.totalPages > morePostsResponse.currentPage);
      }
    } else {
      console.log("Else Load More Posts");
    }
  };


  const init = async () => {
    const categoryResponse = await getResourceCategories();
    const resourceResponse = await getResources(currentPage);
    console.log(resourceResponse)
    setResourcePosts(resourceResponse)
    console.log("has more posts", resourceResponse?.currentPage! < resourceResponse?.totalPages!, resourceResponse?.response.length)
    setHasMorePost(resourceResponse?.currentPage! < resourceResponse?.totalPages!)
    setResourceCategories(categoryResponse?.response as ResourceCategory[])
  }
  const [selectedCategory, setSelectedCategory] = useState("");

  return (
    <RootLayout>
      <div className='flex flex-col h-screen max-h-screen'>
        <Topbar />
        <div className='grid grid-cols-12 py-3 px-10 w-full bg-white primary-height overflow-hidden'>
          <div className='col-span-8 h-full'>
            <div className='w-full flex border-b-2 overflow-x-scroll no-scrollbar '>
              {
                resourceCategories.map((resourceCategory) => {
                  return <span onClick={() => setSelectedCategory(resourceCategory._id)} className={twMerge('min-w-36 flex items-center justify-center px-8 py-3 cursor-pointer', selectedCategory === resourceCategory._id ? "selected" : "selected-none")}>{resourceCategory.title}</span>
                })
              }
            </div>
            <div className='w-full bg-red-300 flex flex-col h-[60vh] overflow-auto'>
              <InfiniteScroll
                dataLength={resourcePosts?.response?.length || 0}
                next={() => {
                  console.log("LOAD MORE")
                  loadMorePosts()
                }}
                hasMore={hasMorePost}
                loader={<h4>Loading...</h4>}
                scrollableTarget={"resource-feed"}
                endMessage={
                  <p style={{ textAlign: 'center' }}>
                    <b>Yay! You have seen it all</b>
                  </p>
                }
              >
                {
                  resourcePosts?.response?.map((post: ResourcePost) => {
                    return <div className={post.category === selectedCategory || true ? 'flex flex-col mb-3' : "hidden"}>
                      <div className='flex gap-3'>
                        <img className='h-12 w-12 rounded-full' src={post.user.imageUrl} alt="" />
                        <div className='flex flex-col'>
                          <h2 className='text-lg font-bold'>{post.user.name}</h2>
                          <p className='font-semibold'>@{post.user.username}</p>
                          <p className='text-sm'>{moment(post.createdAt).format("DD/MM/YYYY")}</p>
                        </div>
                      </div>
                      <p className='text-lg font-bold' dangerouslySetInnerHTML={{ __html: post.title }}></p>
                      <p dangerouslySetInnerHTML={{ __html: post.content }}></p>
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
                              nextEl: `.resource_next_${post._id}`,
                              prevEl: `.resource_prev_${post._id}`
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
                    </div>
                  })
                }
              </InfiniteScroll>
            </div>
          </div>
          <div className='col-span-4 h-full flex items-start justify-end'>
            <button className='button w-max'>Create Resource</button>
          </div>
        </div>
      </div>
    </RootLayout>
  )
}

export default ResourceHome