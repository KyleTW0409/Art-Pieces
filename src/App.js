import { useEffect } from "react";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import {BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ArtCard from "./components/ArtCard";
import Gallery from "./components/Gallery";

function App() {

//   useEffect(() =>{
//     makeRequest()
//   }, [])

  return (
    <Router>
    <div className="App">

      <Navbar />

      <Routes>
        <Route path="/" element={<div><Hero /><Gallery GalleryType="all" heading="Our Collection"/></div>}/>
        <Route path="/user_listings" element={<Gallery GalleryType="listed" heading="Your listings"/>}/>
        <Route path="/tokens" element={<Gallery GalleryType="purchased" heading="Your Art Tokens"/>}/>
      </Routes>
    </div>
    </Router>
  );
}

export default App;
