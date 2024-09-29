import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { getForums } from '../service/forumService';

type ForumContextType = {
  forums: Forum[]
}

type ForumContextProps = {
  children: ReactNode;
}

const ForumContext = createContext<ForumContextType | undefined>(undefined);

export const ForumContextProvider: React.FC<ForumContextProps> = ({ children }) => {
  const [forums, setForums] = useState<Forum[]>([]);

  useEffect(() => {
    fetchForums();
  }, [])

  const fetchForums = async () => {
    const forums = await getForums();
    console.log(forums)
    setForums(forums.response ?? []);
  };

  return (
    <ForumContext.Provider value={{ forums }}>
      {children}
    </ForumContext.Provider>
  );
};

export const useForumContext = () => {
  const context = useContext(ForumContext);
  if (!context) {
    throw new Error('useForumContext must be used within a ForumProvider');
  }
  return context;
};
