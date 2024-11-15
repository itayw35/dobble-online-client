import React, { useEffect, useState } from "react";
import Deck from "./components/Deck";
import Players from "./components/Players";
import { io } from "socket.io-client";
import "./Main.css";
const socket = io("http://localhost:3500");

function Main() {
  const [isConnected, setIsConnected] = useState(false);
  const [player, setPlayer] = useState("");
  const [players, setPlayers] = useState([]);
  const addPlayer = async (e) => {
    e.preventDefault();
    socket.emit("setUsername", player);
    setIsConnected(true);
  };
  useEffect(() => {
    socket.on("playersState", (playersList) => {
      setPlayers(playersList);
    });
    socket.emit("getPlayers");
  });
  return (
    <div>
      {!isConnected ? (
        <div id="form-container">
          <form id="players-input">
            <input
              type="text"
              placeholder="   שם משתמש"
              autoFocus
              onChange={(e) => {
                setPlayer(e.target.value);
              }}
            />
            <button onClick={addPlayer}>אישור</button>
          </form>
        </div>
      ) : (
        <div>
          <header>
            <Players players={players} />
          </header>
          <div id="deck-container">
            <div id="deck-flex">
              <Deck players={players} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Main;
