import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Button from '../../../components/Button';
import PostCard from '../../../components/PostCard';
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
import { useParams } from 'react-router-dom';
import { getUserByID } from '@/service/authService';

const Profile = () => {
  const { user, baseUser } = useAuthContext()
  const [interests, setInterests] = useState<InterestType[]>([])
  const [stories, setStories] = useState<StoryResponse>({ own: [], user: [] });
  const [searchedUser, setSearchedUser] = useState<BaseUser | null>(null)
  const [loading, setLoading] = useState(true);
  const params = useParams();
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
        <DialogContent>
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
            height={768}
          />
        </DialogContent>
      </Dialog>
      <div className='flex flex-col'>
        <Topbar />
        <div className='flex primary-height bg-[#FAFAFA]'>
          <div className='w-[80vw] px-10 py-5 overflow-y-auto scrollbar'>
            <div className='flex items-center justify-between'>
              <div className='w-1/3'>
                <img className='h-[80px] w-[80px] rounded-full object-cover' src={searchedUser?.imageUrl} alt="" />
              </div>
              <div className='w-1/3 grid grid-cols-3 gap-4'>
                <div className='text-xl flex flex-col items-center justify-center'>
                  <h3 className='font-bold'>{searchedUser?.feedCount || 0}</h3>
                  <p className='font-semibold'>Posts</p>
                </div>
                <div className='text-xl flex flex-col items-center justify-center'>
                  <h3 className='font-bold'>{searchedUser?.followers || 0}</h3>
                  <p className='font-semibold'>Followers</p>
                </div>
                <div className='text-xl flex flex-col items-center justify-center'>
                  <h3 className='font-bold'>{searchedUser?.following || 0}</h3>
                  <p className='font-semibold'>Following</p>
                </div>
              </div>

              <div className='opacity-0 pointer-events-none w-1/3 flex justify-end'>
                <Button disabled={true} text='Create Post' type='button' loading={false} className='w-max py-2 h-max' />
              </div>
            </div>

            <div className='flex flex-col mt-2'>
              <h1 className='text-xl font-bold'>{searchedUser?.name}</h1>
              <span className='mt-1 px-3 py-0.5 rounded-full bg-accent/20 w-max'>@{searchedUser?.username}</span>
              <p className='mt-2 max-w-[60%]'>{searchedUser?.bio}</p>
            </div>

            <div className={params._id ? "hidden" : 'mt-5'}>
              <h2 className='text-xl font-semibold'>Stories</h2>
              <div className='mt-3'>
                <Swiper
                  freeMode={true}
                  className='w-full'
                  grabCursor
                  spaceBetween={20}
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

            <div className={'mt-5'}>
              <h2 className='text-xl font-semibold'>Reward Points</h2>
              <div className='mt-3'>
                <h3>Reward Points: {searchedUser?.rewardPoints}</h3>
              </div>
            </div>

            <div className='mt-5'>
              <h2 className='text-xl font-semibold'>Interest</h2>
              <div className='mt-3 flex flex-wrap gap-3'>
                {
                  interests.map((interest) => {
                    return <div className={twMerge("w-max cursor-pointer border-2 hover:bg-black/5 duration-150 h-max px-3 py-2 bg-white shadow-lg rounded-full text-sm flex items-center justify-center gap-1", "border-accent")}><img className="h-6 w-6 object-fill" src={interest.icon} alt={interest.interest} />{interest.interest}</div>
                  })
                }
              </div>
            </div>

            <div className='mt-5 hidden'>
              <h2 className='text-xl font-semibold'>Past post</h2>
              <div className='mt-3 flex items-center relative'>
                <div className='left-0 bg-white absolute z-30 top-1/2 prevEl cursor-pointer'>
                  Prev
                </div>
                <div className='right-0 bg-white absolute z-30 top-1/2 nextEl cursor-pointer'>
                  icon
                </div>
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation={
                    {
                      nextEl: ".nextEl",
                      prevEl: ".prevEl"
                    }
                  }
                  allowTouchMove={false}
                  className='w-full'
                  fadeEffect={{
                    crossFade: true
                  }}
                  spaceBetween={20}
                  slidesPerView={3}
                >
                  <SwiperSlide>
                    <PostCard />
                  </SwiperSlide>
                  <SwiperSlide>
                    <PostCard />
                  </SwiperSlide>
                  <SwiperSlide>
                    <PostCard />
                  </SwiperSlide>
                  <SwiperSlide>
                    <PostCard />
                  </SwiperSlide>
                  <SwiperSlide>
                    <PostCard />
                  </SwiperSlide>
                </Swiper>
              </div>
            </div>

          </div>
        </div>
      </div >
    </RootLayout>
  )
}

export default Profile