const musicModel = require("../models/music.model");
const playlistModel = require("../models/playlist.model");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { uploadFile } = require("../services/storage.service")


async function createMusic(req,res){
    const { title } = req.body;
    const file = req.file;

    // Added a quick check so the server won't crash if someone submits without a file
    if(!file){
        return res.status(400).json({
            message: "Please upload a music file....!"
        });
    }

    const result = await uploadFile(file.buffer.toString('base64'));
    
    const music = await musicModel.create({
        uri: result.url,
        title,
        artist: req.user.id
    })
    res.status(201).json({
        message: "Music created successfully",
        music: {
            id: music._id,
            uri: music.uri,
            title: music.title,
            artist: music.artist,
        }
    })
}

async function createPlaylist(req,res){
    
    const { title , musics } = req.body;

    const playlist = await playlistModel.create({
        title,
        user: req.user.id, // Saves the ID of the user creating the playlist
        musics: musics // Storing the array of music ids
    })

    res.status(201).json({
        message : "Playlist created successfully....!",
        playlist: {
            id: playlist._id,
            title: playlist.title,
            user: playlist.user,
            musics: playlist.musics
        }
    });
}

async function getAllMusics(req,res){
    const musics = await musicModel
    .find()
    .skip(1)//Just used to skip the given number of songs/ musics from the beginning and fetch the remaining songs.
    .limit(2)
    .populate("artist","username email");

    res.status(200).json({
        message : "Musics fetched successfully....!",
        musics : musics
    })
}

async function getAllPlaylists(req,res){
    // Fetches playlists. If req.user is present, maybe we could filter, but let's just return all playlists for 'Top Albums' on Home page.
    let filter = {};
    // If the original intention was to only show user's playlists, we'd do: if (req.user) filter = { user: req.user.id };
    // But since Home page shows these as global albums, let's just return all of them.
    const playlists = await playlistModel.find().select(" title user ").populate("user","username email");

    res.status(200).json({
        message : "All Playlists fetched successfully....!",
        playlists : playlists
    });
}

async function getPlaylistById(req,res){

    const playlistId = req.params.playlistId;

    // Deep population used here to fetch playlist owner, songs, and the individual artists who uploaded those songs
    const playlist = await playlistModel.findById(playlistId)
    .populate("user","username email")
    .populate({
        path: "musics",
        populate: {
            path: "artist",
            select: "username email"
        }
    });

    if(!playlist){
        return res.status(404).json({
            message: "Playlist not found...!"
        });
    }

    res.status(200).json({
        message : "Playlist fetched successfully along with the musics....!",
        playlist : playlist
    });
}

// --- New Playback Tracking Features Added Below ---

async function playMusic(req, res) {
    const musicId = req.params.musicId;

    // 1. Increment the play count of the song by 1
    await musicModel.findByIdAndUpdate(musicId, {
        $inc: { playCount: 1 } // Increment play count by 1
    });
    
    if (req.user) {
        // We use $pull first to remove it if it exists, then $push to put it at the top so there are no duplicates
        await userModel.findByIdAndUpdate(req.user.id, {
            $pull: { recentlyPlayed: musicId }
        });
        
        await userModel.findByIdAndUpdate(req.user.id, {
            $push: { recentlyPlayed: { $each: [musicId], $position: 0 } } // Inserts at the beginning of the array
        });
    }

    res.status(200).json({
        message: "Playback tracked successfully....!"
    });
}

async function getTrendingMusic(req, res) {
    // Fetches songs sorted by playCount in descending order (-1), limiting to top 5 songs
    const trending = await musicModel.find()
        .sort({ playCount: -1 })
        .limit(5)
        .populate("artist", "username email");

    res.status(200).json({
        message: "Trending musics fetched successfully....!",
        musics: trending
    });
}

// Don't forget to include playMusic and getTrendingMusic in your module.exports!

async function getArtistById(req, res) {
    const artistId = req.params.artistId;

    try {
        const artist = await userModel.findOne({ _id: artistId, role: "artist" }).select("-password");
        
        if (!artist) {
            return res.status(404).json({ message: "Artist not found" });
        }

        const songs = await musicModel.find({ artist: artistId }).populate("artist", "username email");
        const albums = await playlistModel.find({ user: artistId }).populate("user", "username email");

        res.status(200).json({
            message: "Artist fetched successfully",
            artist,
            songs,
            albums
        });
    } catch (err) {
        console.error("Error fetching artist:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { createMusic , createPlaylist , getAllMusics , getAllPlaylists , getPlaylistById , playMusic , getTrendingMusic, getArtistById };
