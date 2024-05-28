import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Ticket } from "../models/ticket.model.js";



const userTicketHandler = asyncHandler(async (req, res, next) => {
    // cheke is user exist or not 
    // if not throw error
    // check is user admin or not
    // if not throw error
    // check ticket value is valid or not
    // if not throw error
    // store ticke to the database
    // return success message with ticket id and status 200

    /*ticket = {
        movieName: "Spiderman home comming soon",
        movieTime: 12:30 PM,
        movieSits: {
            A: 2,
            B:1,
            C:3
        }
    }
    */
    try {
        // const { movieName, movieTime, movieSits } = req.body;
        const { owner, ticket } = req.body;

        console.log("body: ", req.body);

        // check user admin or not
        const user = await User.findById(owner);
        if (!user) {
            throw new ApiError(401, "User not found")
        }

        // check ticke values
        if (!ticket?.movieName || !ticket?.movieTime || !ticket?.movieSits) {
            throw new ApiError(401, "All fields are required")
        }

        // store ticket to database 
        const newTicket = await Ticket.create(req.body);
        // check successfully created
        if (!newTicket) {
            throw new ApiError(401, "Ticket not created")
        }

        console.log("newTicket: ", newTicket);

        // return success message with ticket and status 200
        res.status(200)
            .json(
                new ApiResponse(
                    200,
                    {
                        ticketData: newTicket,
                        status: "success"
                    },
                    "Ticket created successfully"
                )
            )
    }
    catch (err) {
        throw new ApiError(501, "Server Error")
    }
})


export { userTicketHandler }

