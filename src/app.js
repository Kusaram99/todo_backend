import express from 'express'
import cors from 'cors'
import cookieParser from "cookie-parser"

const app = express();

// Use the CORS middleware to allow cross-origin requests
// CORS stands for Cross-Origin Resource Sharing
app.use(cors({
    // Set the origin that is allowed to make requests to this server
    origin: process.env.CORS_ORIGIN,
    // Allow the server to include credentials (cookies, HTTP authentication) in requests
    credentials: true
}));

// Use the JSON middleware to parse incoming JSON requests
// The limit option restricts the size of the JSON payload to 16kb
app.use(express.json({ limit: "16kb" }));

// Use the URL-encoded middleware to parse incoming URL-encoded requests
// extended: true allows for rich objects and arrays to be encoded into the URL-encoded format
// The limit option restricts the size of the URL-encoded payload to 16kb
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Serve static files from the "public" directory
// This allows the server to serve static assets like HTML, CSS, and JavaScript files
app.use(express.static("public"));

// Use the cookie-parser middleware to parse cookies attached to client requests
app.use(cookieParser());


// routes import
import userRouter from './routers/user.routes.js'
import ticketRouter from './routers/ticket.routers.js'


//user routes declaration
app.use("/api/v1/users", userRouter)

// user ticket router declaration
app.use("/api/v1/tickets", ticketRouter)




export { app }