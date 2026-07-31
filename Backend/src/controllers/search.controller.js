const musicModel = require("../models/music.model");
const playlistModel = require("../models/playlist.model");
const userModel = require("../models/user.model");

async function searchGlobal(req, res) {
    const query = req.query.q;

    // Guard clause if someone hits search without typing anything
    if (!query) {
        return res.status(400).json({
            message: "Search query parameter 'q' is required...!"
        });
    }

    try {
        // Promise.all runs all three database queries at the exact same time for speed
        const [songs, playlists, artists] = await Promise.all([
            // 1. Search songs matching the title explicitly with regex options
            musicModel.find({ title: { $regex: query, $options: "i" } }).populate("artist", "username email profilePicture"),

            // 2. Search playlists matching the title explicitly with regex options
            playlistModel.find({ title: { $regex: query, $options: "i" } }).populate("user", "username email profilePicture"),

            // 3. Search users whose username matches and role is 'artist'
            userModel.find({ 
                username: { $regex: query, $options: "i" }, 
                role: "artist" 
            }).select("username email profilePicture")
        ]);

        res.status(200).json({
            message: "Search results fetched successfully....!",
            results: {
                songs,
                playlists,
                artists
            }
        });
    } 
    catch (err) {
        console.log("There is an error in the SEARCH :", err);
        return res.status(500).json({ message: err.message });
    }
}

module.exports = { searchGlobal };
