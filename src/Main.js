import React, { useEffect, useState } from "react";
import Deck from "./components/Deck";
import Players from "./components/Players";
import Card from "./components/Card";
import { io } from "socket.io-client";
import { DeckContext } from "./context/context";
import "./Main.css";
const socket = io("https://dobble-online-28c94078ff2e.herokuapp.com");

function Main() {
  const [isConnected, setIsConnected] = useState(false);
  const [player, setPlayer] = useState("");
  const [players, setPlayers] = useState([]);
  const [playerCard, setPlayerCard] = useState([]);
  const [deckInfo, setDeckInfo] = useState([]);
  const [isPopup, setIsPopup] = useState(false);
  const [message, setMessage] = useState("");

  const addPlayer = async (e) => {
    e.preventDefault();
    socket.emit("setUsername", player);
    setIsConnected(true);
  };
  const checkComparison = (e) => {
    const chosenImage = e.target.src;
    if (
      deckInfo.find((image) => {
        return image.src === chosenImage;
      })
    ) {
      socket.emit("updateScore");
      socket.emit("nextCard");
    }
  };
  useEffect(() => {
    socket.on("playersState", (playersList) => {
      setPlayers(playersList);
    });
    socket.on("message", (updateMessage) => {
      setIsPopup(true);
      setTimeout(() => {
        setIsPopup(false);
      }, 4000);
      setMessage(updateMessage);
    });
    socket.on("winner", (winner) => {
      setIsPopup(true);
      setMessage(
        winner.length === 1
          ? `${winner.name} ניצח!`
          : `${winner
              .forEach((w) => {
                return "ו" + w.name;
              })
              .slice(1)} ניצחו!`
      );
    });
    socket.emit("getPlayers");
  });
  useEffect(() => {
    socket.on("drawnCard", (newCard) => {
      setPlayerCard(newCard);
    });
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
            <div id="game-header">
              <h2>קופה</h2>
              <Players players={players} />
            </div>
          </header>
          <DeckContext.Provider value={{ deckInfo, setDeckInfo }}>
            <div id="deck-container">
              <div id="deck-flex">
                <Deck players={players} />
              </div>
              {playerCard.length > 0 ? (
                <Card images={playerCard} onclick={(e) => checkComparison(e)} />
              ) : null}
              <div id="popup" className={isPopup ? "change" : ""}>
                {message}
              </div>
            </div>
          </DeckContext.Provider>
        </div>
      )}
    </div>
  );
}

export default Main;
