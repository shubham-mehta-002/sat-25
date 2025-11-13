import React, { useEffect, useState } from 'react'
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ReplyIcon from '@mui/icons-material/Reply';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import { NavLink, useNavigate } from 'react-router-dom';
import WitLikes from './WitLikes';
import { formatDistanceToNow } from 'date-fns';
import WitDislikes from './WitDislikes';
import { LoginContext } from '../../../../Context/LoginContext';
import { RiCloseLine } from "react-icons/ri";
import { toast } from "react-toastify";
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteWitPost from './DeleteWitPost';
import usericon from '../../../../assets/usericon.png'

const WitPost = ({ url, username, caption, content, post_id, liked, disliked, count_comments, count_likes, count_dislikes, data, deleteOption, bannedwords }) => {
  const [Witlike, setWitLike] = useState(liked)
  const [Witdislike, setWitDislike] = useState(disliked)
  const [Witc_like, setWitC_like] = useState(count_likes)
  const [Witc_dislike, setWitC_dislike] = useState(count_dislikes)
  const [Witc_comments, setWitC_comments] = useState(count_comments)
  const temp1 = localStorage.getItem("jwt")
  const timeAgo = data?.date ? formatDistanceToNow(new Date(data.date), { addSuffix: true }) : ''

  let status = () => {
    if (temp1) {
      return true
    }
    return false
  }

  const [showWitLikes, setShowWitLikes] = useState(false)
  const [showWitDislikes, setShowWitDislikes] = useState(false)
  const [showWitComments, setShowWitComments] = useState(false)
  const [showWitDeleteBox, setShowWitDeleteBox] = useState(false)

  const [Witcomment, setWitComment] = useState("")
  const [WitcommentList, setWitCommentList] = useState([])

  const [showWitreplyinput, setShowWitreplyinput] = useState(false)

  const [Witreply, setWitReply] = useState("")
  const [WitreplyList, setWitReplyList] = useState([])

  const makeWitComment = (text, id) => {
    if (text === "") {
      notifycomment()
      return
    }
    for (let word in bannedwords) {
      if (text.toLowerCase().includes(bannedwords[word])) {
        toast.warn("Banned Word Detected")
        return
      }
    }
    fetch(`${import.meta.env.VITE_BACKEND_URI}/api/makewitcomment`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`
      },
      body: JSON.stringify({
        postId: id,
        text: text
      })
    }).then(res => res.json())
      .then(result => {
        if (result.error == "You must be logged in") {
          notifysignin()
          navigate('/signin')
          return
        }
        setWitCommentList(result)
        setWitC_comments(Witc_comments + 1)
        setWitComment("")
      })
  }

  // to get comments and replies
  const getWitComments = (id) => {
    fetch(`${import.meta.env.VITE_BACKEND_URI}/api/showwitcomments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`
      },
      body: JSON.stringify({
        postId: id,
      })
    }).then(res => res.json())
      .then(result => {
        if (result.error == "You must be logged in") {
          notifysignin()
          navigate('/signin')
          return
        }
        setWitCommentList(result)
      })
  }

  const deleteWitComment = (commentID, postID) => {
    fetch(`${import.meta.env.VITE_BACKEND_URI}/api/removewitcomment`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`
      },
      body: JSON.stringify({
        postId: postID,
        comment_id: commentID
      })
    }).then(res => res.json())
      .then(result => {
        if (result.error == "You must be logged in") {
          notifysignin()
          navigate('/signin')
          return
        }
        setWitCommentList(result)
        setWitC_comments(c_comments - 1)
        notifyremovedcomment()
        setShowWitComments(false)
      })
  }

  const navigate = useNavigate();
  const notifysignin = () => toast.info('Please sign in first!')
  const notifycomment = () => toast.info("Comment cannot be empty!")
  const notifyremovedcomment = () => toast.success("Comment Deleted")


  const WitlikePost = (post_id) => {
    if (Witdislike) {
      removeWitDislikePost(post_id)
    }
    // setLike(true)
    fetch(`${import.meta.env.VITE_BACKEND_URI}/api/witlike`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`
      },
      body: JSON.stringify({
        postId: post_id
      })
    }).then(res => res.json())
      .then(result => {
        if (result.error == "You must be logged in") {
          notifysignin()
          navigate('/signin')
          return
        }
        setWitLike(true)
        setWitC_like(Witc_like + 1)
      })
  }
  const WitdislikePost = (post_id) => {
    if (Witlike) {
      removeWitLikePost(post_id)
    }
    // setDislike(true)
    fetch(`${import.meta.env.VITE_BACKEND_URI}/api/witdislike`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`
      },
      body: JSON.stringify({
        postId: post_id
      })
    }).then(res => res.json())
      .then(result => {
        if (result.error == "You must be logged in") {
          notifysignin()
          navigate('/signin')
          return
        }
        setWitDislike(true)
        setWitC_dislike(Witc_dislike + 1)
      })
  }
  const removeWitLikePost = (post_id) => {
    // setLike(false)
    fetch(`${import.meta.env.VITE_BACKEND_URI}/api/witunlike`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`
      },
      body: JSON.stringify({
        postId: post_id
      })
    }).then(res => res.json())
      .then(result => {
        if (result.error == "You must be logged in") {
          notifysignin()
          navigate('/signin')
          return
        }
        setWitLike(false)
        setWitC_like(Witc_like - 1)
      })
  }
  const removeWitDislikePost = (post_id) => {
    // setDislike(false)
    fetch(`${import.meta.env.VITE_BACKEND_URI}/api/witundislike`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`
      },
      body: JSON.stringify({
        postId: post_id
      })
    }).then(res => res.json())
      .then(result => {
        if (result.error == "You must be logged in") {
          notifysignin()
          navigate('/signin')
          return
        }
        setWitDislike(false)
        setWitC_dislike(Witc_dislike - 1)
      })
  }
  const handleWitShowComment = (index) => {
    document.getElementById(index).classList.toggle("flex");
  }

  const makeWitReply = (replytext, commentid, postid) => {
    if (replytext == "") {
      notifycomment()
      return
    }
    else {
      for (let word in bannedwords) {
        if (replytext.toLowerCase().includes(bannedwords[word])) {
          toast.warn("Banned Word Detected")
          return
        }
      }
      fetch(`${import.meta.env.VITE_BACKEND_URI}/api/witreplycomment`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwt")}`
        },
        body: JSON.stringify({
          postId: postid,
          userid: JSON.parse(localStorage.getItem("user"))._id,
          comment_id: commentid,
          text: replytext
        })
      }).then(res => res.json())
        .then(result => {
          if (result.error == "You must be logged in") {
            notifysignin()
            navigate('/signin')
            return
          }
          setWitCommentList(result)
          setWitC_comments(Witc_comments + 1)
          setShowWitComments(false)
          setWitReply("")
        })
    }
  }

  const deleteWitreply = (commentid, postid, replyid) => {
    fetch(`${import.meta.env.VITE_BACKEND_URI}/api/removewitreplycomment`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`
      },
      body: JSON.stringify({
        postId: postid,
        comment_id: commentid,
        reply_id: replyid
      })
    }).then(res => res.json())
      .then(result => {
        if (result.error == "You must be logged in") {
          notifysignin()
          navigate('/signin')
          return
        }
        else {
          notifydeletereply()
          setWitCommentList(result)
          setWitC_comments(c_comments - 1)
          setShowWitComments(false)
        }
      })
  }

  const notifydeletereply = () => toast.success("Reply Deleted")

  return (
    <>
      <LoginContext.Provider value={{ showWitLikes, setShowWitLikes, showWitDislikes, setShowWitDislikes, showWitDeleteBox, setShowWitDeleteBox }}>
        <div className='postcontainer flex flex-col'>
          <div className='header flex items-center justify-between'>
            <div className='left_header flex items-center'>
              {(status()) ?
                ((data.postedby._id != JSON.parse(localStorage.getItem("user"))._id) ?
                  <NavLink to={`/profile/${data.postedby._id}`} draggable="false">
                    <div className='profile_pic flex'>
                      {(url && url != "") ?
                        <img src={url} alt="" className='image' draggable="false" />
                        :
                        <img src={usericon} alt="" className='image' draggable="false" />
                      }
                    </div>
                  </NavLink>
                  :
                  <NavLink to={`/profile`} draggable="false">
                    <div className='profile_pic flex'>
                      {(url && url != "") ?
                        <img src={url} alt="" className='image' draggable="false" />
                        :
                        <img src={usericon} alt="" className='image' draggable="false" />
                      }
                    </div>
                  </NavLink>)
                :
                <NavLink to={`/signin`} onClick={() => notifysignin()} draggable="false">
                  <div className='profile_pic flex'>
                    {(url && url != "") ?
                      <img src={url} alt="" className='image' draggable="false" />
                      :
                      <img src={usericon} alt="" className='image' draggable="false" />
                    }
                  </div>
                </NavLink>
              }
              {(status()) ?
                ((data.postedby._id != JSON.parse(localStorage.getItem("user"))._id) ?
                  <NavLink to={`/profile/${data.postedby._id}`} draggable="false">
                    <div className='username'>
                      {username}
                    </div>
                  </NavLink>
                  :
                  <NavLink to={`/profile`} draggable="false">
                    <div className='username'>
                      {username}
                    </div>
                  </NavLink>)
                :
                <NavLink to={`/signin`} onClick={() => notifysignin()} draggable="false">
                  <div className='username'>
                    {username}
                  </div>
                </NavLink>
              }
            </div>
            {(deleteOption) ? <div className="right_header flex items-center px-4 pb-2 cursor-pointer" onClick={() => setShowWitDeleteBox(true)} >
              <DeleteIcon fontSize='medium' className='hover:text-3xl' />
            </div> :
              null}
          </div>
          <div className="content">
            <div className='text-left'>{caption}</div>
            <img src={content} alt="" className='postimage' onDoubleClick={(e) => likePost(post_id)} draggable="false" />
          </div>
          <div className='footer flex gap-5 justify-between px-4'>
            <div className=' flex gap-5'>
              <div className='likes flex flex-col justify-center items-center'>
                {(status()) ?
                  <div className='cursor-pointer text-lg' onClick={() => setShowWitLikes(true)}>{Witc_like}</div>
                  :
                  <NavLink to={'/signin'} onClick={() => notifysignin()} draggable="false">
                    <div className='text-lg'>{Witc_like}</div>
                  </NavLink>}
                {(Witlike) ?
                  <div className='cursor-pointer' onClick={(e) => removeWitLikePost(post_id)}>
                    <ThumbUpAltIcon fontSize='medium' />
                  </div>
                  :
                  <div className='cursor-pointer' onClick={(e) => WitlikePost(post_id)}>
                    <ThumbUpOffAltIcon fontSize='medium' />
                  </div>}
              </div>
              <div className='Dislikes flex flex-col justify-center items-center'>
                {(status()) ?
                  <div onClick={() => setShowWitDislikes(true)} className='cursor-pointer text-lg'>{Witc_dislike}</div>
                  :
                  <NavLink to={'/signin'} onClick={() => notifysignin()} draggable="false">
                    <div className='cursor-pointer text-lg'>{Witc_dislike}</div>
                  </NavLink>
                }
                {(Witdislike) ? <div className='cursor-pointer' onClick={(e) => removeWitDislikePost(post_id)}>
                  <ThumbDownAltIcon fontSize='medium' />
                </div>
                  : <div className='cursor-pointer' onClick={(e) => WitdislikePost(post_id)}>
                    <ThumbDownOffAltIcon fontSize='medium' />
                  </div>}
              </div>
              <div className='comments flex flex-col justify-center items-center'>
                <div onClick={() => {
                  getWitComments(post_id)
                  setShowWitComments(true)
                }} className='cursor-pointer text-lg'>{Witc_comments}</div>
                <div className='cursor-pointer' onClick={() => {
                  getWitComments(post_id)
                  setShowWitComments(true)
                }}>
                  <ChatBubbleOutlineOutlinedIcon fontSize='medium' />
                </div>
              </div>
            </div>

          </div>
          <div className="commentinput flex py-4 px-2 gap-2">
            <textarea className='input_comment' draggable="false" placeholder="Add a comment..." value={Witcomment} onChange={(e) => setWitComment(e.target.value)}></textarea>
            <button className='post_button hover:font-bold py-3' onClick={() => makeWitComment(Witcomment, post_id)}>Post</button>
          </div>
          <div className="commentinput flex py-4 px-2 gap-2">
            <div>{timeAgo}</div>
          </div>
        </div>
        {showWitLikes && <WitLikes post_id={post_id} setShowWitLikes={setShowWitLikes} />}
        {showWitDislikes && <WitDislikes post_id={post_id} setShowWitDislikes={setShowWitDislikes} />}
        {showWitDeleteBox && <DeleteWitPost post_id={post_id} setShowWitDeleteBox={setShowWitDeleteBox} />}
      </LoginContext.Provider>
      {(showWitComments) ?
        <>
          <div className="show_comments" onClick={() => setShowWitComments(false)}></div>
          <div className="center-div w-4/5 lg:w-1/2 h-[32%] lg:h-[15%]">
            <div className="container flex h-[35%] lg:h-[50%]">
              <div className="closeBtn">
                <button onClick={() => setShowWitComments(false)}>
                  <RiCloseLine></RiCloseLine>
                </button>
              </div>
              <div className="postPic hidden lg:block">
                <div className='text-left text-wrap overflow-scroll'>{caption}</div>
                <img src={content} alt="" draggable="false" className='postimage' />
              </div>
              <div className="details flex flex-col w-full lg:w-[60%]">
                <div className='header flex items-center'>
                  <div className='profile_pic flex'>
                    {(data.postedby._id == JSON.parse(localStorage.getItem("user"))._id) ?
                      <NavLink to={`/profile`} draggable="false">
                        {(url && url != "") ?
                          <img src={url} alt="" className='image' draggable="false" />
                          :
                          <img src={usericon} alt="" className='image' draggable="false" />
                        }
                      </NavLink>
                      :
                      <NavLink to={`/profile/${data.postedby._id}`} draggable="false">
                        {(url && url != "") ?
                          <img src={url} alt="" className='image' draggable="false" />
                          :
                          <img src={usericon} alt="" className='image' draggable="false" />
                        }
                      </NavLink>}
                  </div>
                  <div className='username'>
                    {(data.postedby._id == JSON.parse(localStorage.getItem("user"))._id) ?
                      <NavLink draggable="false" to={`/profile`}>{username}</NavLink>
                      :
                      <NavLink draggable="false" to={`/profile/${data.postedby._id}`}>{username}</NavLink>}
                  </div>
                </div>
                <div className="comment-section mt-2">
                  <div className="comm">
                    {WitcommentList.map((item, index) => {
                      return (
                        <div key={index}>
                          <div key={index} className='comment flex gap-2 lg:gap-6  items-center justify-start w-full'>
                            <span className="commenter font-bold w-1/3 lg:w-4/12 overflow-hidden flex items-center gap-2">
                              {(item.postedby._id == JSON.parse(localStorage.getItem("user"))._id) ?
                                <NavLink to={`/profile`} draggable="false">
                                  {(item.postedby.profile_photo && item.postedby.profile_photo != "") ?
                                    <img src={item.postedby.profile_photo} alt="" className='h-5 rounded-full w-5 hidden lg:block' />
                                    :
                                    <img src={usericon} alt="" className='h-5 rounded-full w-5 border border-gray-400 hidden lg:block' />
                                  }
                                </NavLink>
                                :
                                <NavLink to={`/profile/${item.postedby._id}`} draggable="false">
                                  {(item.postedby.profile_photo && item.postedby.profile_photo != "") ?
                                    <img src={item.postedby.profile_photo} alt="" className='h-5 rounded-full w-5' />
                                    :
                                    <img src={usericon} alt="" className='h-5 rounded-full w-5 border border-gray-400' />
                                  }
                                </NavLink>}
                              {(item.postedby._id == JSON.parse(localStorage.getItem("user"))._id) ?
                                <NavLink to={`/profile`} draggable="false">
                                  {`@${item.postedby.userName}`}
                                </NavLink>
                                :
                                <NavLink to={`/profile/${item.postedby._id}`} draggable="false">
                                  {`@${item.postedby.userName}`}
                                </NavLink>}
                            </span>
                            <span className="comment-text  w-1/2 lg:w-2/5">{item.comment}</span>
                            <span className='commentoptions flex w-1/5 lg:w-2/12 gap-2'>
                              {(JSON.parse(localStorage.getItem("user"))._id == item.postedby._id || (data.postedby._id == JSON.parse(localStorage.getItem("user"))._id)) ?
                                <>
                                  <DeleteIcon fontSize='small' onClick={() => deleteWitComment(item._id, post_id)} style={{ cursor: 'pointer' }} />
                                  <ReplyIcon fontSize='small' style={{ 'cursor': "pointer" }} onClick={() => {
                                    handleWitShowComment(index);
                                  }} />
                                </>
                                :
                                <ReplyIcon fontSize='small' style={{ 'cursor': "pointer" }} onClick={() => {
                                  handleWitShowComment(index);
                                }} />
                              }
                            </span>
                          </div>
                          <>
                            <div className=" replyinput  py-4 px-1 gap-1" id={index}>
                              <textarea className='input_comment' draggable="false" placeholder="Add a reply..." value={Witreply} onChange={(e) => setWitReply(e.target.value)} ></textarea>
                              <button className='py-3 post_button hover:font-bold' onClick={() => {
                                makeWitReply(Witreply, item._id, post_id)
                              }}>Post</button>
                            </div>
                          </>
                          <div className='my-5'>
                            {item.replies.map((reply, index) => {
                              return (
                                <div className='comment flex gap-6 items-center justify-start ml-10 w-full' key={index}>
                                  <span className='w-1/12 hidden lg:block'>
                                    {(reply.postedby._id == JSON.parse(localStorage.getItem("user"))._id) ?
                                      <NavLink to={`/profile`} draggable="false">
                                        {(reply.postedby.profile_photo && reply.postedby.profile_photo != "") ?
                                          <img src={reply.postedby.profile_photo} alt="" className='h-5 rounded-full w-5' />
                                          :
                                          <img src={usericon} alt="" className='h-5 rounded-full w-5 border border-gray-400' />
                                        }
                                      </NavLink>
                                      :
                                      <NavLink to={`/profile/${reply.postedby._id}`} draggable="false">
                                        {(reply.postedby.profile_photo && reply.postedby.profile_photo != "") ?
                                          <img src={reply.postedby.profile_photo} alt="" className='h-5 rounded-full w-5' />
                                          :
                                          <img src={usericon} alt="" className='h-5 rounded-full w-5 border border-gray-400' />
                                        }
                                      </NavLink>}
                                  </span>
                                  <span className='w-3/12'>
                                    {(reply.postedby._id == JSON.parse(localStorage.getItem("user"))._id) ?
                                      <NavLink to={`/profile`} draggable="false">
                                        <h1 className='font-bold'>{`@${reply.postedby.userName}`}</h1>
                                      </NavLink>
                                      :
                                      <NavLink to={`/profile/${reply.postedby._id}`} draggable="false">
                                        <h1 className='font-bold'>{`@${reply.postedby.userName}`}</h1>
                                      </NavLink>}
                                  </span>
                                  <span className='comment-text overflow-hidden w-2/5 text-wrap'>{reply.reply}</span>
                                  <span className='w-1/12'>
                                    {(JSON.parse(localStorage.getItem("user"))._id == reply.postedby._id || (data.postedby._id == JSON.parse(localStorage.getItem("user"))._id)) ?
                                      <>
                                        <DeleteIcon fontSize='small' onClick={() => deleteWitreply(item._id, post_id, reply._id)} style={{ cursor: 'pointer' }} />
                                      </>
                                      :
                                      null
                                    }
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )
                    }
                    )}
                  </div>
                </div>
                <div className="commentinput flex py-4 px-1 gap-1">
                  <textarea className='input_comment' draggable="false" placeholder="Add a comment..." value={Witcomment} onChange={(e) => setWitComment(e.target.value)}></textarea>
                  <button className='py-3 post_button hover:font-bold' onClick={() => {
                    makeWitComment(Witcomment, post_id)
                    setShowWitComments(false)
                  }}>Post</button>
                </div>
              </div>
            </div>

          </div>
        </>
        :
        null
      }
    </>
  )
}

export default WitPost