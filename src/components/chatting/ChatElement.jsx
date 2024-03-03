import React from 'react';

const ChatElement = ({ message }) => {
  return (
    <>
      <span className='bg-neutral-200 rounded-md p-2'>{message}</span>
    </>
  );
};

export default ChatElement;
