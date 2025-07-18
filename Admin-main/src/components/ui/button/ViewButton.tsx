import React from 'react'
interface Props {
  title: string;
  onClick?: () => void; 
}
const viewButton: React.FC<Props> = ({ title, onClick }) => {
  return (
    <button 
    className="bg-[#3949ac] text-white hover:bg-white  hover:text-blue-600 hover:shadow-md rounded-md  py-1 px-3 text-[14px] transition-all" 
    onClick={onClick}>
    {title}                
    </button>
  )
}

export default viewButton
