import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SendIcon from "@mui/icons-material/Send";
import { getCurrentDate, getCurrentTime } from "../../Utils/GetDateAndTime";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { roomContext } from "../../App";
import ReplyCard from "../ChatReplyCard/ReplyCard";
import UserNav from "../UserSideNav/UserNav";
import "./styles.css";
import ChatCard from "../ChatCard/ChatCard";

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
  const userId = useRef(crypto.randomUUID());
  const [comment, setComment] = useState("");
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [chatReply, setChatReply] = useState({});
  const messageInputRef = useRef(null);
  const chatWindowRef = useRef(null);
  const chatInnerWindow = useRef(null);

  const AddComment = () => {
    if (comment !== "") {
      try {
        socket.emit(
          "message sent",
          {
            id: userId.current,
            userName: roomProviderContext.roomDetails.userName,
            room: roomProviderContext.roomDetails.roomCode,
            message: comment,
            isRepliedChat: Object.keys(chatReply).length > 0 ? true : false,
            repliedMessage: chatReply,
            messageId: uuidv4(),
          },
          (error) => {
            if (error) console.log(error);
          }
        );

        setChatReply({});
      } catch (err) {
        console.log(err);
      }
      setComment("");
    }
  };

  const handleMessage = (event) => {
    if (event.key === "Enter") {
      AddComment();
    } else {
      return;
    }
  };

  const handleChatReply = (chatTime, chatContent, userName, chatDate) => {
    messageInputRef.current.focus();
    const replyObject = {
      userName: userName,
      chatTime: chatTime,
      message: chatContent,
      chatDate: chatDate,
    };
    setChatReply(replyObject);
  };

  const closeReplyCard = () => {
    setChatReply({});
  };

  // useEffect(() => {
  //   scrollToBottom();
  // }, []);

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
    if (
      !roomProviderContext.roomDetails.userName ||
      !roomProviderContext.roomDetails.roomCode
    ) {
      navigate("/");
    } else {
      try {
        socket.emit(
          "join",
          {
            id: userId.current,
            userName: roomProviderContext.roomDetails.userName,
            room: roomProviderContext.roomDetails.roomCode,
          },
          (users) => {
            console.log(users);
            if (users)
              setUsers([
                {
                  id: userId.current,
                  userName: "You",
                },
                ...users,
              ]);
          }
        );
      } catch (err) {
        console.log(err);
      }
      socket.on("user joined", ({ joinedUserId, joinedUserName }) => {
        if (userId.current !== joinedUserId) {
          setChats((prevChats) => [
            ...prevChats,
            {
              id: joinedUserId,
              userName: joinedUserName,
              type: "action",
              action: "join",
            },
          ]);
          setUsers((currentUsers) => [
            ...currentUsers,
            { id: joinedUserId, userName: joinedUserName },
          ]);
        }
      });
      socket.on(
        "message received",
        ({
          id,
          userName,
          message,
          isRepliedChat,
          repliedMessage,
          messageId,
        }) => {
          const currentTime = getCurrentTime();
          const currentDate = getCurrentDate();

          setChats((prevChats) => [
            ...prevChats,
            {
              id,
              userName,
              type: "message",
              action: null,
              message,
              time: currentTime,
              date: currentDate,
              isRepliedChat,
              repliedMessage,
              messageId,
            },
          ]);
        }
      );
      socket.on(
        "user disconnected",
        ({ disconnectedUserId, disconnectedUserName }) => {
          if (userId !== disconnectedUserId) {
            setChats((prevChats) => [
              ...prevChats,
              {
                id: disconnectedUserId,
                userName: disconnectedUserName,
                type: "action",
                action: "disconnect",
              },
            ]);
            setUsers((currentUsers) =>
              currentUsers.filter((user) => user.id !== disconnectedUserId)
            );
          }
        }
      );
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
              {chats.map((chat, index) => {
                if (chat.type === "message") {
                  if (chat.id === userId.current) {
                    return (
                      <ChatCard
                        data={chat}
                        chatType={"message"}
                        handleChatReply={handleChatReply}
                      />
                    );
                  } else {
                    return (
                      <ChatCard
                        data={chat}
                        chatType={"reply"}
                        handleChatReply={handleChatReply}
                      />
                    );
                  }
                } else if (chat.type === "action" && chat.action === "join")
                  return (
                    <div
                      key={uuidv4()}
                      className="flex w-full justify-center text-slate-400"
                    >
                      <span>{chat.userName} just joined the rooom !!!</span>
                    </div>
                  );
                else if (chat.type === "action" && chat.action === "disconnect")
                  return (
                    <div
                      key={uuidv4()}
                      className="flex w-full justify-center text-slate-400"
                    >
                      <span>{chat.userName} just left the rooom !!!</span>
                    </div>
                  );
                else return null;
              })}
            </div>
            <div className="reply-chat-pannel top-[100vh]">
              {Object.keys(chatReply).length > 0 ? (
                <ReplyCard
                  data={chatReply}
                  closeCard={closeReplyCard}
                  isReplyCard={true}
                />
              ) : (
                ""
              )}
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
              value={comment}
              onChange={(e) => setComment(e.target.value)}
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
