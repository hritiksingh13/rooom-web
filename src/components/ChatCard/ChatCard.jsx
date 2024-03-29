import React, { useContext, useMemo } from "react";
import ReplyCard from "../ChatReplyCard/ReplyCard";
import { roomContext } from "../../App";

export default function ChatCard({ data, getParentChat, handleChatReply }) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const parentChat = useMemo(
    () => getParentChat(data.parentId),
    [data.parentId]
  );
  const roomProviderContext = useContext(roomContext);
  return (
    <div
      className={`flex ${
        roomProviderContext.roomDetails.userId === data.userId
          ? "justify-end"
          : "justify-start"
      } gap-2`}
    >
      <div className="flex flex-col">
        {roomProviderContext.roomDetails.userId !== data.userId && (
          <div className="text-sm font-semibold">{data.alias}</div>
        )}

        {parentChat ? (
          <div className="bg-gray-100 rounded-lg p-4 text-sm break-words dark:bg-gray-800 dark:text-white ">
            <ReplyCard data={parentChat} />
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
              handleChatReply(
                data.date,
                data.time,
                data.id,
                data.alias,
                data.message
              )
            }
          >
            Reply
          </div>
        </div>
      </div>
    </div>
  );
}
