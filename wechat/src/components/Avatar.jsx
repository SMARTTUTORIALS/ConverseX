import React from 'react'

const Avatar = ({ userId, username }) => {

    return (
        <div className='flex border-b border-gray-100 py-2 items-center'>
            <div className='font-bold text-white text-center rounded-full h-10 w-10 m-2 p-2'
                style={ {backgroundColor: `#${userId.substring(0,6)}`} }>
                {username[0].toUpperCase()}
            </div>
            <div >
                <span>{username}</span>
            </div>
        </div>
    )
}

export default Avatar