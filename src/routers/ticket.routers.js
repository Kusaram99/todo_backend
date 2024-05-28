import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { userTicketHandler } from "../controllers/ticket.controller.js";


const ticketRouter = Router();

ticketRouter.route("/create-ticket").post(verifyJWT, userTicketHandler)

export default ticketRouter;

