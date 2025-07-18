import React from 'react';
interface headerProps{
    title:string;
}
const Header:React.FC<headerProps> = ({title}) => {
    return (
        <div>
            <h2 className='text-xl font-bold'>{title}</h2>
        </div>
    );
};

export default Header;