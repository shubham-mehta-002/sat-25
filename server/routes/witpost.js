import express from "express";
const router = express.Router()
import mongoose from "mongoose";
import requireLogin from  "../middlewares/requireLogin";

const WIT = mongoose.model("WIT");
const WITPOST = mongoose.model("WITPOST");

router.post("/api/createwitpost", requireLogin, (req, res) => {
    const { caption, content_pic, witid } = req.body;
    if (!content_pic && !caption) {
        return res.status(422).json({ error: "Please add all the fields" })
    }
    WIT.findOne({ _id: witid })
        .then(wit => {
            for (let word in wit.banned_words) {
                if (caption.toLowerCase().includes(wit.banned_words[word])) {
                    return res.status(422).json({ error: "Your post contains banned words" })
                }
            }
            const witpost = new WITPOST({
                postedby: req.user,
                caption: caption,
                postedin: witid,
                image: content_pic
            })
            witpost.save().then((result) => {
                return res.json({ post: result })
            }).catch(err => {
                console.log(err);
            })
        })
})

router.post("/api/getwitposts", requireLogin, (req, res) => {
    WITPOST.find({ postedin: req.body.witid })
        .populate('postedby', 'name userName _id profile_photo')
        .populate('postedin', 'name _id moderator')
        .populate("postedin.moderator", "name _id")
        .then(result => {
            res.json(result)
        }).catch(err => {
            console.log(err)
        })
})

router.put("/api/witlike", requireLogin, (req, res) => {
    WITPOST.findByIdAndUpdate(req.body.postId, {
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

router.put("/api/witunlike", requireLogin, (req, res) => {
    WITPOST.findByIdAndUpdate(req.body.postId, {
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

router.put("/api/witdislike", requireLogin, (req, res) => {
    WITPOST.findByIdAndUpdate(req.body.postId, {
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

router.put("/api/witundislike", requireLogin, (req, res) => {
    WITPOST.findByIdAndUpdate(req.body.postId, {
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

router.post('/api/getwitlikedby', requireLogin, (req, res) => {
    WITPOST.find({ _id: req.body.postId })
        .populate("likes", "_id userName profile_photo")
        .then(result => {
            res.json(result[0].likes);
        })
        .catch(err => {
            res.status(422).json({ error: err });
        })
})

router.post('/api/getwitdislikedby', requireLogin, (req, res) => {
    WITPOST.find({ _id: req.body.postId })
        .populate("dislikes", "_id userName profile_photo")
        .then(result => {
            res.json(result[0].dislikes);
        })
        .catch(err => {
            res.status(422).json({ error: err });
        })
})

router.post('/api/showwitcomments', requireLogin, (req, res) => {
    WITPOST.find({ _id: req.body.postId })
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

router.put('/api/removewitcomment', requireLogin, (req, res) => {
    WITPOST.findByIdAndUpdate(req.body.postId, {
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

router.put('/api/witreplycomment', requireLogin, (req, res) => {
    const reply = {
        reply: req.body.text,
        postedby: req.body.userid
    }
    WITPOST.findByIdAndUpdate(req.body.postId, {
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

router.put('/api/removewitreplycomment', requireLogin, (req, res) => {
    const { postId, comment_id, reply_id } = req.body;

    WITPOST.findByIdAndUpdate(postId, {
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

router.put('/api/makewitcomment', requireLogin, (req, res) => {
    const comment = {
        comment: req.body.text,
        postedby: req.user._id
    }
    WITPOST.findByIdAndUpdate(req.body.postId, {
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

router.delete("/api/deletewitpost/:postId", requireLogin, (req, res) => {
    WITPOST.findOneAndDelete({ _id: req.params.postId })
        .then(result => {
            return res.json({ message: "Successfully deleted" });
        })
        .catch(err => {
            res.status(422).json({ error: "err1" });
        })
}
)

router.post("/api/getmostlikedposts", requireLogin, (req, res) => {
    WITPOST.find({ postedin: req.body.witid })
        .populate('postedby', 'name userName _id profile_photo')
        .populate('postedin', 'name _id moderator')
        .populate("postedin.moderator", "name _id")
        .populate("comments.postedby", "name userName _id profile_photo")
        .populate({
            path: 'comments.replies',
            select: '_id reply postedby'
        })
        .populate({
            path: 'comments.replies.postedby',
            select: '_id userName profile_photo'
        })
        .sort({ likes: -1 })
        .limit(5)
        .then(result => {
            res.json(result)
        }).catch(err => {
            console.log(err)
        })
})

router.post("/api/getmostdislikedposts", requireLogin, (req, res) => {
    WITPOST.find({ postedin: req.body.witid })
        .populate('postedby', 'name userName _id profile_photo')
        .populate('postedin', 'name _id moderator')
        .populate("postedin.moderator", "name _id")
        .populate("comments.postedby", "name userName _id profile_photo")
        .populate({
            path: 'comments.replies',
            select: '_id reply postedby'
        })
        .populate({
            path: 'comments.replies.postedby',
            select: '_id userName profile_photo'
        })
        .sort({ dislikes: -1 })
        .limit(5)
        .then(result => {
            res.json(result)
        }).catch(err => {
            console.log(err)
        })
})

router.post("/api/getmostcommentedposts", requireLogin, (req, res) => {
    WITPOST.find({ postedin: req.body.witid })
        .populate('postedby', 'name userName _id profile_photo')
        .populate('postedin', 'name _id moderator')
        .populate("postedin.moderator", "name _id")
        .populate("comments.postedby", "name userName _id profile_photo")
        .populate({
            path: 'comments.replies',
            select: '_id reply postedby'
        })
        .populate({
            path: 'comments.replies.postedby',
            select: '_id userName profile_photo'
        })
        .sort({ comments: -1 })
        .limit(5)
        .then(result => {
            res.json(result)
        }).catch(err => {
            console.log(err)
        })
})

export default router