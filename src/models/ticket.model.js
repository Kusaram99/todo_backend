import mongoose, { Schema } from "mongoose";

const ticketSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    ticket: {
        type: Object,
        require: true
    }
})

export const Ticket = mongoose.model('Ticket', ticketSchema)
