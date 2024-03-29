import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SendIcon from "@mui/icons-material/Send";
import { getCurrentDate, getCurrentTime } from "../../Utils/GetDateAndTime";
import { io } from "socket.io-client";
import { roomContext } from "../../App";
import ReplyCard from "../ChatReplyCard/ReplyCard";
import UserNav from "../UserSideNav/UserNav";
import ChatCard from "../ChatCard/ChatCard";
import "./styles.css";

const ChatWindow = () => {
  const url = process.env.REACT_APP_PROD_API_URL;
  console.log(`The url is ${url}`);
  const socket = io(url, { transports: ["websocket"] });

  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
    console.log(JSON.stringify(err));
  });

  const roomProviderContext = useContext(roomContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState({text: "", replyDetails: null });
  const [chatData, setChatData] = useState([]);
  const [users, setUsers] = useState([]);
  const messageInputRef = useRef(null);
  const chatWindowRef = useRef(null);
  const chatInnerWindow = useRef(null);

  const getParentChat = (id) => chatData.find((chat) => chat.id === id);

  const AddComment = () => {
    if (message.text !== "") {
      try {
        socket.emit(
          "message sent",
          {
            ...roomProviderContext.roomDetails,
            id: crypto.randomUUID(),
            message: message.text,
            parentId: message.replyDetails?.id ?? null,
          },
          (error) => {
            if (error) console.log(error);
          }
        );
      } catch (err) {
        console.log(err);
      }
      setMessage({ text: "", replyDetails: null });
    }
  };

  const handleMessage = (event) => {
    if (event.key === "Enter") {
      AddComment();
    } else {
      return;
    }
  };

  const handleChatReply = (date, time, id, alias, message) => {
    messageInputRef.current.focus();
    setMessage({
      ...message,
      replyDetails: {
        id,
        message,
        alias,
        date,
        time,
      },
    });
  };

  const closeReplyCard = () => {
    setMessage({ ...message, replyDetails: null });
  };

  useEffect(() => {
    if (
      !roomProviderContext.roomDetails.userId ||
      !roomProviderContext.roomDetails.alias ||
      !roomProviderContext.roomDetails.roomCode
    ) {
      navigate("/");
    } else {
      try {
        socket.emit("join", roomProviderContext.roomDetails, (users) => {
          if (users)
            setUsers([
              {
                userId: roomProviderContext.roomDetails.userId,
                alias: "You",
              },
              ...users,
            ]);
        });
      } catch (err) {
        console.log(err);
      }
      socket.on("user joined", ({ userId, alias }) => {
        if (roomProviderContext.roomDetails.userId !== userId) {
          setChatData((prevChats) => [
            ...prevChats,
            {
              id: crypto.randomUUID(),
              userId,
              alias: alias,
              action: "join",
            },
          ]);
          setUsers((currentUsers) => [...currentUsers, { userId, alias }]);
        }
      });
      socket.on(
        "message received",
        ({ userId, alias, id, message, parentId }) => {
          const currentTime = getCurrentTime();
          const currentDate = getCurrentDate();
          setChatData((prevChats) => [
            ...prevChats,
            {
              id,
              alias,
              message,
              action: "message",
              time: currentTime,
              date: currentDate,
              userId,
              parentId,
              replies: [],
            },
          ]);
        }
      );
      socket.on("user disconnected", ({ userId, alias }) => {
        if (roomProviderContext.roomDetails.userId !== userId) {
          setChatData((prevChats) => [
            ...prevChats,
            {
              id: crypto.randomUUID(),
              userId,
              alias: alias,
              action: "leave",
            },
          ]);
          setUsers((currentUsers) =>
            currentUsers.filter((user) => user.userId !== userId)
          );
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex items-center px-6 border-b h-14">
          <span className="text-lg font-semibold">
            {roomProviderContext.roomDetails.roomCode}
          </span>
        </div>
        <div className="flex flex-1">
          <UserNav users={users} />
          <div
            className="flex-1 min-h-0 p-4 overflow-auto relative chat-window-container"
            ref={chatWindowRef}
          >
            <div className="flex flex-col gap-2" ref={chatInnerWindow}>
              {chatData.map((data) => {
                if (data.action === "message") {
                  return (
                    <ChatCard
                      key={data.id}
                      data={data}
                      getParentChat={getParentChat}
                      handleChatReply={handleChatReply}
                    />
                  );
                } else
                if (data.action === "join")
                  return (
                    <div
                      key={crypto.randomUUID()}
                      className="flex w-full justify-center text-slate-400"
                    >
                      <span>{data.alias} just joined the rooom !!!</span>
                    </div>
                  );
                else if (data.action === "leave")
                  return (
                    <div
                      key={crypto.randomUUID()}
                      className="flex w-full justify-center text-slate-400"
                    >
                      <span>{data.alias} just left the rooom !!!</span>
                    </div>
                  );
                else return null;
              })}
            </div>
            <div className="reply-chat-pannel top-[100vh]">
              <ReplyCard
                data={message.replyDetails}
                closeCard={closeReplyCard}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center h-14 px-4 border-t justify-end w-full">
          <div className="flex items-center space-x-2">
            <button className="rounded-full" size="icon" variant="ghost">
              <SentimentSatisfiedAltIcon sx={{ width: "24" }} />
              <span className="sr-only">Toggle emoji picker</span>
            </button>
            <input
              className="w-[400px] max-w-none border border-slate-400 rounded-md p-1"
              placeholder="Message in Blank..."
              value={message.text}
              onChange={(e) => setMessage({ ...message, text: e.target.value })}
              onKeyDown={handleMessage}
              ref={messageInputRef}
            />
            <button className="rounded-full" size="icon" onClick={AddComment}>
              <SendIcon sx={{ width: "24" }} />
              <span className="sr-only">Send message</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
