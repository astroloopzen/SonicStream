const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    musics: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "music" // References the music model
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true // The owner of the playlist
    }
});

const playlistModel = mongoose.model("playlist", playlistSchema);

module.exports = playlistModel;