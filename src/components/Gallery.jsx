import React, { useEffect, useState } from "react";
import ArtCard from "./ArtCard";
import { getAllPaintings, getListedPaintings, getPurchasedPaintings } from "../helper functions/communications/serverRequests";
import Form from "./Form";
import TokenForm from "./TokenForm";
import { useNavigate } from "react-router-dom";

function Gallery(props) {
  const navigate = useNavigate();
  const [paintings, setPaintings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [clickedPainting, setClickPainting] = useState();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
    if(props.GalleryType === "listed"){
      const user = JSON.parse(localStorage.getItem("user")); 
      setUser(user)
      getListedPaintings(user).then((value) => {
        setPaintings(value);
        console.log(paintings);
        setLoading(false);
      });
    } else if(props.GalleryType === "all"){
      getAllPaintings().then((value) => {
        setPaintings(value);
      });
    } else if(props.GalleryType === "purchased"){
      const user = JSON.parse(localStorage.getItem("user")); 
      setUser(user)
      getPurchasedPaintings(user).then((value) => {
        setPaintings(value);
        console.log(paintings);
        setLoading(false);
      });
    }
  }, [window.location.href]);

  function handleBtnClick(event){
    const user = localStorage.getItem("user");
    if(user){
      setShowForm(true);
    } else {
      navigate("/login");
    }

    const artId = event.target.value;

    setClickPainting(artId)
  }

  function exitClick(){
    setShowForm(false);
  }

  return (
    <div className="Gallery">
    <div className={`PopUpPage u-centered-middle Gallery__TokenForm ${showForm && "Gallery__TokenForm--show"}`}><TokenForm artID={clickedPainting} exitClick={exitClick}/></div>
      <h2 className="Gallery__heading">{props.heading}</h2>
      <div className="Gallery__paintings">
        {!loading ? paintings.map((item, index) => {
          return (
            <ArtCard
              key={index}
              image={item.image}
              name={item.name}
              value={item.valuation}
              artist={item.artist_name}
              tokenPrice={item.pricePerToken}
              availTokens={item.availTokens}
              tokenPercent={item.percentPerToken}
              handleClick={handleBtnClick}
              artID={item.id}
            />
          );
        }) : "loading..."}
      </div>
    </div>
  );
}

export default Gallery;
