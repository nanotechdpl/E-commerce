import React from 'react'
interface Props {
  title: string;
  onClick?: () => void; 
}

const OrangeButton: React.FC<Props> = ({ title, onClick }) => {
  return (
    <button
     className="p-2 border bg-orange-500 hover:bg-orange-600 text-nowrap rounded-md"
     onClick={onClick}
     >{title}</button>

  )
}

export default OrangeButton