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
    .sort({ _id: -1 }) // Get newest first
    .populate("artist","username email");

    res.status(200).json({
        message : "Musics fetched successfully....!",
        musics : musics
    })
}

async function getAllPlaylists(req,res){
    const playlists = await playlistModel.find().populate("user","username email");

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

async function updateMusic(req, res) {
    const { title } = req.body;
    try {
        const music = await musicModel.findById(req.params.musicId);
        if (!music) return res.status(404).json({ message: "Music not found" });
        
        if (music.artist.toString() !== req.user.id) {
            return res.status(403).json({ message: "You do not have permission to edit this song." });
        }

        music.title = title;
        await music.save();
        
        await music.populate("artist", "username email");
        res.status(200).json({ message: "Music updated successfully", music });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function deleteMusic(req, res) {
    try {
        const music = await musicModel.findById(req.params.musicId);
        if (!music) return res.status(404).json({ message: "Music not found" });
        
        if (music.artist.toString() !== req.user.id) {
            return res.status(403).json({ message: "You do not have permission to delete this song." });
        }

        await musicModel.findByIdAndDelete(req.params.musicId);
        
        // Also remove from playlists
        await playlistModel.updateMany(
            { musics: req.params.musicId },
            { $pull: { musics: req.params.musicId } }
        );
        res.status(200).json({ message: "Music deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function updatePlaylist(req, res) {
    const { title, musics } = req.body;
    try {
        const playlist = await playlistModel.findById(req.params.playlistId);
        if (!playlist) return res.status(404).json({ message: "Playlist not found" });

        if (playlist.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "You do not have permission to edit this playlist." });
        }

        playlist.title = title;
        playlist.musics = musics;
        await playlist.save();

        await playlist.populate("user", "username email");
        await playlist.populate({
            path: "musics",
            populate: { path: "artist", select: "username email" }
        });
        
        res.status(200).json({ message: "Playlist updated successfully", playlist });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function deletePlaylist(req, res) {
    try {
        const playlist = await playlistModel.findById(req.params.playlistId);
        if (!playlist) return res.status(404).json({ message: "Playlist not found" });

        if (playlist.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "You do not have permission to delete this playlist." });
        }

        await playlistModel.findByIdAndDelete(req.params.playlistId);
        res.status(200).json({ message: "Playlist deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function getArtistStats(req, res) {
    try {
        const [totalSongs, totalPlaylists, recentSongs] = await Promise.all([
            musicModel.countDocuments({ artist: req.user.id }),
            playlistModel.countDocuments({ user: req.user.id }),
            musicModel.find({ artist: req.user.id })
                .sort({ _id: -1 }) // simple descending sort by creation
                .limit(5)
                .populate("artist", "username email")
        ]);
        res.status(200).json({
            message: "Stats fetched successfully",
            stats: { totalSongs, totalPlaylists, recentSongs }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = { 
    createMusic, createPlaylist, getAllMusics, getAllPlaylists, 
    getPlaylistById, playMusic, getTrendingMusic, getArtistById,
    updateMusic, deleteMusic, updatePlaylist, deletePlaylist, 
    getArtistStats 
};
