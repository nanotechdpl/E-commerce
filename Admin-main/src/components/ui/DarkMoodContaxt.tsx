import React, {useEffect, useState} from 'react'

import { IoMoonOutline, IoSunnyOutline } from 'react-icons/io5';

const DarkMoodButton: React.FC = () => {
  const [darkMode, setDarkMode]= useState<boolean |  null>(null);
 useEffect(()=>{
  const theme = localStorage.getItem('theme');
  if (theme === "dark") setDarkMode(true) 
 },[])
useEffect(()=>{
  if (darkMode) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }else{
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme','light')
  }
}, [darkMode])

  return (
    <span className={`text-2xl } hover:scale-125 text-white`} onClick={()=>setDarkMode(!darkMode)}>
           {darkMode? <IoSunnyOutline/>: <IoMoonOutline/> }
    </span>
  )
}

export default DarkMoodButton
