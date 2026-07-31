const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer.middleware");
const { 
    createMusic, 
    createPlaylist, 
    getAllMusics, 
    getAllPlaylists, 
    getPlaylistById,
    playMusic,
    getTrendingMusic,
    getArtistById,
    updateMusic,
    deleteMusic,
    updatePlaylist,
    deletePlaylist,
    getArtistStats
} = require("../controllers/music.controller");
const { authArtist, authenticate, optionalAuthenticate } = require("../middlewares/auth.middleware");

// Routes that don't require authentication (but use optionalAuthenticate to identify users if logged in)
router.get("/", optionalAuthenticate, getAllMusics);
router.get("/playlists", optionalAuthenticate, getAllPlaylists);
router.get("/playlists/:playlistId", optionalAuthenticate, getPlaylistById);
router.get("/trending", optionalAuthenticate, getTrendingMusic);
router.get("/artists/:artistId", optionalAuthenticate, getArtistById);

// Routes requiring basic authentication
router.post("/:musicId/play", authenticate, playMusic);

// Routes requiring basic authentication for creation
router.post("/playlist", authenticate, createPlaylist);

// Routes requiring artist permissions
router.post("/upload", authArtist, upload.single("music"), createMusic);

// Artist Dashboard endpoints
router.put("/:musicId", authArtist, updateMusic);
router.delete("/:musicId", authArtist, deleteMusic);
router.get("/artist/stats", authArtist, getArtistStats);

// Playlist Management endpoints (both roles)
router.put("/playlists/:playlistId", authenticate, updatePlaylist);
router.delete("/playlists/:playlistId", authenticate, deletePlaylist);

module.exports = router;
