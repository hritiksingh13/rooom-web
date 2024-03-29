import React, { createContext, useState } from "react";
import "./App.css";
import Home from "./components/home/home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ChatWindow from "./components/chatting/ChatWindow";

export const roomContext = createContext();
function App() {
  const [roomDetails, setRoomDetails] = useState({
    roomCode: "",
    alias: "",
    userId: "",
  });
  const joinRoom = (roomCode, userId, alias) =>
    setRoomDetails({ roomCode, userId, alias });

  return (
    <roomContext.Provider value={{ roomDetails, joinRoom }}>
      <Router>
        <div className="app">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/room/:code" element={<ChatWindow />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </roomContext.Provider>
  );
}

export default App;
