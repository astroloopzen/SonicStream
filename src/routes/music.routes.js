const express = require("express");
const musicController = require("../controllers/music.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const multer = require("multer");

const upload = multer({
    storage : multer.memoryStorage()
});

const router = express.Router();

// Music upload remains restricted to artists
router.post("/upload", authMiddleware.authArtist, upload.single("music"), musicController.createMusic);
router.get("/", authMiddleware.authenticate, musicController.getAllMusics);

// NEW PLAYLIST ROUTES (Accessible by both users and artists via authenticate)
router.post("/playlist", authMiddleware.authenticate, musicController.createPlaylist);
router.get("/playlists", authMiddleware.authenticate, musicController.getAllPlaylists);
router.get("/playlists/:playlistId", authMiddleware.authenticate, musicController.getPlaylistById);
// Append these to src/routes/music.routes.js
router.post("/:musicId/play", authMiddleware.authenticate, musicController.playMusic);
router.get("/trending", authMiddleware.authenticate, musicController.getTrendingMusic);

module.exports = router;
