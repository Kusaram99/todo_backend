import { Todo } from "../models/todo.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";


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

        // console.log("body--: ", req.body)

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
        // console.log("adding-error: ", error);
        throw new ApiError(401, error?.message || "Server Error")
    }
})

// delet todo 
const deleteTodo = asyncHandler(async (req, res) => {
    // check user is loged
    // if no throw error
    // If yes delete todo
    // ṭhen return deleted todo data 
    // as response
    const { _id } = req.params;
    try {
        // delete todo
        const result = await Todo.findByIdAndDelete(_id)
        // if not deleted
        console.log("Todo deleted successfully:- ", result)
        if (!result) {
            throw new ApiError(500, "Request failed!");
        }
        // if successfully deleted
        res.status(200)
            .json(new ApiResponse(200, result, "Successfully deleted"))

    } catch (error) {
        throw new ApiError(401, error.message || "Server Error");
    }
})

// update todo
const updateTodo = asyncHandler(async (req, res) => {
    try {

        // extract data
        const { title, textarea, todoId } = req.body;
        console.log("update: ", req.body);

        // update the todo
        const result = await Todo.findByIdAndUpdate(todoId, { title, textarea }, { new: true });

        // check is todo updated
        if (!result) {
            throw new ApiError(401, "Server Error !");
        }

        res.status(200).json(new ApiResponse(200, result, "Successfully updated"));


    } catch (error) {
        throw new ApiError(401, error.message || "Server error");
    }
})

const getUserTodos = asyncHandler(async (req, res) => {
    // console.log("get user: ", req.params);

    try {

        const { _id } = req.params;

        // get user todos documents 
        const result = await Todo.find({ userId: _id });
        if (!result.length) {
            throw new ApiError(401, "User don't have andy todo!");
        }

        res.status(200).json(new ApiResponse(200, { result }, "Successfully completed"));

    } catch (error) {
        console.log("errr: ", error.message)
        throw new ApiError(401, error.message || "Server Error!")
    }
})




export { addTodo, deleteTodo, updateTodo, getUserTodos }