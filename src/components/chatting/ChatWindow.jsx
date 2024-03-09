import React, { useContext, useEffect, useRef, useState } from 'react';
import './styles.css';
import { useNavigate } from 'react-router-dom';
import { roomContext } from '../../App';
import { io } from 'socket.io-client';

function SmileIcon(props) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <circle cx='12' cy='12' r='10' />
      <path d='M8 14s1.5 2 4 2 4-2 4-2' />
      <line x1='9' x2='9.01' y1='9' y2='9' />
      <line x1='15' x2='15.01' y1='9' y2='9' />
    </svg>
  );
}

function PlaneIcon(props) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='white'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z' />
    </svg>
  );
}

const ChatWindow = () => {
  const url =
    process.env.NODE_ENV === 'dev'
      ? process.env.DEV_API_URL
      : process.env.PROD_API_URL;
  console.log(`The url is ${url}`);
  const socket = io(
    process.env.NODE_ENV === 'dev'
      ? process.env.DEV_API_URL
      : process.env.PROD_API_URL
  );
  socket.on('connect_error', (err) => {
    console.log(`connect_error due to ${err.message}`);
  });
  const roomProviderContext = useContext(roomContext);
  const navigate = useNavigate();
  const userId = useRef(crypto.randomUUID());
  const [comment, setComment] = useState('');
  const [chats, setChats] = useState([]);
  const AddComment = () => {
    if (comment !== '') {
      try {
        socket.emit(
          'message sent',
          {
            id: userId.current,
            userName: roomProviderContext.roomDetails.userName,
            room: roomProviderContext.roomDetails.roomCode,
            message: comment,
          },
          (error) => {
            if (error) console.log(error);
          }
        );
      } catch (err) {
        console.log(err);
      }
      setComment('');
    }
  };

  useEffect(() => {
    if (
      !roomProviderContext.roomDetails.userName ||
      !roomProviderContext.roomDetails.roomCode
    ) {
      navigate('/');
    } else {
      try {
        socket.emit(
          'join',
          {
            id: userId.current,
            userName: roomProviderContext.roomDetails.userName,
            room: roomProviderContext.roomDetails.roomCode,
          },
          (error) => {
            if (error) console.log(error);
          }
        );
      } catch (err) {
        console.log(err);
      }
      socket.on('user joined', ({ joinedUserId, joinedUserName }) => {
        if (userId.current !== joinedUserId)
          setChats((prevChats) => [
            ...prevChats,
            {
              id: joinedUserId,
              userName: joinedUserName,
              type: 'action',
              action: 'join',
            },
          ]);
      });
      socket.on('message received', ({ id, userName, message }) => {
        const currentTime =
          (new Date().getHours() ? new Date().getHours() % 12 : 12) +
          ':' +
          new Date().getMinutes() +
          ' ' +
          (new Date().getHours() > 12 ? 'pm' : 'am');
        setChats((prevChats) => [
          ...prevChats,
          {
            id,
            userName,
            type: 'message',
            action: null,
            message,
            time: currentTime,
          },
        ]);
      });
      socket.on(
        'user disconnected',
        ({ disconnectedUserId, disconnectedUserName }) => {
          if (userId !== disconnectedUserId)
            setChats((prevChats) => [
              ...prevChats,
              {
                id: disconnectedUserId,
                userName: disconnectedUserName,
                type: 'action',
                action: 'disconnect',
              },
            ]);
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className='flex flex-col h-full'>
        <div className='flex items-center px-6 border-b h-14'>
          <span className='text-lg font-semibold'>
            {roomProviderContext.roomDetails.roomCode}
          </span>
        </div>
        <div className='flex-1 min-h-0 p-4 overflow-auto'>
          <div className='flex flex-col gap-2'>
            {chats.map((chat, index) => {
              if (chat.type === 'message') {
                if (chat.id === userId.current) {
                  return (
                    <div key={index} className='flex justify-end gap-2'>
                      <div className='flex flex-col'>
                        <div className='bg-gray-100 rounded-lg p-4 text-sm break-words dark:bg-gray-800'>
                          {chat.message}
                        </div>
                        <div className='flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400'>
                          <div>{chat.time}</div>
                          <div className='underline'>Reply</div>
                        </div>
                      </div>
                    </div>
                  );
                } else
                  return (
                    <div key={index} className='flex justify-start gap-2'>
                      <div className='flex flex-col'>
                        <div className='text-sm font-semibold'>
                          {chat.userName}
                        </div>
                        <div className='bg-gray-100 rounded-lg p-4 text-sm break-words dark:bg-gray-800'>
                          {chat.message}
                        </div>
                        <div className='flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400'>
                          <div>{chat.time}</div>
                          <div className='underline'>Reply</div>
                        </div>
                      </div>
                    </div>
                  );
              } else if (chat.type === 'action' && chat.action === 'join')
                return (
                  <div className='flex w-full justify-center text-slate-400'>
                    <span>{chat.userName} just joined the rooom !!!</span>
                  </div>
                );
              else if (chat.type === 'action' && chat.action === 'disconnect')
                return (
                  <div className='flex w-full justify-center text-slate-400'>
                    <span>{chat.userName} just left the rooom !!!</span>
                  </div>
                );
              else return null;
            })}
          </div>
        </div>
        <div className='flex items-center h-14 px-4 border-t'>
          <button className='rounded-full' size='icon' variant='ghost'>
            <SmileIcon className='h-6 w-6' />
            <span className='sr-only'>Toggle emoji picker</span>
          </button>
          <div className='ml-auto flex items-center space-x-2'>
            <input
              className='w-[400px] max-w-none border border-slate-400 rounded-md p-1'
              placeholder='Message in Blank...'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              className='rounded-full bg-black'
              size='icon'
              onClick={AddComment}
            >
              <PlaneIcon className='h-6 w-6 m-1' />
              <span className='sr-only'>Send message</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
