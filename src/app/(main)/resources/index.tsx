import { useEffect, useState } from 'react'
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
import ResourcePostCard from '@/components/resource/ResourcePostCard';

const ResourceHome = () => {
  const [resourceCategories, setResourceCategories] = useState<ResourceCategory[]>([]);
  const [resourcePosts, setResourcePosts] = useState<ResourcePostsResponse | null>()
  const [hasMorePost, setHasMorePost] = useState<boolean>(false);
  // const [loading, setLoading] = useState(true)
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
          <div className='col-span-12 h-full'>
            <div className='w-full flex border-b-2 overflow-x-scroll no-scrollbar '>
              {
                resourceCategories.map((resourceCategory) => {
                  return <span onClick={() => setSelectedCategory(resourceCategory._id)} className={twMerge('min-w-36 flex items-center justify-center px-8 py-3 cursor-pointer', selectedCategory === resourceCategory._id ? "selected" : "selected-none")}>{resourceCategory.title}</span>
                })
              }
            </div>
            <div className='grid grid-cols-12 mt-4'>
              {<div key={currentPage + "forum_feed_page" + resourcePosts?.response?.length || 0} className='max-h-[80vh] min-h-[80vh] w-full px-5 overflow-y-auto scrollbar col-span-8' id={"resource-feed"}>
                <InfiniteScroll
                  dataLength={resourcePosts?.response?.length || 0}
                  next={() => {
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
                      return <ResourcePostCard post={post} selectedCategory={selectedCategory} />
                    })
                  }
                </InfiniteScroll>
              </div>}
            </div>
            <div className='w-full hidden flex-col h-[82vh] mt-5 overflow-auto scrollbar' id={"resource-feed-test"}>
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
                    return <ResourcePostCard post={post} selectedCategory={selectedCategory} />
                  })
                }
              </InfiniteScroll>
            </div>
          </div>
          <div className='col-span-4 h-full hidden items-start justify-end'>
            <button className='button w-max'>Create Resource</button>
          </div>
        </div>
      </div>
    </RootLayout>
  )
}

export default ResourceHome