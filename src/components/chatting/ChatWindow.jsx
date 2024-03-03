import React, { useContext, useEffect, useState } from 'react';
import ChatElement from './ChatElement';
import './styles.css';
import { useNavigate } from 'react-router-dom';
import { roomContext } from '../../App';
import { io } from 'socket.io-client';

const ChatWindow = () => {
  const socket = io('http://localhost:3000');
  const roomProviderContext = useContext(roomContext);
  const navigate = useNavigate();
  const [comment, setComment] = useState('');
  const [chats, setChats] = useState([]);
  const AddComment = () => {
    if (comment !== '') {
      socket.emit(
        'chat message',
        {
          name: roomProviderContext.roomDetails.userName,
          room: roomProviderContext.roomDetails.roomCode,
          message: comment,
        },
        (error) => {
          if (error) console.log(error);
        }
      );
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
      socket.emit(
        'join',
        {
          name: roomProviderContext.roomDetails.userName,
          room: roomProviderContext.roomDetails.roomCode,
        },
        (error) => {
          if (error) console.log(error);
        }
      );
      socket.on('chat message', ({ name, ackRoom, message }) => {
        if (roomProviderContext.roomDetails.roomCode !== ackRoom) return;
        console.log(`Message: ${message} from ${name} to room: ${ackRoom}`);
        setChats((prevChats) => [...prevChats, message]);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className='flex items-center gap-5 fixed z-10 bottom-6 right-1/4'>
        <input
          className='border-solid border-2 border-slate-500 rounded-md h-11 w-96'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder='Enter your comment...'
        />
        <button
          className='bg-blue-500 text-white p-2 rounded-md'
          onClick={AddComment}
        >
          Add Comment
        </button>
      </div>
      <div className='m-5 flex flex-col gap-7'>
        {chats.map((message, index) => {
          return (
            <div key={index}>
              <ChatElement message={message} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ChatWindow;
