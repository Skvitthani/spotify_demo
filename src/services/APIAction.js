import axios from "axios";

export const getProfile = async (request) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${request?.token}`,
        },
      });
      const data = await response.json();
      resolve(data);
    } catch (error) {
      reject(error);
      console.log("error :: ", error);
    }
  });
};

export const getRecentlyPlayedSongs = (request) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: "GET",
        url: "https://api.spotify.com/v1/me/player/recently-played?limit=4",
        headers: {
          Authorization: `Bearer ${request?.token}`,
        },
      });
      const tracks = response.data.items;
      resolve(tracks);
    } catch (error) {
      reject(error);
      console.log("error :: ", error);
    }
  });
};

export const getTopItem = (request) => {
  return new Promise(async (resolve, reject) => {
    try {
      const type = "artists";
      const response = await axios.get(
        `https://api.spotify.com/v1/me/top/${type}`,
        {
          headers: {
            Authorization: `Bearer ${request?.token}`,
          },
        }
      );
      resolve(response.data.items);
    } catch (error) {
      reject(error);
      console.log("error :: ", error);
    }
  });
};

export const getSavedTracks = (request) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(
        "https://api.spotify.com/v1/me/tracks?offset=0&limit=50",
        {
          headers: {
            Authorization: `Bearer ${request?.token}`,
          },
          params: {
            limit: 50,
          },
        }
      );
      const data = await response.json();
      resolve(data.items);
    } catch (error) {
      reject(error);
      console.log("error :: ", error);
    }
  });
};

export const fetchSongs = (request) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/albums/${request?.albumId}/tracks`,
        {
          headers: {
            Authorization: `Bearer ${request?.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("failed to fetch album songs");
      }

      const data = await response.json();
      const tracks = data.items;
      resolve(tracks);
    } catch (error) {
      reject(error);
      console.log("error :: ", error);
    }
  });
};

export const getPlaylists = (request) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(
        "https://api.spotify.com/v1/me/playlists",
        {
          headers: {
            Authorization: `Bearer ${request?.token}`,
          },
        }
      );
      resolve(response.data.items);
    } catch (error) {
      console.error("Error retrieving playlists:", error);
    }
  });
};
