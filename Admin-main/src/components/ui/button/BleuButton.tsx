import React from 'react'
interface Props {
  title: string;
  onClick?: () => void; 
}

const BleuButton: React.FC<Props> = ({ title, onClick }) => {
  return (
    <button
    className="rounded-md bg-indigo-500 mx-20 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-100"
    onClick={onClick}
     >{title}</button>

  )
}

export default BleuButton