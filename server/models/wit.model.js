import mongoose from "mongoose";
import { ObjectId } from mongoose.Schema.Types

const witSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    moderator: {
        type: ObjectId,
        ref: "USER"
    },
    requests: [{
        type: ObjectId,
        ref: "USER"
    }],
    wit_image: {
        type: String,
        default: ""
    },
    members: [{
        type: ObjectId,
        ref: "USER"
    }],
    banned_words: [{
        type: String
    }],
    tags: [{
        type: String
    }],
    created_at: {
        type: Date,
        default: Date.now
    },
    posts: [{
        type: ObjectId,
        ref: "POST"
    }]
});
mongoose.model("WIT", witSchema)