import React, { useEffect, useState } from "react";
import Input from "./Input";
import Button from "./Button";
import { getSinglePainting, sendTransaction } from "../helper functions/communications/serverRequests";
import { useNavigate } from "react-router-dom";

function TokenForm(props) {
  const navigate = useNavigate();
  const [tokens, setTokens] = useState(1);
  const [artwork, setArtwork] = useState({});
  const [error, setError] = useState("");
  const [transaction, setTransaction] = useState({
    buyer: "",
    seller: "",
    artID: "",
    numTokens: 1,
    payment: "",
  });

  useEffect(() => {
    getSinglePainting(props.artID).then((value) => {
      setArtwork(value);
    });
  }, [props.artID]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if(user){
      setTokens(1);
      setTransaction((prev) => {
          return {
            ...prev,
            buyer: JSON.parse(localStorage.getItem("user")).email,
            artID: props.artID,
            seller: artwork && artwork.listed_by,
          };
        });
    }
  }, [artwork]);

  useEffect(() => {
    setTransaction((prev) => {
        return {
          ...prev,
          numTokens: tokens,
          payment: artwork && tokens * artwork.pricePerToken,
        };
      });
  }, [tokens])


  function handleChange(event) {
    setError("");
    const value = event.target.value;

    const user = JSON.parse(localStorage.getItem("user"));

    if(value > user.wallet){

    }

    if (value > 0) {
      setTokens(value);
    }

    if (value > artwork.availTokens) {
      setTokens(artwork.availTokens);
    }


  }

  function priceRound(number) {
    return Math.round((number + Number.EPSILON) * 100) / 100;
  }

  function percentRound(number) {
    return Math.round((number + Number.EPSILON) * 100000) / 100000;
  }

  function handleSubmit(){
    const user = JSON.parse(localStorage.getItem("user"));

    if(transaction.payment > user.wallet){
      setError("Not enough funds");
    } else{
      if(sendTransaction(transaction)){
        user.wallet = user.wallet - transaction.payment;
  
        localStorage.setItem("user", JSON.stringify(user));
  
        navigate("/tokens")
        props.exitClick()
      }
    }
  }

  return (
    <div
      className="TokenForm"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0,0,0, .2), rgba(0,0,0,.2)), url(${
          artwork && artwork.image
        })`,
      }}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
        className="TokenForm__form"
      >
        <h2 className="TokenForm__form__heading">{artwork && artwork.name}</h2>
        <p className="TokenForm__form__artist">
          {artwork && artwork.artist_name}
        </p>
        <p className="TokenForm__form__info u-margin-top-md">
          {" "}
          Listed by: {artwork && artwork.listed_by}
        </p>
        <p className="TokenForm__form__info u-margin-top-sm">
          Valuation: R{artwork && artwork.valuation}
        </p>
        <p className="TokenForm__form__info u-margin-top-sm">
          Available Tokens: {artwork && artwork.availTokens - tokens}
        </p>
        <p className="TokenForm__form__info u-margin-top-sm">
          Price Per Token: R{artwork && priceRound(artwork.pricePerToken)}
        </p>
        <p className="TokenForm__form__info u-margin-top-sm">
          Percent Per Token: {artwork && percentRound(artwork.percentPerToken)}%
        </p>

        <div className="TokenForm__form__valuesBox u-margin-top-sm">
          <div className="TokenForm__form__valuesBox__value">
            {artwork && percentRound(tokens * artwork.percentPerToken)}%
          </div>
          <div className="TokenForm__form__valuesBox__value">
            R{artwork && percentRound(tokens * artwork.pricePerToken)}
          </div>
        </div>

        <Input
          inputType="number"
          modifierClasses="TokenForm__form__input"
          labelText="Number of tokens"
          inputValue={tokens}
          handleChange={handleChange}
          min={1}
        />
        <p className={`u-margin-top-md TokenForm__form__error ${error != "" && "TokenForm__form__error--show"}`}>*Not enough funds</p>
        <Button modifierClass="u-margin-top-sm" buttonText="Buy Tokens" />

        <img
          onClick={() => {
            setTokens(1)
            props.exitClick();
          }}
          className="Form__backIcon TokenForm__form__backIcon"
          src="back-svgrepo-com (1).svg"
          alt="back arrow"
        />
      </form>
    </div>
  );
}

export default TokenForm;
