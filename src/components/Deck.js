import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Card from "./Card";
import "./Deck.css";
const socket = io("http://localhost:3500");

function Deck(props) {
  const [deckInfo, setDeckInfo] = useState([]);
  const [isStarted, setIsStarted] = useState(false);
  const [seconds, setSeconds] = useState(3);
  useEffect(() => {
    socket.on("deckState", (deck) => {
      setDeckInfo(deck);
    });
    socket.emit("getDeck");
    return () => socket.off("deckState");
  }, []);
  useEffect(() => {
    if (!isStarted && props.players.length === 1) {
      //change to 2 players
      let interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
      const timeout = setTimeout(() => {
        setIsStarted(true);
        clearInterval(interval);
      }, 3000);
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [props.players.length, isStarted]);
  useEffect(() => {
    socket.emit("getFirstMove");
  }, [isStarted]);
  return (
    <div id="cards-deck">
      <h2>קופה</h2>
      {!isStarted ? (
        <div>
          <span id="countdown">{seconds}</span>
          <Card images={[]} />
        </div>
      ) : (
        <Card images={deckInfo} />
      )}
    </div>
  );
}

export default Deck;
