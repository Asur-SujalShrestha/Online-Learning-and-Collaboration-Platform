import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import VideoStream from './Components/VideoStream'
import Login from './Components/Authentications/Login'
import { Toaster } from "react-hot-toast";
import Home from './Components/Pages/Home'
import Header from './Components/Pages/Header'
import Profile from './Components/Pages/Profile'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PostDetail from './Components/Pages/PostDetail'
import Program from './Components/Pages/Program'
import ProgramDetail from './Components/Pages/ProgramDetail'
import TeacherContentDetail from './Components/Pages/TeacherContentDetail'

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* <VideoStream/> */}
      <Toaster position="top-center"
        toastOptions={{
          duration: 5000,
          style: {
            fontSize: '19px',
            padding: '15px',
            borderRadius: '8px',
            background: '#333',
            color: '#fff',
          },
        }} />
      {/* <Login/> */}
      {/* <Home/> */}
      {/* <Profile /> */}
      <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path='/home' element={<Home/>}/>
                <Route path="/profile" element={<Profile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/postDetail/:postId" element={<PostDetail/>}/>
                <Route path='/program' element={<Program />} />
                <Route path="/programDetail/:programId" element={<ProgramDetail />} />
            </Routes>
        </BrowserRouter>

    </>
  )
}

export default App
