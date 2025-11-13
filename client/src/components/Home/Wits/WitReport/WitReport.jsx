import React, { useEffect, useState } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import WitPost from '../WitPostPage/WitPost'
const WitReport = () => {
    const witid = useParams().statswitid
    const [witName, setWitName] = useState("")

    const [likedWitPosts, setLikedWitPosts] = useState([])
    const [disLikedWitPosts, setDislikedWitPosts] = useState([])
    const [commentedWitPosts, setCommentedWitPosts] = useState([])

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URI}/api/getmostlikedposts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            },
            body: JSON.stringify({
                witid: witid
            })
        }).then(res => res.json())
            .then(result => {
                setLikedWitPosts(result)
                setWitName(result[0].postedin.name)
            })

        fetch(`${import.meta.env.VITE_BACKEND_URI}/api/getmostdislikedposts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            },
            body: JSON.stringify({
                witid: witid
            })
        }).then(res => res.json())
            .then(result => {
                setDislikedWitPosts(result)
            })

        fetch(`${import.meta.env.VITE_BACKEND_URI}/api/getmostcommentedposts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            },
            body: JSON.stringify({
                witid: witid
            })
        }).then(res => res.json())
            .then(result => {
                setCommentedWitPosts(result)
            })
    }, [])

    return (
        <div>
            <div className="profile text-center flex flex-col gap-8">
                <div className="post_bar">
                    <div className='text-xl  flex justify-between px-3'>
                        <NavLink to={`/wits`} draggable="false">
                            <button>
                                Back
                            </button>
                        </NavLink>
                        <div className='font-bold '>
                            {witName}
                        </div>
                    </div>
                </div>
                <div className='text-xl font-bold'>Most Liked Posts</div>
                <div className='post-container gap-4 flex flex-col'>
                    {likedWitPosts.map((data) => {
                        let count = 0
                        count += data.comments.length
                        data.comments.forEach(reply => {
                            count += reply.replies.length
                        })
                        return (
                            <WitPost url={data.postedby.profilePhoto} username={`@${data.postedby.userName}`} caption={data.caption} content={data.image} post_id={data._id} key={data._id} liked={data.likes.includes(JSON.parse(localStorage.getItem("user"))._id)} disliked={data.dislikes.includes(JSON.parse(localStorage.getItem("user"))._id)} bannedwords={data.banned_words} count_likes={data.likes.length} count_dislikes={data.dislikes.length} data={data} count_comments={count} deleteOption={
                                ((data.postedby._id == JSON.parse(localStorage.getItem("user"))._id) || (data.postedin.moderator == JSON.parse(localStorage.getItem("user"))._id)) ?
                                    true
                                    :
                                    false
                            } />
                        )
                    })}
                </div>
                <div className='text-xl font-bold'>Most Disliked Posts</div>
                 <div className='post-container gap-4 flex flex-col'>
                 {disLikedWitPosts.map((data) => {
                        let count = 0
                        count += data.comments.length
                        data.comments.forEach(reply => {
                            count += reply.replies.length
                        })
                        return (
                            <WitPost url={data.postedby.profilePhoto} username={`@${data.postedby.userName}`} caption={data.caption} content={data.image} post_id={data._id} key={data._id} liked={data.likes.includes(JSON.parse(localStorage.getItem("user"))._id)} disliked={data.dislikes.includes(JSON.parse(localStorage.getItem("user"))._id)} bannedwords={data.banned_words} count_likes={data.likes.length} count_dislikes={data.dislikes.length} data={data} count_comments={count} deleteOption={
                                ((data.postedby._id == JSON.parse(localStorage.getItem("user"))._id) || (data.postedin.moderator == JSON.parse(localStorage.getItem("user"))._id)) ?
                                    true
                                    :
                                    false
                            } />
                        )
                    })}
                 </div>
                <div className='text-xl font-bold'>Most Commented Posts</div>
                 <div className='post-container gap-4 flex flex-col'>
                 {commentedWitPosts.map((data) => {
                        let count = 0
                        count += data.comments.length
                        data.comments.forEach(reply => {
                            count += reply.replies.length
                        })
                        return (
                            <WitPost url={data.postedby.profilePhoto} username={`@${data.postedby.userName}`} caption={data.caption} content={data.image} post_id={data._id} key={data._id} liked={data.likes.includes(JSON.parse(localStorage.getItem("user"))._id)} disliked={data.dislikes.includes(JSON.parse(localStorage.getItem("user"))._id)} bannedwords={data.banned_words} count_likes={data.likes.length} count_dislikes={data.dislikes.length} data={data} count_comments={count} deleteOption={
                                ((data.postedby._id == JSON.parse(localStorage.getItem("user"))._id) || (data.postedin.moderator == JSON.parse(localStorage.getItem("user"))._id)) ?
                                    true
                                    :
                                    false
                            } />
                        )
                    })}
                 </div>
            </div>
        </div>
    )
}

export default WitReport