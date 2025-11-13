import mongoose  from require("mongoose");
import { ObjectId } from  mongoose.Schema.Types

const postSchema = new mongoose.Schema({
    postedby:{
        type: ObjectId,
        ref: "USER",
    },
    image:{
        type: String,
    },
    caption:{
        type: String,
    },
    likes: [{
        type: ObjectId,
        ref: "USER"
    }],
    comments: [{
        comment:{type:String},
        postedby:{
            type: ObjectId,
            ref: "USER"
        },
        replies: [{
            reply: {type:String},
            postedby:{
                type: ObjectId,
                ref: "USER"
            }
        }]
    }],
    dislikes: [{
        type: ObjectId,
        ref: "USER"
    }],
    date: {
        type: Date,
        default: Date.now
    }
});


mongoose.model("POST", postSchema)