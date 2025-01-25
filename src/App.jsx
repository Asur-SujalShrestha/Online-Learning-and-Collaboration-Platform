import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import VideoStream from './Components/VideoStream'
import Login from './Components/Authentications/Login'
import { Toaster } from "react-hot-toast";

function App() {
  const [count, setCount] = useState(0)

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
      <Login/>
    </>
  )
}

export default App
