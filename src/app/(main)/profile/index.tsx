import { Swiper, SwiperSlide } from 'swiper/react';
import { Plus } from 'lucide-react'
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

const Profile = () => {
  const { user, baseUser } = useAuthContext()
  const [interests, setInterests] = useState<InterestType[]>([])
  useEffect(() => {
    if (baseUser?.interest) {
      const pickedInterests = baseUser.interest.map((interest) => {
        return interestsOptions.find((item) => item.interest === interest);
      }) as InterestType[]
      setInterests(pickedInterests)
    }
  }, [baseUser])

  return (
    <RootLayout>
      <div className='flex flex-col'>
        <Topbar />
        <div className='flex primary-height bg-[#FAFAFA]'>
          <div className='w-[80vw] px-10 py-5 overflow-y-auto scrollbar'>
            <div className='flex items-center justify-between'>
              <div className='w-1/3'>
                <img className='h-[80px] w-[80px] rounded-full object-cover' src={user?.imageUrl} alt="" />
              </div>
              <div className='w-1/3 grid grid-cols-3 gap-4'>
                <div className='text-xl flex flex-col items-center justify-center'>
                  <h3 className='font-bold'>12</h3>
                  <p className='font-semibold'>Posts</p>
                </div>
                <div className='text-xl flex flex-col items-center justify-center'>
                  <h3 className='font-bold'>{baseUser?.followers || 0}</h3>
                  <p className='font-semibold'>Followers</p>
                </div>
                <div className='text-xl flex flex-col items-center justify-center'>
                  <h3 className='font-bold'>{baseUser?.following || 0}</h3>
                  <p className='font-semibold'>Following</p>
                </div>
              </div>

              <div className='w-1/3 flex justify-end'>
                <Button disabled={false} text='Create Post' type='button' loading={false} className='w-max py-2 h-max' />
              </div>
            </div>

            <div className='flex flex-col mt-2'>
              <h1 className='text-xl font-bold'>{user?.name}</h1>
              <span className='mt-1 px-3 py-0.5 rounded-full bg-accent/20 w-max'>@{user?.username}</span>
              <p className='mt-2 max-w-[60%]'>{user?.bio}</p>
            </div>

            <div className='mt-5'>
              <h2 className='text-xl font-semibold'>Stories</h2>
              <div className='mt-3'>
                <Swiper
                  freeMode={true}
                  className='w-full'
                  grabCursor
                  spaceBetween={20}
                >
                  <SwiperSlide className='storycard-layout'>
                    <div className='flex flex-col gap-2 items-center'>
                      <div className='flex flex-col h-[100px] w-[85px] bg-accent/20 rounded-lg items-center justify-center px-2 py-3 gap-3'>
                        <span className='h-6 w-6 p-0.5 bg-accent rounded-full flex items-center justify-center text-white'>
                          <Plus />
                        </span>
                        <p className='text-center leading-4 text-sm'>Add your story</p>
                      </div>
                      <p>Your story</p>
                    </div>
                  </SwiperSlide>
                  {/* <SwiperSlide className='storycard-layout'>
                    <Storycard />
                  </SwiperSlide>
                  <SwiperSlide className='storycard-layout'>
                    <Storycard />
                  </SwiperSlide>
                  <SwiperSlide className='storycard-layout'>
                    <Storycard />
                  </SwiperSlide>
                  <SwiperSlide className='storycard-layout'>
                    <Storycard />
                  </SwiperSlide>
                  <SwiperSlide className='storycard-layout'>
                    <Storycard />
                  </SwiperSlide>
                  <SwiperSlide className='storycard-layout'>
                    <Storycard />
                  </SwiperSlide>
                  <SwiperSlide className='storycard-layout'>
                    <Storycard />
                  </SwiperSlide>
                  <SwiperSlide className='storycard-layout'>
                    <Storycard />
                  </SwiperSlide>
                  <SwiperSlide className='storycard-layout'>
                    <Storycard />
                  </SwiperSlide>
                  <SwiperSlide className='storycard-layout'>
                    <Storycard />
                  </SwiperSlide>
                  <SwiperSlide className='storycard-layout'>
                    <Storycard />
                  </SwiperSlide>
                  <SwiperSlide className='storycard-layout'>
                    <Storycard />
                  </SwiperSlide>
                  <SwiperSlide className='storycard-layout'>
                    <Storycard />
                  </SwiperSlide> */}
                </Swiper>
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