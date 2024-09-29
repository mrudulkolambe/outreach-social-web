import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createPost, getPosts, GetPostsResponse } from '../service/postService';
import { toast } from 'sonner';
import { uploadMultipleFiles } from '@/service/uploadService';
import { useAuthContext } from './Auth';
import moment from 'moment';

type FeedContextType = {
  posts: GetPostsResponse | null;
  uploading: boolean;
  uploadProgress: number;
  fetchPosts: () => Promise<void>;
  handlePost: (media: SelectedFile[], content: string, isPublic: boolean) => Promise<number>;
  updatePost: (updatedPost: Post) => Promise<void>;
  currentPage: number,
  hasMorePost: boolean,
  loadMorePosts: () => Promise<void>;
}

type FeedContextProps = {
  children: ReactNode;
}

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export const FeedContextProvider: React.FC<FeedContextProps> = ({ children }) => {
  const [posts, setPosts] = useState<GetPostsResponse | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [hasMorePost, setHasMorePost] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { user } = useAuthContext()
  const [tempPosts, setTempPosts] = useState<GetPostsResponse | null>(null);

  useEffect(() => {
    if (user) {
      console.log("FEED TRIGGER")
      fetchPosts();
    }
  }, [user]);

  const handlePost = async (media: SelectedFile[], content: string, isPublic: boolean) => {
    setUploading(true)
    try {
      let urls = await uploadMultipleFiles(media, 'posts');
      if (urls) {
        const result = await createPost(content, urls?.results, isPublic, user as MainUser);
        if (result) {
          fetchPosts()
          toast.success("Post published successfully!");
        } else {
          toast.error("Something went wrong, Please try again!")
        }
        setUploading(false)
        setUploadProgress(0);
      }
      return 200
    } catch (error) {
      setUploading(false)
      return 400
    }
  }

  useEffect(() => {
    if (tempPosts) {
      const sortedPosts = tempPosts?.response.sort((a, b) => Number(moment(b.createdAt).format("x")) - Number(moment(a.createdAt).format("x")));
      const sortedPostsResponse: GetPostsResponse = {
        ...posts as GetPostsResponse,
        response: sortedPosts as Post[]
      }
      setPosts(sortedPostsResponse as GetPostsResponse)
    }
  }, [tempPosts])

  const fetchPosts = async () => {
    if (user) {
      const posts = await getPosts(1);
      setTempPosts(posts);
      setHasMorePost(posts.totalPages > posts.currentPage)
    }
  };

  const updatePost = async (updatedPost: Post) => {
    let tempArr = posts?.response.map((post) => {
      if (post._id === updatedPost._id) {
        return updatedPost;
      } else {
        return post;
      }
    })
    let response: GetPostsResponse = {
      currentPage: posts?.currentPage ?? 0,
      message: "Fetched",
      response: tempArr as Post[],
      success: true,
      totalFeeds: posts?.totalFeeds ?? 0,
      totalPages: posts?.totalPages ?? 0
    }
    setTempPosts(response)
  }

  const loadMorePosts = async () => {
    if (hasMorePost) {
      const nextPage = currentPage + 1;
      const morePostsResponse = await getPosts(nextPage);

      if (morePostsResponse) {
        setTempPosts({ ...morePostsResponse, response: posts?.response.concat(morePostsResponse.response) ?? [] })
        setCurrentPage(nextPage);
        setHasMorePost(morePostsResponse.totalPages > morePostsResponse.currentPage);
      }
    } else {
      console.log("Else Load More Posts");
    }
  };


  return (
    <FeedContext.Provider value={{ posts, uploading, uploadProgress, fetchPosts, handlePost, updatePost, hasMorePost, currentPage, loadMorePosts }}>
      {children}
    </FeedContext.Provider>
  );
};

export const useFeedContext = () => {
  const context = useContext(FeedContext);
  if (!context) {
    throw new Error('useFeedContext must be used within a FeedProvider');
  }
  return context;
};
