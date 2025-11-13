import express from "express";
const router = express.Router()
import mongoose from "mongoose";
import requireLogin from  "../middlewares/requireLogin";

const POST = mongoose.model("POST");
const USER = mongoose.model("USER");

router.get("/api/user/:userid", requireLogin, (req, res) => {
    USER.findOne({ _id: req.params.userid })
        .select("-password")
        .select("-cpassword")
        .populate("followers", "_id userName name profile_photo")
        .populate("following", "_id userName name profile_photo")
        .then(user => {
            if (!user) {
                return res.status(422).json({ error: "user not found" })
            }
            POST.find({ postedby: req.params.userid })
                .populate("postedby", "_id userName name ")
                .then(post => {
                    const followers = user.followers
                    const following = user.following
                    const profilephoto = user.profile_photo
                    const profilegender = user.gender
                    const profilebio = user.bio
                    res.json({ user, post, followers,following,profilephoto,profilegender,profilebio })
                })
                .catch(err => {
                    res.status(422).json({ error: err })
                })
        })
})

router.put("/api/follow", requireLogin, (req, res) => {
    USER.findByIdAndUpdate(req.body.followId, {
        $push: { followers: req.user._id }
    }, {
        new: true
    }).populate("followers","_id userName name")
    .then(updatedUser=>{
        if(!updatedUser){
            return res.status(422).json({error:"user not found"})
        }
        USER.findByIdAndUpdate(req.user._id, {
            $push: { following: req.body.followId }
        }, {
            new: true
        }).populate("following", "_id userName name followers")
        .populate("followers", "_id userName name")
        .then(result => {
            const followerArray = updatedUser.followers
            res.json({result,followerArray})
        }).catch(err => {
            res.status(422).json({ error: err })
        })
    }).catch(err => {
        res.status(422).json({ error: err })
    })
})

router.put("/api/unfollow", requireLogin, (req, res) => {
    USER.findByIdAndUpdate(req.body.followId, {
        $pull: { followers: req.user._id }
    }, {
        new: true
    }).populate("followers","_id userName name")
    .then(updatedUser=>{
        if(!updatedUser){
            return res.status(422).json({error:"user not found"})
        }
        USER.findByIdAndUpdate(req.user._id, {
            $pull: { following: req.body.followId }
        }, {
            new: true
        }).populate("following", "_id userName name followers")
        .populate("followers", "_id userName name")
        .then(result => {
            const followerArray = updatedUser.followers
            res.json({result,followerArray})
        }).catch(err => {
            res.status(422).json({ error: err })
        })
    }).catch(err => {
        res.status(422).json({ error: err })
    })
})

router.post("/api/getfollowdata",requireLogin,(req,res)=>{
    USER.findById(req.body._id)
    .populate("following","_id userName name profile_photo")
    .populate("followers","_id userName name profile_photo")
    .select("-password")
    .select("-cpassword")
    .then(result=>{
        const followerList = result.followers
        const followingList = result.following
        res.json({followerList,followingList})
    }).catch(err=>{
        res.status(422).json({error:err})
    })
})

router.post("/api/searchusersindatabase",requireLogin,(req,res) => {
    const searchquery = req.body.query
    USER.find()
    .select("-password")
    .select("-cpassword")
    .then(result=>{
        res.json(result)
    }).catch(err=>{
        res.status(422).json({error:err})
    })
})

router.put("/api/addsavedpost",requireLogin,(req,res) => {
    const {userid, post_id} = req.body
    USER.findByIdAndUpdate(userid,{
        $push: {saved_post: post_id}
    },{
        new:true
    }).then(result=>{
        res.json(result)
    }).catch(err=>{
        res.status(422).json({error:err})
    })
})

router.put("/api/removesavedpost",requireLogin,(req,res) => {
    const {userid, post_id} = req.body
    USER.findByIdAndUpdate(userid,{
        $pull: {saved_post: post_id}
    },{
        new:true
    }).then(result=>{
        res.json(result)
    }).catch(err=>{
        res.status(422).json({error:err})
    })
})

router.post("/api/getsavedposts",requireLogin,(req,res) => {
    const {userid} = req.body
    USER.findOne({_id:userid})
    .populate("saved_post","_id caption image likes dislikes comments postedby")
    .populate({
        path: 'saved_post',
        populate: {
            path: 'postedby',
            select: '_id name userName profile_photo'
        }
    })
    .then(result=>{
        const savedposts = result.saved_post
        res.json(savedposts)
    }).catch(err=>{
        res.status(422).json({error:err})
    })
})

router.post("/api/checksavedposts",requireLogin,(req,res) => {
    const {userid, post_id} = req.body
    USER.findOne({_id:userid})
    .then(result=>{
        const savedposts = result.saved_post
        if(savedposts.includes(post_id)){
            res.json({saved:true})
        }else{
            res.json({saved:false})
        }
    }).catch(err=>{
        res.status(422).json({error:err})
    })
})

export default router