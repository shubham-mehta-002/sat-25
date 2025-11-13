import  mongoose  from "mongoose";
import { ObjectId } from mongoose.Schema.Types

const witpostSchema = new mongoose.Schema({
    postedby:{
        type: ObjectId,
        ref: "USER",
    },
    postedin:{
        type: ObjectId,
        ref: "WIT",
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
mongoose.model("WITPOST", witpostSchema)