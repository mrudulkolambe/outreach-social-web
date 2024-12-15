import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useLocation, useNavigate } from 'react-router-dom';
import { ApiResponse, getUser, updateUserData } from '../service/authService';
import { postReq } from '../utils/api';
import { endpoints } from '../config/endpoints';
import { useAgoraContext } from './Agora';
import { registerAgoraUserService } from '@/service/agoraService';

interface AuthContextType {
  login: (email: string, password: string) => Promise<void>;
  createAcc: (email: string, password: string) => Promise<void>;
  updateUser: (data: any) => Promise<ApiResponse>;
  logout: () => Promise<void>;
  user: MainUser | null;
  baseUser: BaseUser | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [user, setUser] = useState<MainUser | null>(null);
  const [baseUser, setBaseUser] = useState<BaseUser | null>(null);
  const { loginAgoraUser } = useAgoraContext();
  const handlePendingData = (currentUser: ApiResponse) => {
    if (currentUser.response?.username && currentUser.response?.name) {
      navigate("/")
    } else {
      navigate('/username');
    }
  }
  useEffect(() => {
    onAuthStateChanged(auth, async (authUser: User | null) => {
      if (authUser) {
        const currentUser = await getUser();
        console.log(currentUser.response._id, "CURRENT USER")
        registerAgoraUserService(currentUser.response._id);
        setUser(currentUser.response); // Setting User object received from backend
        setBaseUser(currentUser.response); // Setting User object received from backend
        if (['/login', '/signup'].includes(pathname)) {
          handlePendingData(currentUser)
        } else if (pathname === "/") {
          console.log("USER", currentUser.response)
          if (!currentUser.response?.username && !currentUser.response?.name) {
            navigate("/username")
          }
        }
      } else {
        setUser(null); // Setting state explicitly to null on sign-out
        if (!['/login', '/signup'].includes(pathname)) {
          navigate('/login');
        }
      }
    });

  }, []);

  const createAcc = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        console.log(user)
        await postReq(endpoints['register-user'], {});
        navigate("/username")
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log(errorCode)
      });
  }

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    navigate('/'); // Navigate to home after login
  };

  const updateUser = async (data: any) => {
    const newData = await updateUserData({ updateData: data })
    setBaseUser(newData.response);
    return newData;
  }

  const logout = async () => {
    await signOut(auth);
    setUser(null); // Explicitly setting state to null on logout
    navigate('/login'); // Navigate to login after logout
  };

  return (
    <AuthContext.Provider value={{ login, logout, user, createAcc, baseUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
