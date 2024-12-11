import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required : true
    },

    studentid:{
        type: Number,
        required: true,
        unique: true

    },

    roomnum:{
        type: Number,
        required: true,

    },

    level:{
        type: Number,
        required: true,
    },

    status:{
        type: Boolean,
        required: true
    }



})

export default mongoose.model("Users", userSchema)