import React from "react";

function Players(props) {
  return (
    <div>
      {props.players.length > 0
        ? props.players.map((player) => {
            return (
              <div>
                {player.name} : {player.score}
              </div>
            );
          })
        : null}
    </div>
  );
}

export default Players;
