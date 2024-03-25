import React from "react";
import ReplyCard from "../ChatReplyCard/ReplyCard";

export default function ChatCard({ data, handleChatReply, chatType }) {
  return (
    <div
      key={data.messageId}
      className={`flex ${
        chatType === "message" ? "justify-end" : "justify-start"
      } gap-2`}
    >
      <div className="message-container flex flex-col">
        {data.isRepliedChat ? (
          <div className="bg-gray-100 rounded-lg p-4 text-sm break-words dark:bg-gray-800 dark:text-white ">
            <ReplyCard data={data.repliedMessage} isReplyCard={false} />
            {data.message}
          </div>
        ) : (
          <div className="bg-gray-100 rounded-lg p-4 text-sm break-words dark:bg-gray-800 dark:text-white ">
            {data.message}
          </div>
        )}
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <div>{data.time}</div>
          <div
            className="chat-reply-container underline cursor-pointer"
            onClick={() =>
              handleChatReply(data.time, data.message, data.userName, data.date)
            }
          >
            Reply
          </div>
        </div>
      </div>
    </div>
  );
}
