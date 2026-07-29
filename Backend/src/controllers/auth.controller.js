const userModel= require ("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


async function registerUser(req,res){
    const {username, email, password, role = 'user'} = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        $or:[
            { username },
            { email }
        ]
    });
    const hash = await bcrypt.hash(password,10); //The value 10 is the salt(random value added to the password during the hashing)

    if(isUserAlreadyExists){
        return res.status(409).json({
            message : "User already exists!"
        });
    }

    const user= await userModel.create({
        username,
        email,
        password: hash,
        role
    })
    const token= jwt.sign({
        id: user._id,
        role: user.role
    },process.env.JWT_SECRET);
    res.cookie("token",token,{
    httpOnly: true, // Prevents XSS attacks from reading the token
    sameSite: "lax"  // Good default for local development testing
});

    res.status(200).json({
        message : "User registered successfully!",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    })
}

async function loginUser(req,res){
    const { username, email, password } = req.body;

    const user = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    });
    if(!user){
        return res.status(401).json({
            message : "Invalid credentials......!"
        })
    }

    const isPasswordValid= await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
        return res.status(401).json({
            message : "Invalid credentials....!"
        })
    };
    const token = jwt.sign({
        id: user._id,
        role: user.role,
    },process.env.JWT_SECRET);

    res.cookie("token",token,{
    httpOnly: true, // Prevents XSS attacks from reading the token
    sameSite: "lax"  // Good default for local development testing
});

    res.status(200).json({
        message : "Logged in succefully.....!",
        user: {
            id:user._id,
            username:user.username,
            email: user.email,
            role: user.role
        }
    });
     
}

async function logoutUser(req,res){
    res.clearCookie("token");
    res.status(200).json({
        message : "User logged out successfully....!"
    });
}

//New favourites feature added to the user model. This function will allow users to add music to their favourites list.
async function likeMusic(req,res){
    const { musicId } = req.body;
    await userModel.findByIdAndUpdate(req.user.id,{
        $addToSet: { favourites: musicId }
    });
    res.status(200).json({
        message: "Song added to favourites successfully....."
    });
}

async function unlikeMusic(req,res){
    const { musicId } = req.body;
    await userModel.findByIdAndUpdate(req.user.id,{
        $pull: { favourites: musicId }
    });
    res.status(200).json({
        message: "Song removed from favourites successfully....."
    });
}

async function getFavourites(req,res){
    const userWithFavourites = await userModel.findById(req.user.id).populate({
        path: "favourites",
        populate: {
            path: "artist",
            select: "username email"
        }
    });
    res.status(200).json({
        message: "Favourites fetched successfully.....",
        favourites: userWithFavourites.favourites
    });
}
async function getCurrentUser(req, res) {
    const user = await userModel.findById(req.user.id).select("-password");
    if (!user) {
        return res.status(401).json({ message: "User not found" });
    }
    res.status(200).json({
        message: "Session restored successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    });
}

module.exports = { registerUser, loginUser , logoutUser, likeMusic, unlikeMusic, getFavourites, getCurrentUser };
