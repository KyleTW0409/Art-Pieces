import React, { useEffect, useState } from "react";
import Button from "./Button";

function ArtCard(props){

    const [user, setUser] = useState();

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem("user")))
    }, [localStorage.getItem("user")])

    function priceRound(number) {
        return Math.round((number + Number.EPSILON) * 100) / 100;
      }
    
      function percentRound(number) {
        return Math.round((number + Number.EPSILON) * 10000) / 10000;
      }

    return (<div className="ArtCard">
    <img className="ArtCard__img" src={props.image} alt="painting"/>
        <div style={{backgroundImage: `url(${props.image})`}} className="ArtCard__side ArtCard__side--front">
            <img className="ArtCard__side--front__image" src={props.image} alt="painting"/>
        </div>
        <div style={{backgroundImage: `linear-gradient(to bottom right, rgba(0,0,0, .7), rgba(0,0,0, .7)), url(${props.image})`}} className="ArtCard__side ArtCard__side--back">
        <div className="ArtCard__side--back__details">
        <h2 className="ArtCard__side--back__details__name">{props.name}</h2>
            <p className="ArtCard__side--back__details__info ArtCard__side--back__details__artist">{props.artist}</p>
            <p className="ArtCard__side--back__details__info">Valued At:<br/><span>R{props.value}</span></p>
            <p className="ArtCard__side--back__details__info">Token Price:<br/><span>R{priceRound(props.tokenPrice)}</span></p>
            <p className="ArtCard__side--back__details__info">Avail. Tokens:<br/><span>{props.availTokens}</span></p>
            <p className="ArtCard__side--back__details__info">Percent per token:<br/><span>{percentRound(props.tokenPercent)}</span>%</p>
        </div>
            {user ? <Button buttonId={props.artID} handleClick={props.handleClick} buttonText="Buy Tokens" modifierClass="Button--invertColour"/> : "Login to buy tokens"}
        </div>
    </div>)
}

export default ArtCard;