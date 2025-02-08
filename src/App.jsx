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
            </Routes>
        </BrowserRouter>

    </>
  )
}

export default App
