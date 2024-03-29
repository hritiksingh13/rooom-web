import React from "react";
import CloseIcon from "@mui/icons-material/Close";

export default function ReplyCard({ data, closeCard }) {
  if (!data) return null;
  return (
    <div className="chat-reply-container p-1 shadow-md bg-gray-100 rounded dark:bg-black">
      <div className="inner-container relative border-l-2 border-gray-400 pl-3 py-1 pr-7">
        {closeCard && (
          <button
            className="absolute top-0 right-0"
            onClick={(_e) => {
              // e.stopPropagation();
              closeCard();
            }}
          >
            <div className="close-btn dark:text-white">
              <CloseIcon />
            </div>
          </button>
        )}
        <div className="reply-chat-title flex text-xs">
          <div className="user-name mr-1 dark:text-white">{data.alias}</div>
          <div className="message-metadata ml-1 dark:text-white">
            {data.date + " " + data.time}
          </div>
        </div>
        <div className="chat-reply-content text-sm dark:text-white">
          {data.message}
        </div>
      </div>
    </div>
  );
}
