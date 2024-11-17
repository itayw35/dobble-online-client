import React from "react";
import "./Card.css";

function Card(props, { radius = 150 }) {
  return (
    <div
      className={
        props.images.length > 0
          ? "circle-container"
          : "circle-container card-back"
      }
    >
      {props.images.length > 0 ? (
        props.images.map((image, index) => {
          const angle = (2 * Math.PI * index) / props.images.length;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          return (
            <div
              key={index}
              className="circle-item"
              style={{ transform: `translate(${x}px, ${y}px)` }}
            >
              <img
                src={image.src}
                alt={image.alt}
                onClick={props.onclick ? props.onclick : null}
              />
            </div>
          );
        })
      ) : (
        <div id="card-back">Dobble</div>
      )}
    </div>
  );
}

export default Card;
