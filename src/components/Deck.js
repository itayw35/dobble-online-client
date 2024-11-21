import React, { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import Card from "./Card";
import "./Deck.css";
import { DeckContext } from "../context/context";
const socket = io("http://localhost:3500");

function Deck(props) {
  const [isStarted, setIsStarted] = useState(false);
  const [seconds, setSeconds] = useState(3);
  const { deckInfo, setDeckInfo } = useContext(DeckContext);
  useEffect(() => {
    socket.on("deckState", (deck) => {
      setDeckInfo(deck);
    });
    socket.emit("getDeck");
    return () => socket.off("deckState");
  }, []);
  useEffect(() => {
    socket.on("startCountdown", (startTime) => {
      const interval = setInterval(() => {
        const remaining = Math.ceil((startTime - Date.now()) / 1000);
        setSeconds(remaining);

        if (remaining <= 0) {
          clearInterval(interval); // Stop countdown
        }
      }, 100);

      return () => clearInterval(interval);
    });
    socket.on("startGame", () => {
      setIsStarted(true);
    });
  }, []);

  return (
    <div id="cards-deck">
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
