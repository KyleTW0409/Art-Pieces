import React, { useEffect, useState } from "react";
import Input from "./Input";
import Button from "./Button";
import {
  listRequest,
  loginReqeust,
  registerReqeust,
  scrapeRequest,
  sendTopUp,
} from "../helper functions/communications/serverRequests";
import { useNavigate } from "react-router-dom";

function Form(props) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    wallet: 0,
  });

  const [artworkData, setArtworkData] = useState({
    name: "",
    image: "",
    artist_name: "",
    creationdate: "",
    valuation: 0,
    total_tokens: 0,
    listed_by: ""
  });

  const [wallet, setWallet] = useState({
    topUpAmount: 0,
    userID: ""
  });

  useEffect(() => {
    setDisplayError(false)
    setDisplayImageError(false)
    setImgInputError(false)
    setArtworkData({
      name: "",
      image: "",
      artist_name: "",
      creationdate: "",
      valuation: "",
      total_tokens: "",
      listed_by: ""
    });
    setWallet({
      topUpAmount: 0,
      userID: ""
    })
  }, [props.formType]);

  const [displayError, setDisplayError] = useState(false);
  const [displayImageError, setDisplayImageError] = useState(false);
  const [loadingImg, setLoadingImage] = useState(false);
  const [imgInputError, setImgInputError] = useState(false);

  function userInputChange(event) {
    setDisplayError(false);
    const { value, name } = event.target;
    setUserData((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  }

  function ArtworkDataChange(event) {
    setDisplayError(false);
    setImgInputError(false);
    const { value, name } = event.target;
    setArtworkData((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  }

  function WalletDataChange(event){
    setDisplayError(false);
    const value = event.target.value;

    if(value >= 0){
      setWallet((prev) => {
        return {
          ...prev,
          topUpAmount: value
        }
      })
    }
  }

  async function fetchImageClick() {
    if(artworkData.name === "" || artworkData.artist === ""){
      setImgInputError(true);
    } else{
      setLoadingImage(true);
    setArtworkData((prevValue) => {
      return {
        ...prevValue,
        image: "",
      };
    });

    initiateScrape().then((value) => {
      if(value !== "none"){
        setArtworkData((prevValue) => {
          return {
            ...prevValue,
            image: value,
          };
        });
      } else {
        setDisplayImageError(true);
      }
      setLoadingImage(false);
    });
    }
  }

  async function initiateScrape() {
    const fetchedImage = await scrapeRequest(artworkData.name, artworkData.artist_name);
    return fetchedImage;
  }

  async function handleSubmit() {
    if (props.formType === "register") {
      if ((await registerReqeust(userData)) === true) {
        localStorage.setItem("user", JSON.stringify(userData));
        props.exitClick();
        navigate("/");
      } else {
        setDisplayError(true);
      }
    } else if (props.formType === "login") {
      if (await loginReqeust(userData)) {
        navigate("/");
        props.exitClick();
      } else {
        setDisplayError(true);
      }
    } else if(props.formType === "list-art"){
      setArtworkData((prev) => {
        return {
          ...prev,
          listed_by: JSON.parse(localStorage.getItem("user")).email
        }
      })

      if(await listRequest(artworkData)){
        navigate("/user_listings");
        props.exitClick();
      } else{
        setDisplayError(true);
      }
    } else if(props.formType === "wallet"){

      setWallet((prev => {
        const user = JSON.parse(localStorage.getItem("user"));
        return{
          ...prev,
          userID: user.email
        }
      }));

      if(await sendTopUp(wallet)){
        const user = JSON.parse(localStorage.getItem("user"));
        user.wallet = +user.wallet + +wallet.topUpAmount;
        localStorage.setItem("user", JSON.stringify(user));
        props.exitClick();

        setWallet({
          topUpAmount: 0,
          userID: ""
        })
      }
    }
    setUserData({
      name: "",
      email: "",
      password: "",
    });
  }

  function selectForm() {
    if (props.formType === "login") {
      return (
        <div>
          <h2 className="Form__heading">Login</h2>
          <Input
            inputType="email"
            labelText="Email"
            inputName="email"
            handleChange={userInputChange}
            inputValue={userData.email}
          />
          <Input
            inputType="password"
            labelText="Password"
            inputName="password"
            handleChange={userInputChange}
            inputValue={userData.password}
          />
          <p className={`Form__error ${displayError && "showError"}`}>
            Invalid credentials.
          </p>
        </div>
      );
    } else if (props.formType === "register") {
      return (
        <div>
          <h2 className="Form__heading">Register</h2>
          <Input
            inputType="text"
            labelText="Name"
            inputName="name"
            handleChange={userInputChange}
            inputValue={userData.name}
          />
          <Input
            inputType="email"
            labelText="Email"
            inputName="email"
            handleChange={userInputChange}
            inputValue={userData.email}
          />
          <Input
            inputType="password"
            labelText="Password"
            inputName="password"
            handleChange={userInputChange}
            inputValue={userData.password}
          />
          <p className={`Form__error ${displayError && "showError"}`}>
            Email already exists.
          </p>
        </div>
      );
    } else if (props.formType === "list-art") {
      return (
        <div className="Form--withImage__Ctn">
          <div className="Form--withImage__inputs">
            <h2 className="Form__heading">Art Listing</h2>
            <Input
              inputType="text"
              labelText="Name"
              inputName="name"
              handleChange={ArtworkDataChange}
              inputValue={artworkData.name}
            />

            <Input
              inputType="text"
              labelText="Artist"
              inputName="artist_name"
              handleChange={ArtworkDataChange}
              inputValue={artworkData.artist_name}
            />
            <p className={`u-margin-top-sm Form--withImage__inputs__error ${imgInputError && "showError"}`}>*Please fill in the above first</p>
            <Button
              buttonText="Fetch Image"
              handleClick={fetchImageClick}
              buttonType="button"
            />
            <Input
              modifierClasses="shiftUp"
              inputType="text"
              labelText="Creation Date"
              inputName="creationdate"
              handleChange={ArtworkDataChange}
              inputValue={artworkData.creationdate}
            />
            <Input
              inputType="number"
              labelText="Total Valuation"
              inputName="valuation"
              handleChange={ArtworkDataChange}
              inputValue={artworkData.valuation}
            />
            <Input
              inputType="number"
              labelText="Tokens to be issued"
              inputName="total_tokens"
              handleChange={ArtworkDataChange}
              inputValue={artworkData.total_tokens}
            />
            <p className={`Form__error ${displayError && "showError"}`}>
              Artwork is already listed.
            </p>
          </div>
          <div className="Form--withImage__imageArea">
            {artworkData.image !== "" ? (
              <img
                className="Form--withImage__imageArea__image"
                src={artworkData.image}
                alt="artwork"
              />
            ) : (
              <p>{loadingImg ? "Loading..." : displayImageError ? "No image found" : "Your image will appear here"}</p>
            )}
          </div>
        </div>
      );
    } else if(props.formType === "wallet"){

      return (
        <div>
          <h2 className="Form__heading">Your Wallet</h2>
          <p>Balance: R{+JSON.parse(localStorage.getItem("user")).wallet + +wallet.topUpAmount}</p>
          <Input
            inputType="number"
            labelText="Top up amount"
            inputName="amount"
            handleChange={WalletDataChange}
            inputValue={wallet.topUpAmount}
          />
          <p className={`Form__error ${displayError && "showError"}`}>
            Invalid credentials.
          </p>
        </div>
      );
    }
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
      className={`Form ${props.formType === "list-art" && "Form--withImage"}`}
    >
      {selectForm()}
      <img
        onClick={() => {
          props.exitClick();
        }}
        className="Form__backIcon"
        src="back-svgrepo-com (1).svg"
        alt="back arrow"
      />
      <Button buttonText="Cool beans" />
    </form>
  );
}

export default Form;
