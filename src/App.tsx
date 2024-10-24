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
          <Route path="/username" element={<SignUp />} />

          {/* FORUM */}
          <Route path="/forum" element={<ForumHome />} />
          <Route path="/forum/:_id" element={<Forum />} />

          {/* RESOURCE */}
          <Route path="/resource" element={<ResourceHome />} />
          <Route path="/forum/:_id" element={<Forum />} />

          
          <Route path="/help-and-support" element={<HelpAndSupport />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
