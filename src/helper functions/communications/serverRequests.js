import axios from "axios";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

const baseUrl = "http://localhost:8000/";

export async function registerReqeust(userData) {
  try {
    const response = await axios.post(baseUrl + "register", userData, config);
    console.log(response.status);
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    if (error.response.status === 409) {
      //email exists
      return false;
    }
    console.log("Error with register request", error);
  }
}

export async function loginReqeust(userData) {
  try {
    const response = await axios.post(baseUrl + "login", userData, config);
    console.log(response.status);
    if (response.status === 200) {
      localStorage.setItem("user", JSON.stringify(response.data));
      return true;
    }
  } catch (error) {
    if (error.response.status === 401) {
      //invalid credentials
      return false;
    }
    console.log("Error with login request", error);
  }
}

export async function scrapeRequest(name, artistName) {
  try {
    const imageInfo = { image: name, artist: artistName };
console.log(imageInfo);
    const response = await axios.post(baseUrl + "scrape", imageInfo, config);
    console.log(response.status);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        //image not found
        return "none";
      }
    }
    console.log("Error with scrape request", error);
  }
}

export async function listRequest(artwork){
  console.log(artwork);
  artwork.listed_by = JSON.parse(localStorage.getItem("user")).email;
  try {
    const response = await axios.post(baseUrl + "listArt", artwork, config);
    console.log(response.status);
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    if (error.response.status === 409) {
      //artwork exists
      return false;
    }
    console.log("Error with list art request", error);
  }
}

export async function getAllPaintings(){
  try {
    const response = await axios.get(baseUrl + "allPaintings", config);
    if (response.status === 200) {
      console.log(response.data);
      return response.data;
    }
  } catch (error) {
    if (error.response.status === 409) {
      //artwork exists
      return false;
    }
    console.log("Error with get all paintings request", error);
  }
}

export async function getSinglePainting(paintingID){
  try {
    const ID = {id: paintingID}
    const response = await axios.post(baseUrl + "singlePainting", ID, config);
    if (response.status === 200) {
      console.log(response.data);
      return response.data;
    }
  } catch (error) {
    if (error.response.status === 409) {
      //artwork doesn't
      return false;
    }
    console.log("Error with get single painting request", error);
  }
}

export async function getListedPaintings(user){
  try {
    const response = await axios.post(baseUrl + "listedByArtworks", user, config);
    if (response.status === 200) {
      console.log(response.data);
      return response.data;
    }
  } catch (error) {
    if(error.response){
      if (error.response.status === 404) {
        //user doesn't
        return false;
      }
    }
    console.log("Error with get listed paintings request", error);
  }
}

export async function getPurchasedPaintings(user){
  try {
    const response = await axios.post(baseUrl + "purchasedArt", user, config);
    if (response.status === 200) {
      console.log(response.data);
      return response.data;
    }
  } catch (error) {
    if(error.response){
      if (error.response.status === 404) {
        //user doesn't
        return false;
      }
    }
    console.log("Error with get listed paintings request", error);
  }
}

export async function sendTransaction(transaction){
  try {
    console.log(transaction);
    const response = await axios.post(baseUrl + "purchaseTokens", transaction, config);
    if (response.status === 200) {
      console.log(response.data);
      return response.data;
    }
  } catch (error) {
    if (error.response.status === 409) {
      //artwork doesn't exist
      return false;
    }
    console.log("Error with get single painting request", error);
  }
}

export async function sendTopUp(newWalletInfo){
  try {
    console.log(newWalletInfo);
    const response = await axios.post(baseUrl + "topUp", newWalletInfo, config);
    if (response.status === 200) {
      console.log(response.data);
      return true;
    }
  } catch (error) {
    if(error.response){
      if (error.response.status === 500) {
        //artwork doesn't exist
        return false;
      }
    }
    console.log("Error with get single painting request", error);
  }
}
