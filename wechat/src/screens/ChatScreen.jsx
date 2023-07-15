import React, { useEffect, useState } from 'react'
import Avatar from '../components/Avatar';

const ChatScreen = () => {

    const [ws, setWs] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8443');
        setWs(ws);

        ws.addEventListener('message', handleMessage);
    }, [])

    const showOnlineUsers = usersArray => {
        const user = {};
        usersArray.forEach(({ userId, username }) => {
            user[userId] = username;
        });

        setOnlineUsers(user);
    }

    const handleMessage = event => {

        const messageData = JSON.parse(event.data);
        if ('online' in messageData) {
            showOnlineUsers(messageData.online);
        }
    }

    

    return (
        <div className='flex h-screen'>
            <div className='bg-white w-1/3 pt-4 flex flex-col'>
                <div className='flex gap-2 items-center text-blue-600 font-bold text-2xl'>
                    <div className='ps-4 w-fit h-auto'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
                            <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
                        </svg>
                    </div>
                    WeChat
                </div>
                {
                    Object.keys(onlineUsers).map(userId => (
                        <div onClick={()=> setSelectedUserId(userId)} 
                        className={`cursor-pointer ps-2 ${selectedUserId === userId ?'bg-blue-100' : ''}`}>
                            <Avatar key={userId} userId={userId} username={onlineUsers[userId]} />
                        </div>
                    ))
                }

            </div>
            <div className='bg-blue-300 w-2/3 flex flex-col p-2'>
                <div className='bg-blue-200 flex-grow'>
                    messages will show up here
                </div>
                <div className='flex gap-2'>
                    <input type='text' placeholder='Type your message here'
                        className='bg-white border flex-grow p-2 rounded-xl' />
                    <button className='bg-blue-500 p-2 text-white rounded-full'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                        </svg>

                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChatScreen