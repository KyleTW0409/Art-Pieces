import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Form from "./Form";
import {
  logoutUser,
  scrapeRequest,
} from "../helper functions/communications/serverRequests";
import Button from "./Button";

function Navbar() {
  const navigate = useNavigate();
  const [navButtonClicked, setNavButtonClicked] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setLoggedIn(true);
    }
  }, [localStorage.getItem("user")]);

  function onClickedLogin() {
    setNavButtonClicked("login");
  }

  function onClickedRegister() {
    setNavButtonClicked("register");
  }

  function onClickedListArt() {
    setNavButtonClicked("list-art");
  }

  function onClickedWallet(){
    setNavButtonClicked("wallet")
  }

  function onClickedLogout() {
    navigate("/")
    localStorage.clear();

    exitPopUp();
    setLoggedIn(false);
  }

  function exitPopUp() {
    setNavButtonClicked("");
  }

  function loggedInState() {
    return (
      <div className="Navbar__buttonsCtn">
        {navButtonClicked !== "list-art" && (
          <Link onClick={onClickedListArt} className="Navbar__buttons">
            List Artwork
          </Link>
        )}

        {!window.location.href.includes("user_listings") && (
          <Link to="user_listings" className="Navbar__buttons">
            Your Listings
          </Link>
        )}



          {!window.location.href.includes("tokens") && <Link to="tokens" className="Navbar__buttons">
            Your Investments
          </Link>}

          <Link onClick={onClickedWallet} className="Navbar__buttons">
            Wallet: R{user.wallet}
          </Link>

        <Link to="/" onClick={onClickedLogout} className="Navbar__buttons">
          Logout
        </Link>
      </div>
    );
  }

  function loggedOutState() {
    return (
      <div className="Navbar__buttonsCtn">
        {navButtonClicked !== "login" && (
          <Link onClick={onClickedLogin} className="Navbar__buttons">
            Login
          </Link>
        )}
        {navButtonClicked !== "register" && (
          <Link onClick={onClickedRegister} className="Navbar__buttons">
            Register
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="Navbar">
      <Link onClick={exitPopUp} to="/" className="Navbar__logo">
        Art-Pieces
      </Link>
      <div className="Navbar__buttonsCtn">
        {!loggedIn ? loggedOutState() : loggedInState()}
      </div>

      <div
        className={`PopUpPage u-centered-middle ${
          navButtonClicked === "" && "hidePopUp"
        }`}
      >
          <Form exitClick={exitPopUp} formType={navButtonClicked} />
      </div>
    </div>
  );
}

export default Navbar;
