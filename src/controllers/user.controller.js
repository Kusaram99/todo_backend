import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import jwt from 'jsonwebtoken'


// token generator
const generateAccessAndRefereshTokens = async (userId) => {
    try {

        const user = await User.findById(userId);

        // generate access token 
        const accessToken = user.generateAccessToken();

        // refresh token
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(501, "Server Error, during token generation")
    }
}


// register user
const registerUser = asyncHandler(async (req, res, next) => {
    try {
        // console.log("body: ------- ", req.files?.avatar);
        // console.log("body: ------- ", Array.isArray(req.files?.avatar));
        const { username, fullName, email, password } = req.body


        // check is user data empty
        if ([username, fullName, email, password].some(v => v?.trim() === "")) {
            throw new ApiError(401, "All fields are required")
        }

        // user is existed or not   
        const exitedUser = await User.findOne({
            $or: [{ username }, { email }]
        })

        if (exitedUser) {
            throw new ApiError(401, "User with email or username already exists")
        }

        // check file path is existed or not
        let convertImageLocalPath;
        if (req.files?.avatar && Array.isArray(req.files?.avatar) && req.files?.avatar?.length > 0) {
            convertImageLocalPath = req.files?.avatar[0]?.path
        }

        // store file on cloudinary and get url
        const avatarUrl = await uploadOnCloudinary(convertImageLocalPath);

        // create user
        const user = await User.create({
            username,
            fullName,
            email,
            password,
            avatar: avatarUrl?.url || ""
        })

        // const createdUser = await User.findById(user._id).select("-password");

        // send response 
        // res.status(201).json(new ApiResponse(200, createdUser, "User created successfully"))

        // generate access token and refresh token
        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);
        const signedUser = await User.findById(user._id).select("-password -refreshToken");

        const options = {
            httpOnly: true,
            secure: true
        }

        // send respons with cookies
        res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        user: signedUser,
                        accessToken,
                        refreshToken
                    },
                    "User Signed successfully"
                )
            )
    } catch (err) {
        console.log("err: ", err);
        throw new ApiError(501, "Server Error")
    }
})

// login user
const loginUser = asyncHandler(async (req, res, next) => {
    // 1. extract email and password from request body 
    // 2. username and email
    // 3. find the user
    // 4. check password
    // 5. access and refresh token
    // 6. send cookies

    try {
        const { email, password } = req.body

        // check is user data empty 
        if ([email, password].some((v => v?.trim() === ""))) {
            throw new ApiError(401, "All fields are required")
        }

        // find the user
        const user = await User.findOne({ email });

        // console.log("user: ", user);

        // check user is existed or not
        if (!user) {
            throw new ApiError(401, "User with email does not exist")
        }

        // check password
        const isPasswordCorrect = await user.isPasswordCorrect(password);

        // console.log("isPasswordCorrect: ", isPasswordCorrect);

        if (!isPasswordCorrect) {
            throw new ApiError(401, "Password is incorrect")
        }

        // generate access token and refresh token
        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

        const loggedUser = await User.findById(user._id).select("-password -refreshToken");

        // console.log("accessToken: ", accessToken._id);
        // console.log("refreshToken: ", refreshToken._id);

        console.log("loggedUser: ", loggedUser);

        const options = {
            httpOnly: true,
            secure: true
        }

        // send respons with cookies
        res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        user: loggedUser,
                        accessToken,
                        refreshToken
                    },
                    "User Logged in successfully"
                )
            )
    } catch (error) {
        console.log("error: ", error);
        throw new ApiError(401, "Server Error")
    }
})

// logout user
const userLogout = asyncHandler(async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset: {
                    refreshToken: 1 // this removes the field from document.
                }
            },
            {
                new: true
            }
        )

        const opitions = {
            httpOnly: true,
            secure: true
        }

        res.status(200)
            .clearCookie("accessToken", opitions)
            .clearCookie("refreshToken", opitions)
            .json(new ApiResponse(200, {}, "User logged out successfully"))
    } catch (error) {
        console.log("error: ", error);
        throw new ApiError(401, "Server Error")
    }
})

// refresh token
const refreshAccessToken = asyncHandler(async (req, res, next) => {
    // access kockies
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken?.split(" ")[1];
    console.log("incomingRefreshToken: ", incomingRefreshToken);
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token is required");
    }
    try {
        // verify refresh token
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        console.log("decodedToken: ", decodedToken);
        // check refresh token is existed or not
        if (!decodedToken) {
            throw new ApiError(402, "Something is wrong with refresh token");
        }

        console.log("decodedToken: ", decodedToken);
        // check user
        const user = await User.findById(decodedToken?._id);

        // is user existed or not
        if (!user) {
            throw new ApiError(402, "Invalid Refresh Token");
        }

        // check is refresh token expired or not
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(402, "Invalid Refresh Token");

        }

        // generate access token and refresh token
        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

        const options = {
            httpOnly: true,
            secure: true
        }

        // send respons with cookies
        res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken,
                        refreshToken
                    },
                    "Access Token refreshed successfully"
                )
            )

    } catch (error) {
        console.log("error------: ", error.message);
        throw new ApiError(401, error?.message || "Server Error")
    }
})


export {
    registerUser,
    loginUser,
    userLogout,
    refreshAccessToken
}