import { Route, Routes } from 'react-router-dom'
import './App.css'
import Profile from './app/(main)/profile'
import Login from './app/login'
import { Outlet } from 'react-router-dom';
import Home from './app/(main)/home';
import SignUp from './app/signup';
import ForumHome from './app/(main)/forum/Home';
import Forum from './app/(main)/forum/Forum';
import ResourceHome from './app/(main)/resources';
import HelpAndSupport from './app/(main)/help-and-support';
import Username from './app/username';
import ProfilePhoto from './app/profile-photo';
import Interest from './app/interest';
import Bio from './app/bio';
import Chat from './app/(main)/chat/chat';


function App() {

  const Layout = () => (
    <div>
      <Outlet />
    </div>
  );
  return (
    <>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/username" element={<Username />} />
            <Route path="/profile-photo" element={<ProfilePhoto />} />
            <Route path="/interest" element={<Interest />} />
            <Route path="/bio" element={<Bio />} />
            {/* <Route path="/chat" element={<ChatPage />} /> */}
            <Route path="/chat" element={<Chat />} />


            {/* FORUM */}
            <Route path="/forum" element={<ForumHome />} />
            <Route path="/forum/:_id" element={<Forum />} />

            {/* RESOURCE */}
            <Route path="/resource" element={<ResourceHome />} />


            <Route path="/help-and-support" element={<HelpAndSupport />} />
          </Route>
        </Routes>
    </>
  )
}

export default App
