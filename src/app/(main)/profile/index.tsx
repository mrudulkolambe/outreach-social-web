import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Button from '../../../components/Button';
import RootLayout from '../layout';
import { useAuthContext } from '../../../context/Auth';
import Topbar from '@/components/Topbar';
import { twMerge } from 'tailwind-merge';
import { useEffect, useState } from 'react';
import interestsOptions, { InterestType } from '@/lib/interests';
import { Dialog, DialogContent } from "@/components/ui/dialog"
import Stories from 'react-insta-stories';
import { getUserStories } from '@/service/storyService';
import moment from 'moment';
import Storycard from '@/components/Storycard';
import { useNavigate, useParams } from 'react-router-dom';
import { followUser, getUserByID } from '@/service/authService';
import Postcard from '@/components/post/Postcard';

const Profile = () => {
  const { user, baseUser } = useAuthContext()
  const [interests, setInterests] = useState<InterestType[]>([])
  const [stories, setStories] = useState<StoryResponse>({ own: [], user: [] });
  const [searchedUser, setSearchedUser] = useState<BaseUser | null>(null)
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const navigate = useNavigate()
  console.log(params);
  let emptyStories: any[] = []
  const [storyOpen, setStoryOpen] = useState({
    show: false,
    stories: emptyStories
  })

  function handleStories(stories: UserStory[]): UserStoryGroup[] {
    const groupedMap: Record<string, UserStoryGroup> = {};

    for (const story of stories) {
      if (story.public) {
        // Group by username for public stories
        const username = story.userId.username;
        const imageUrl = story.userId.imageUrl;
        if (!groupedMap.hasOwnProperty(username)) {
          groupedMap[username] = {
            username: username,
            stories: [],
            imageUrl: imageUrl,
          };
        }
        groupedMap[username].stories.push(story);
      } else {
        // Group under "anonyms" for non-public stories
        const anonymousGroupName = "anonymous";
        if (!groupedMap.hasOwnProperty(anonymousGroupName)) {
          groupedMap[anonymousGroupName] = {
            username: anonymousGroupName,
            stories: [],
            imageUrl: "/icons/user-placeholder.svg", // No image for anonymous group
          };
        }
        groupedMap[anonymousGroupName].stories.push(story);
      }
    }
    return Object.values(groupedMap);
  }

  async function followUserFunction() {
    if (params._id && user) {
      console.log("CALLED")
      await followUser(params?._id as string, user?._id as string);
      navigate(0);
    }
  }


  useEffect(() => {
    if (user && user._id != params._id) {
      initStories()
    }
  }, [user])

  const initStories = async () => {
    let stories = await getUserStories();
    if (stories) {
      setStories(stories.response)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!storyOpen.show) {
      const timer = setTimeout(() => setStoryOpen({ show: false, stories: [] }), 300);
      return () => clearTimeout(timer);
    }
  }, [storyOpen.show, setStoryOpen]);

  useEffect(() => {
    if (searchedUser?.interest) {
      const pickedInterests = searchedUser.interest.map((interest) => {
        return interestsOptions.find((item) => item.interest === interest);
      }) as InterestType[]
      setInterests(pickedInterests)
    }
  }, [searchedUser])

  useEffect(() => {
    setSearchedUser(baseUser);
    setLoading(false)
    if (baseUser?._id != params._id) {
      fetchUserData()
    }
  }, [params, baseUser])

  const fetchUserData = async () => {
    if (params && params._id && baseUser) {
      setLoading(true)
      const user = await getUserByID(params._id as string, baseUser?._id as string);
      setSearchedUser(user.response);
      setLoading(false)
    }
  }

  return (
    <RootLayout loading={loading}>
      <Dialog open={storyOpen.show} onOpenChange={(e) => setStoryOpen({ ...storyOpen, show: e })}>
        <DialogContent className="w-[95vw] sm:w-[80vw] md:w-[60vw] lg:w-[50vw] max-w-4xl">
          <Stories
            storyContainerStyles={{
              background: "#000",
            }}
            storyInnerContainerStyles={{
              background: "#000",
            }}
            keyboardNavigation={true}
            onAllStoriesEnd={() => {
              console.log("All stories ended");
              setStoryOpen(prev => ({ ...prev, show: false }));
            }}
            stories={storyOpen.stories || []}
            defaultInterval={8000}
            width={"100%"}
            height={window.innerWidth < 768 ? window.innerHeight : 768}
          />
        </DialogContent>
      </Dialog>
      <div className='flex flex-col'>
        <Topbar />
        <div className='flex primary-height bg-[#FAFAFA]'>
          <div className='w-full lg:w-[80vw] px-4 sm:px-6 lg:px-10 py-4 sm:py-5 overflow-y-auto scrollbar'>
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-4'>
              <div className='w-full sm:w-1/3'>
                <img className='h-[80px] w-[80px] rounded-full object-cover' src={searchedUser?.imageUrl} alt="" />
              </div>
              <div className='w-full sm:w-1/3 grid grid-cols-3 gap-2 sm:gap-4'>
                <div className='text-base sm:text-xl flex flex-col items-center justify-center'>
                  <h3 className='font-bold'>{searchedUser?.feedCount || 0}</h3>
                  <p className='font-semibold'>Posts</p>
                </div>
                <div className='text-base sm:text-xl flex flex-col items-center justify-center'>
                  <h3 className='font-bold'>{searchedUser?.followers || 0}</h3>
                  <p className='font-semibold'>Followers</p>
                </div>
                <div className='text-base sm:text-xl flex flex-col items-center justify-center'>
                  <h3 className='font-bold'>{searchedUser?.following || 0}</h3>
                  <p className='font-semibold'>Following</p>
                </div>
              </div>

              <div className={params._id ? 'w-full sm:w-1/3 flex sm:justify-end' : 'opacity-0 w-full sm:w-1/3 pointer-events-none'}>
                <span onClick={followUserFunction} className="w-full sm:w-auto">
                  <Button disabled={false} text={!searchedUser?.isFollowing ? 'Follow' : "Unfollow"} type='button' loading={false} className='w-full sm:w-max py-2 h-max' />
                </span>
              </div>
            </div>

            <div className='flex flex-col mt-4 sm:mt-2'>
              <h1 className='text-lg sm:text-xl font-bold'>{searchedUser?.name}</h1>
              <span className='mt-1 px-3 py-0.5 rounded-full bg-accent/20 w-max'>@{searchedUser?.username}</span>
              <p className='mt-2 max-w-full sm:max-w-[60%]'>{searchedUser?.bio}</p>
            </div>

            <div className={params._id ? "hidden" : 'mt-4 sm:mt-5 hidden'}>
              <h2 className='text-lg sm:text-xl font-semibold'>Stories</h2>
              <div className='mt-3'>
                <Swiper
                  freeMode={true}
                  className='w-full'
                  grabCursor
                  spaceBetween={10}
                  slidesPerView="auto"
                  breakpoints={{
                    320: {
                      slidesPerView: 3,
                      spaceBetween: 8
                    },
                    640: {
                      slidesPerView: 5,
                      spaceBetween: 12
                    },
                    768: {
                      slidesPerView: 6,
                      spaceBetween: 16
                    },
                    1024: {
                      slidesPerView: 8,
                      spaceBetween: 20
                    }
                  }}
                >
                  {stories.own && <SwiperSlide className='storycard-layout'>
                    <div onClick={() => {
                      setStoryOpen({
                        show: true, stories: stories.own.map((story) => {
                          return {
                            type: story.media.type,
                            url: story.media.url,
                            header: {
                              heading: story.userId.name,
                              subheading: moment(story.createdAt).fromNow(),
                              profileImage: story.userId.imageUrl,
                            },
                          }
                        })
                      })
                    }} className='flex flex-col gap-2 items-center'>
                      <div className='flex flex-col h-[100px] w-[85px] bg-accent/20 rounded-lg items-center justify-center px-2 py-3 gap-3'>
                        <span className='h-6 w-6 p-0.5 bg-accent rounded-full flex items-center justify-center text-white'>
                          {/* <Plus /> */}
                        </span>
                        <p className='text-center leading-4 text-sm'>View your story</p>
                      </div>
                      <p>Your story</p>
                    </div>
                  </SwiperSlide>}
                  {
                    handleStories(stories.user).map((userStory) => {
                      return <SwiperSlide onClick={() => {
                        setStoryOpen({
                          show: true,
                          stories: userStory.stories.map((story) => {
                            return {
                              public: story.public,
                              type: story.media.type,
                              url: story.media.url,
                              header: {
                                heading: story.public ? story.userId.name : "anonymous",
                                subheading: moment(story.createdAt).fromNow(),
                                profileImage: story.public ? story.userId.imageUrl : "/icons/user-placeholder.svg",
                              },
                            }
                          })
                        })
                      }} className='storycard-layout' key={userStory.username}>
                        <Storycard userStoryGrp={userStory} />
                      </SwiperSlide>
                    })
                  }
                </Swiper>
              </div>
            </div>

            <div className={'mt-4 sm:mt-5'}>
              <h2 className='text-lg sm:text-xl font-semibold mb-4'>Reward Points</h2>
              <div className='mt-2 sm:mt-3'>
                <h3>Reward Points: {searchedUser?.rewardPoints}</h3>
              </div>
            </div>

            <div className='mt-4 sm:mt-5'>
              <h2 className='text-lg sm:text-xl font-semibold'>Interest</h2>
              <div className='mt-2 sm:mt-3 flex flex-wrap gap-2 sm:gap-3'>
                {
                  interests.map((interest) => {
                    return <div key={interest.interest} className={twMerge("w-max cursor-pointer border-2 hover:bg-black/5 duration-150 h-max px-2 sm:px-3 py-1.5 sm:py-2 bg-white shadow-lg rounded-full text-sm flex items-center justify-center gap-1", "border-accent")}><img className="h-5 sm:h-6 w-5 sm:w-6 object-fill" src={interest.icon} alt={interest.interest} />{interest.interest}</div>
                  })
                }
              </div>
            </div>

            <div className='mt-4 sm:mt-5'>
              <h2 className='text-lg sm:text-xl font-semibold mb-4'>Past Posts</h2>
              <div className='relative'>
                <div className='hidden lg:block'>
                  <div className='absolute left-0 top-1/2 -translate-y-1/2 z-30 prevEl cursor-pointer bg-white shadow-lg rounded-r-lg p-2 hover:bg-gray-50'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </div>
                  <div className='absolute right-0 top-1/2 -translate-y-1/2 z-30 nextEl cursor-pointer bg-white shadow-lg rounded-l-lg p-2 hover:bg-gray-50'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <Swiper
                    modules={[Navigation, Pagination]}
                    navigation={{
                      nextEl: ".nextEl",
                      prevEl: ".prevEl"
                    }}
                    pagination={{ clickable: true }}
                    allowTouchMove={true}
                    className='w-full px-2'
                    spaceBetween={24}
                    slidesPerView={3}
                    breakpoints={{
                      1024: { slidesPerView: 2, spaceBetween: 20 },
                      1280: { slidesPerView: 3, spaceBetween: 24 }
                    }}
                  >
                    {baseUser?.feeds.map((post) => (
                      <SwiperSlide key={post._id} className='pb-10'>
                        <div className='bg-white rounded-xl shadow-sm'>
                          <Postcard post={post} />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
                
                {/* Mobile/Tablet View */}
                <div className='lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
                  {baseUser?.feeds.map((post) => (
                    <div key={post._id} className='bg-white rounded-xl shadow-sm'>
                      <Postcard post={post} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  )
}

export default Profile