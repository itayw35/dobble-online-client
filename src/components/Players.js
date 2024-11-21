import React from "react";
import "./Players.css";
function Players(props) {
  return (
    <div>
      {props.players.length > 0
        ? props.players.map((player) => {
            return (
              <div className="player-view">
                {player.name} : {player.score}
              </div>
            );
          })
        : null}
    </div>
  );
}

export default Players;
