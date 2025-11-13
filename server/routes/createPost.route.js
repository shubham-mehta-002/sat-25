import express from "express";
const router  = express.Router()
import mongoose from "mongoose";
import requireLogin from "../middlewares/requireLogin";
const  POST =  mongoose.model("POST");
const  USER =  mongoose.model("USER");

router.post("/api/createPost", requireLogin, (req, res) => {
    const { caption, content_pic } = req.body;
    if (!content_pic && !caption) {
        return res.status(422).json({ error: "Please add all the fields" })
    }
    const post = new POST({
        postedby: req.user,
        caption: caption,
        image: content_pic
    })
    post.save().then((result) => {
        return res.json({ post: result })
    }).catch(err => {
        console.log(err);
    })
})

router.get("/api/", (req, res) => {
    POST.find()
        .populate("postedby", "_id userName name profile_photo")
        .then(posts => {
            res.json(posts)
        })
        .catch(err => console.log(err))
})

router.get("/api/profile", requireLogin, (req, res) => {
    POST.find({ postedby: req.user._id })
        .populate("postedby", "_id userName name")
        .then(posts => {
            USER.findOne({ _id: req.user._id })
                .select("-password")
                .select("-cpassword")
                .then(user => {
                    const followers = user.followers
                    const following = user.following
                    const profilephoto = user.profile_photo
                    const profilegender = user.gender
                    const profilebio = user.bio
                    res.json({ posts, followers, following, profilephoto, profilegender, profilebio })
                })
        })
        .catch(err => {
            res.status(422).json({ error: err });
        })
})

router.put("/api/like", requireLogin, (req, res) => {
    POST.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.user._id }
    }, {
        new: true
    }).populate("postedby", "_id userName")
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.status(422).json({ error: err });
        })
})

router.put("/api/unlike", requireLogin, (req, res) => {
    POST.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user._id }
    }, {
        new: true
    }).populate("postedby", "_id userName")
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.status(422).json({ error: err });
        })
})

router.put("/api/dislike", requireLogin, (req, res) => {
    POST.findByIdAndUpdate(req.body.postId, {
        $push: { dislikes: req.user._id }
    }, {
        new: true
    }).populate("postedby", "_id userName")
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.status(422).json({ error: err });
        })
})

router.put("/api/undislike", requireLogin, (req, res) => {
    POST.findByIdAndUpdate(req.body.postId, {
        $pull: { dislikes: req.user._id }
    }, {
        new: true
    }).populate("postedby", "_id userName")
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.status(422).json({ error: err });
        })
})

router.post('/api/getlikedby', requireLogin, (req, res) => {
    POST.find({ _id: req.body.postId })
        .populate("likes", "_id userName profile_photo")
        .then(result => {
            res.json(result[0].likes);
        })
        .catch(err => {
            res.status(422).json({ error: err });
        })
})

router.post('/api/getdislikedby', requireLogin, (req, res) => {
    POST.find({ _id: req.body.postId })
        .populate("dislikes", "_id userName profile_photo")
        .then(result => {
            res.json(result[0].dislikes);
        })
        .catch(err => {
            res.status(422).json({ error: err });
        })
})

router.post('/api/showcomments', requireLogin, (req, res) => {
    POST.find({ _id: req.body.postId })
        .populate("comments.postedby", "_id userName profile_photo")
        .populate({
            path: 'comments.replies',
            select: '_id reply postedby'
        })
        .populate({
            path: 'comments.replies.postedby',
            select: '_id userName profile_photo'
        })
        .then(result => {
            res.json(result[0].comments);
        }).catch(err => {
            res.status(422).json({ error: err });
        })
})

router.put('/api/removecomment', requireLogin, (req, res) => {
    POST.findByIdAndUpdate(req.body.postId, {
        $pull: { comments: { _id: req.body.comment_id } }
    }, {
        new: true
    }).populate("comments.postedby", "_id userName profile_photo")
        .then(result => {
            res.json(result.comments);
        })
        .catch(err => {
            res.status(422).json({ error: err });
        })
})

router.put('/api/replycomment', requireLogin, (req, res) => {
    const reply = {
        reply: req.body.text,
        postedby: req.body.userid
    }
    POST.findByIdAndUpdate(req.body.postId, {
        $push: { "comments.$[elem].replies": reply }
    }, {
        new: true,
        arrayFilters: [{ "elem._id": req.body.comment_id }]
    })
        .exec()
        .then(result => {
            res.json(result.comments);
        }).catch(err => {
            res.status(422).json({ error: err });
        })
})

router.put('/api/removereplycomment', requireLogin, (req, res) => {
    const { postId, comment_id, reply_id } = req.body;

    POST.findByIdAndUpdate(postId, {
        $pull: { 'comments.$[comment].replies': { _id: reply_id } }
    }, {
        new: true,
        arrayFilters: [{ 'comment._id': comment_id }]
    }).populate("comments.postedby", "_id userName")
        .then(result => {
            if (!result) {
                return res.status(404).json({ error: "Post not found" });
            }
            res.json(result.comments);
        }).catch(err => {
            res.status(500).json({ error: err.message });
        });
});

router.put('/api/makecomment', requireLogin, (req, res) => {
    const comment = {
        comment: req.body.text,
        postedby: req.user._id
    }
    POST.findByIdAndUpdate(req.body.postId, {
        $push: { comments: comment }
    }, {
        new: true
    }).populate("comments.postedby", "_id userName")
        .then(result => {
            res.json(result.comments);
        }).catch(err => {
            res.status(422).json({ error: err });
        })
})

router.delete("/api/deletepost/:postId", requireLogin, (req, res) => {
    POST.findOneAndDelete({ _id: req.params.postId })
        .then(result => {
            return res.json({ message: "Successfully deleted" });
        })
        .catch(err => {
            res.status(422).json({ error: "err1" });
        })
}
)

export default router