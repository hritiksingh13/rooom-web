import React, { useContext, useState } from "react";
import { roomContext } from "../../App";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

export default function Home() {
  const navigate = useNavigate();
  const [joinRoomDetails, setJoinRoomDetails] = useState({
    roomCode: "",
    alias: "",
  });
  const [createRoomDetails, setCreateRoomDetails] = useState({
    roomName: "",
    alias: "",
  });
  const roomProviderContext = useContext(roomContext);

  const joinRoom = () => {
    if (joinRoomDetails.roomCode && joinRoomDetails.alias) {
      roomProviderContext.joinRoom(
        joinRoomDetails.roomCode,
        crypto.randomUUID(),
        joinRoomDetails.alias
      );
      navigate(`/room/${joinRoomDetails.roomCode}`);
    } else toast.error("Room code and user name are mandatory!");
  };

  return (
    <div className="flex flex-col justify-center items-center h-full gap-10">
      <span className="text-4xl">Join or Create room</span>
      <div className="flex gap-5">
        <div className="p-4 border-solid border-2 border-grey-600 rounded-md w-96">
          <span className="text-2xl font-medium">Join Room</span>
          <p className="text-zinc-400 text-sm">Join your friend's room.</p>
          <div className="flex flex-col mt-5 gap-1">
            <label>User Name</label>
            <input
              className="border-solid border-2 border-slate-500 rounded-md"
              placeholder="Enter the user name"
              value={joinRoomDetails.alias}
              onChange={(e) =>
                setJoinRoomDetails({
                  ...joinRoomDetails,
                  alias: e.target.value,
                })
              }
            ></input>
            <label>Room Code</label>
            <input
              className="border-solid border-2 border-slate-500 rounded-md"
              placeholder="Enter the room code"
              value={joinRoomDetails.roomCode}
              onChange={(e) =>
                setJoinRoomDetails({
                  ...joinRoomDetails,
                  roomCode: e.target.value,
                })
              }
            ></input>

            <button
              onClick={joinRoom}
              className="text-white bg-slate-600 rounded-md"
            >
              Join room
            </button>
          </div>
        </div>
        <div className="p-4 border-solid border-2 border-grey-600 rounded-md w-96">
          <span className="text-2xl font-medium">Create Room</span>
          <p className="text-zinc-400 text-sm">Create your own room.</p>
          <div className="flex flex-col mt-5 gap-1">
            <label>User Name</label>
            <input
              className="border-solid border-2 border-slate-500 rounded-md"
              placeholder="Enter the user name"
              value={createRoomDetails.alias}
              onChange={(e) =>
                setCreateRoomDetails({
                  ...createRoomDetails,
                  alias: e.target.value,
                })
              }
            ></input>
            <label>Room Name</label>
            <input
              className="border-solid border-2 border-slate-500 rounded-md"
              placeholder="Enter the room name"
              value={createRoomDetails.roomName}
              onChange={(e) =>
                setCreateRoomDetails({
                  ...createRoomDetails,
                  roomName: e.target.value,
                })
              }
            ></input>

            <button className="text-white bg-slate-600 rounded-md">
              Create room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
