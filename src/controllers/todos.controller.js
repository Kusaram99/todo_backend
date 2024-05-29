import { Todo } from "../models/todo.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { response } from "express";


// add todo to database
const addTodo = asyncHandler(async (req, res) => {

    // check todo values
    // check user is available in database
    // if not throw error
    // if user is available then add todo to database
    // check data saved or not 
    // if not throw error
    // return success message with todo data and status 200
    try {
        const { title, textarea, userId } = req.body;

        console.log("body: ", req.body)

        // return res.send("todo added")

        // check todo's values
        if (!title?.trim() || !textarea?.trim()) throw new ApiError(401, "All fields are required");

        // check user is available
        const user = await User.findById(userId);
        if (!user) throw new ApiError(401, "User not found");

        const todo = await Todo.create({
            title,
            textarea,
            userId
        });
        // check successfully created
        if (!todo) throw new ApiError(501, "Server Error, during adding todo");

        // return success message with todo data and status 200
        res.status(200).json(new ApiResponse(200, todo, "Todo added successfully"))
    }
    catch (error) {
        console.log("adding-error: ", error);
        throw new ApiError(401, error?.message || "Server Error")
    }
})





export { addTodo }