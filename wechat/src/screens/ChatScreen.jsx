import React, { useContext, useEffect, useState } from 'react'
import Avatar from '../components/Avatar';
import { UserContext } from '../context/UserContext'
import Logo from '../components/Logo';
import { uniqBy } from 'lodash';

const ChatScreen = () => {

    const [ws, setWs] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const { id } = useContext(UserContext);
    const [newMessageText, setNewMessageText] = useState('');
    const [messageHistory, setMessageHistory] = useState([]);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8443');
        setWs(ws);

        ws.addEventListener('message', handleMessage);
    }, []);

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
        } else {
            console.log(messageData);
            setMessageHistory(prev => ([...prev, { isOur: false, text: messageData.text }]));
            //setMessageHistory([...messageHistory,{isOur: false, text:messageData.text}]);
        }

    }


    const sendMessage = (event) => {
        event.preventDefault();

        ws.send(JSON.stringify({

            recipient: selectedUserId,
            message: newMessageText,

        }));

        setMessageHistory(prev => ([...prev, { isOur: true, text: newMessageText }]));

        setNewMessageText('');

    }

    const onlineUsersExcludingCurrentUser = { ...onlineUsers };
    delete onlineUsersExcludingCurrentUser[id];


    return (
        <div className='flex h-screen'>
            <div className='bg-white w-1/3 pt-4 flex flex-col'>
                <Logo />
                {
                    Object.keys(onlineUsersExcludingCurrentUser).map(userId => (
                        <div onClick={() => setSelectedUserId(userId)} key={userId}
                            className={`flex cursor-pointer ${selectedUserId === userId ? 'bg-blue-100' : ''}`}>
                            {userId === selectedUserId && (
                                <div className='w-1 bg-cyan-600 h-full rounded-r-md pe-1 me-2'></div>
                            )}
                            <Avatar userId={userId} username={onlineUsers[userId]} />
                        </div>
                    ))
                }

            </div>
            <div className='bg-blue-100 w-2/3 flex flex-col p-2'>
                <div className='flex-grow'>
                    {!selectedUserId && (
                        <div className='flex h-full items-center justify-center'>
                            <div className=' text-gray-400'>&larr; Select an user to view conversation</div>
                        </div>
                    )}
                    {!!selectedUserId && (
                        <div>
                            {
                                messageHistory.map(message => (
                                    <div className={`${message.isOur ? 'text-right' : 'text-left'}`}
                                        key={message.messageId}>{message.text}</div>
                                ))
                            }
                        </div>

                    )}
                </div>
                {!!selectedUserId && (
                    <form className='flex gap-2 mb-2 me-2' onSubmit={sendMessage}>

                        <input type='text' placeholder='Type your message here'
                            className='bg-white border flex-grow p-2 rounded-xl'
                            value={newMessageText}
                            onChange={ev => setNewMessageText(ev.target.value)} />

                        <button type='submit' className='bg-blue-500 p-2 text-white rounded-full hover:shadow-blue-700 hover:shadow-2xl hover:animate-pulse'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                            </svg>

                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default ChatScreen