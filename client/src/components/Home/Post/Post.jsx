import React, { useEffect, useState } from 'react'
import './Post.css'
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ReplyIcon from '@mui/icons-material/Reply';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import { NavLink, useNavigate } from 'react-router-dom';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import Likes from './Likes/Likes';
import Dislikes from './Dislikes/Dislikes';
import { LoginContext } from '../../../Context/LoginContext';
import { RiCloseLine } from "react-icons/ri";
import { toast } from "react-toastify";
import DeleteIcon from '@mui/icons-material/Delete';
import DeletePost from './DeletePost/DeletePost';
import usericon from '../../../assets/usericon.png'
import { formatDistanceToNow } from 'date-fns';

const Post = ({ url, username, caption, content, post_id, liked, disliked, count_comments, count_likes, count_dislikes, data, deleteOption }) => {
  const [like, setLike] = useState(liked)
  const [dislike, setDislike] = useState(disliked)
  const [c_like, setC_like] = useState(count_likes)
  const [c_dislike, setC_dislike] = useState(count_dislikes)
  const [c_comments, setC_comments] = useState(count_comments)
  const temp1 = localStorage.getItem("jwt")
  const [savepostflag, setSavepostflag] = useState(false)
  const timeAgo = data?.date ? formatDistanceToNow(new Date(data.date), { addSuffix: true }) : ''


  const removefromsavedposts = () => {
    fetch(`${import.meta.env.VITE_BACKEND_URI}/api/removesavedpost`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`
      },
      body: JSON.stringify({
        userid: JSON.parse(localStorage.getItem("user"))._id,
        post_id: post_id
      })
    }).then(res => res.json())
      .then(result => {
        if (result.error == "You must be logged in") {
          notifysignin()
          navigate('/signin')
          return
        }
        notifyremovefromsaved()
        setSavepostflag(false)
      })
  }
  const addtosavedposts = () => {
    if (localStorage.getItem("jwt") == null) {
      notifysignin()
      navigate('/signin')
      return
    }
    fetch(`${import.meta.env.VITE_BACKEND_URI}/api/addsavedpost`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`
      },
      body: JSON.stringify({
        userid: JSON.parse(localStorage.getItem("user"))._id,
        post_id: post_id
      })
    }).then(res => res.json())
      .then(result => {
        if (result.error == "You must be logged in") {
          notifysignin()
          navigate('/signin')
          return
        }
        notifyaddedtosaved()
        setSavepostflag(true)
      })
  }

  useEffect(() => {
    if (localStorage.getItem("jwt") == null) {
      setSavepostflag(false)
      return
    }
    fetch(`${import.meta.env.VITE_BACKEND_URI}/api/checksavedposts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`
      },
      body: JSON.stringify({
        userid: JSON.parse(localStorage.getItem("user"))._id,
        post_id: post_id
      })
    }).then(res => res.json())
      .then(result => {
        if (result.error == "You must be logged in") {
          notifysignin()
          navigate('/signin')
          return
        }
        setSavepostflag(result.saved)
      })
  }, [])
  let status = () => {
    if (temp1) {
      return true
    }
    return false
  }

  const [showLikes, setShowLikes] = useState(false)
  const [showDislikes, setShowDislikes] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [showDeleteBox, setShowDeleteBox] = useState(false)

  const [comment, setComment] = useState("")
  const [commentList, setCommentList] = useState([])

  const [showreplyinput, setShowreplyinput] = useState(false)

  const [reply, setReply] = useState("")
  const [replyList, setReplyList] = useState([])

  const makeComment = (text, id) => {
    if (text === "") {
      notifycomment()
      return
    }
    fetch(`${import.meta.env.VITE_BACKEND_URI}/api/makecomment`, {
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
        setCommentList(result)
        setC_comments(c_comments + 1)
        setComment("")
      })
  }

  // to get comments and replies
  const getComments = (id) => {
    fetch(`${import.meta.env.VITE_BACKEND_URI}/api/showcomments`, {
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
        setCommentList(result)
      })
  }

  const deleteComment = (commentID, postID) => {
    fetch(`${import.meta.env.VITE_BACKEND_URI}/api/removecomment`, {
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
        setCommentList(result)
        setC_comments(c_comments - 1)
        notifyremovedcomment()
        setShowComments(false)
      })
  }

  const navigate = useNavigate();
  const notifysignin = () => toast.info('Please sign in first!')
  const notifycomment = () => toast.info("Comment cannot be empty!")
  const notifyaddedtosaved = () => toast.success("Added to saved posts")
  const notifyremovefromsaved = () => toast.success("Removed from saved posts")
  const notifyremovedcomment = () => toast.success("Comment Deleted")


  const likePost = (post_id) => {
    if (dislike) {
      removeDislikePost(post_id)
    }
    // setLike(true)
    fetch(`${import.meta.env.VITE_BACKEND_URI}/api/like`, {
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
        setLike(true)
        setC_like(c_like + 1)
      })
  }
  const dislikePost = (post_id) => {
    if (like) {
      removeLikePost(post_id)
    }
    // setDislike(true)
    fetch(`${import.meta.env.VITE_BACKEND_URI}/api/dislike`, {
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
        setDislike(true)
        setC_dislike(c_dislike + 1)
      })
  }
  const removeLikePost = (post_id) => {
    // setLike(false)
    fetch(`${import.meta.env.VITE_BACKEND_URI}/api/unlike`, {
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
        setLike(false)
        setC_like(c_like - 1)
      })
  }
  const removeDislikePost = (post_id) => {
    // setDislike(false)
    fetch(`${import.meta.env.VITE_BACKEND_URI}/api/undislike`, {
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
        setDislike(false)
        setC_dislike(c_dislike - 1)
      })
  }
  const handleShowComment = (index) => {
    document.getElementById(index).classList.toggle("flex");
  }

  const makeReply = (replytext, commentid, postid) => {
    if (replytext == "") {
      notifycomment()
      return
    }
    else {
      fetch(`${import.meta.env.VITE_BACKEND_URI}/api/replycomment`, {
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
          setCommentList(result)
          setC_comments(c_comments + 1)
          setShowComments(false)
          setReply("")
        })
    }
  }

  const deletereply = (commentid, postid, replyid) => {
    fetch(`${import.meta.env.VITE_BACKEND_URI}/api/removereplycomment`, {
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
          setCommentList(result)
          setC_comments(c_comments - 1)
          setShowComments(false)
        }
      })
  }

  const notifydeletereply = () => toast.success("Reply Deleted")

  return (
    <>
      <LoginContext.Provider value={{ showLikes, setShowLikes, showDislikes, setShowDislikes, showDeleteBox, setShowDeleteBox }}>
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
            {(deleteOption) ? <div className="right_header flex items-center px-4 pb-2 cursor-pointer" onClick={() => setShowDeleteBox(true)} >
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
                  <div className='cursor-pointer text-lg' onClick={() => setShowLikes(true)}>{c_like}</div>
                  :
                  <NavLink to={'/signin'} onClick={() => notifysignin()} draggable="false">
                    <div className='text-lg'>{c_like}</div>
                  </NavLink>}
                {(like) ?
                  <div className='cursor-pointer' onClick={(e) => removeLikePost(post_id)}>
                    <ThumbUpAltIcon fontSize='medium' />
                  </div>
                  :
                  <div className='cursor-pointer' onClick={(e) => likePost(post_id)}>
                    <ThumbUpOffAltIcon fontSize='medium' />
                  </div>}
              </div>
              <div className='Dislikes flex flex-col justify-center items-center'>
                {(status()) ?
                  <div onClick={() => setShowDislikes(true)} className='cursor-pointer text-lg'>{c_dislike}</div>
                  :
                  <NavLink to={'/signin'} onClick={() => notifysignin()} draggable="false">
                    <div className='cursor-pointer text-lg'>{c_dislike}</div>
                  </NavLink>
                }
                {(dislike) ? <div className='cursor-pointer' onClick={(e) => removeDislikePost(post_id)}>
                  <ThumbDownAltIcon fontSize='medium' />
                </div>
                  : <div className='cursor-pointer' onClick={(e) => dislikePost(post_id)}>
                    <ThumbDownOffAltIcon fontSize='medium' />
                  </div>}
              </div>
              <div className='comments flex flex-col justify-center items-center'>
                <div onClick={() => {
                  if (localStorage.getItem('jwt') == null) {
                    notifysignin()
                    navigate('/signin')
                    return
                  }
                  getComments(post_id)
                  setShowComments(true)
                }} className='cursor-pointer text-lg'>{c_comments}</div>
                <div className='cursor-pointer' onClick={() => {
                  if (localStorage.getItem('jwt') == null) {
                    notifysignin()
                    navigate('/signin')
                    return
                  }
                  getComments(post_id)
                  setShowComments(true)
                }}>
                  <ChatBubbleOutlineOutlinedIcon fontSize='medium' />
                </div>
              </div>
            </div>
            <div className='savepost flex items-center justify-center'>
              {(savepostflag) ?
                <BookmarkIcon fontSize='large' className='cursor-pointer' onClick={(e) => {
                  removefromsavedposts()
                }} />
                :
                <BookmarkBorderIcon fontSize='large' className='cursor-pointer' onClick={(e) => {
                  addtosavedposts()
                }} />}
            </div>
          </div>
          <div className="commentinput flex py-4 px-2 gap-2">
            <textarea className='input_comment' draggable="false" placeholder="Add a comment..." value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
            <button className='post_button hover:font-bold py-3' onClick={() => makeComment(comment, post_id)}>Post</button>
          </div>
          <div className="commentinput flex py-2 px-2 gap-2">
            <div>{timeAgo}</div>
          </div>
        </div>
        {showLikes && <Likes post_id={post_id} setShowLikes={setShowLikes} />}
        {showDislikes && <Dislikes post_id={post_id} setShowDislikes={setShowDislikes} />}
        {showDeleteBox && <DeletePost post_id={post_id} setShowDeleteBox={setShowDeleteBox} />}
      </LoginContext.Provider>
      {(showComments) ?
        <>
          <div className="show_comments text-sm lg:text-lg" onClick={() => setShowComments(false)}></div>
          <div className="center-div w-4/5 lg:w-1/2 h-[32%] lg:h-[15%]">
            <div className="container flex h-[35%] lg:h-[50%]">
              <div className="closeBtn">
                <button onClick={() => setShowComments(false)}>
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
                <div className="comment-section mt-2 overflow-x-hidden">
                  <div className="comm">
                    {commentList.map((item, index) => {
                      return (
                        <>
                          <div key={index} className='comment flex gap-2 lg:gap-6 items-center justify-start w-full'>
                            <span className="commenter font-bold w-1/3 lg:w-4/12 overflow-hidden flex items-center gap-2">
                              {(item.postedby._id == JSON.parse(localStorage.getItem("user"))._id) ?
                                <NavLink to={`/profile`} draggable="false" className={`hidden lg:block`}>
                                  {(item.postedby.profile_photo && item.postedby.profile_photo != "") ?
                                    <img src={item.postedby.profile_photo} alt="" className='h-5 rounded-full w-5' />
                                    :
                                    <img src={usericon} alt="" className='h-5 rounded-full w-5 border border-gray-400' />
                                  }
                                </NavLink>
                                :
                                <NavLink to={`/profile/${item.postedby._id}`} draggable="false" className={`hidden lg:block`}>
                                  {(item.postedby.profile_photo && item.postedby.profile_photo != "") ?
                                    <img src={item.postedby.profile_photo} alt="" className='h-5 rounded-full w-5' />
                                    :
                                    <img src={usericon} alt="" className='h-5 rounded-full w-5 border border-gray-400' />
                                  }
                                </NavLink>}
                              {(item.postedby._id == JSON.parse(localStorage.getItem("user"))._id) ?
                                <NavLink to={`/profile`} draggable="false" className={'mr-[-6px] lg:mr-0'}>
                                  {`@${item.postedby.userName}`}
                                </NavLink>
                                :
                                <NavLink to={`/profile/${item.postedby._id}`} draggable="false" className={'mr-[-6px] lg:mr-0'}>
                                  {`@${item.postedby.userName}`}
                                </NavLink>}
                            </span>
                            <span className="comment-text w-1/2 lg:w-2/5">{item.comment}</span>
                            <span className='commentoptions flex w-1/5 lg:w-2/12 gap-2'>
                              {(JSON.parse(localStorage.getItem("user"))._id == item.postedby._id || (data.postedby._id == JSON.parse(localStorage.getItem("user"))._id)) ?
                                <>
                                  <DeleteIcon fontSize='small' onClick={() => deleteComment(item._id, post_id)} style={{ cursor: 'pointer' }} />
                                  <ReplyIcon fontSize='small' style={{ 'cursor': "pointer" }} onClick={() => {
                                    handleShowComment(index);
                                  }} />
                                </>
                                :
                                <ReplyIcon fontSize='small' style={{ 'cursor': "pointer" }} onClick={() => {
                                  // setShowreplyinput(!showreplyinput)
                                  handleShowComment(index);
                                }} />
                              }
                            </span>
                          </div>
                          <>
                            <div className=" replyinput  py-4 px-1 gap-1" id={index}>
                              <textarea className='input_comment' draggable="false" placeholder="Add a reply..." value={reply} onChange={(e) => setReply(e.target.value)} ></textarea>
                              <button className='py-3 post_button hover:font-bold' onClick={() => {
                                makeReply(reply, item._id, post_id)
                                // setShowreplyinput(false)
                              }}>Post</button>
                            </div>
                          </>
                          <div className='my-5'>
                            {item.replies.map((reply) => {
                              return (
                                <div className='comment flex gap-4 items-center justify-start ml-10 w-full'>
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
                                  <span className='w-3/12 mr-[-7px] lg:mr-0'>
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
                                        <DeleteIcon fontSize='small' onClick={() => deletereply(item._id, post_id, reply._id)} style={{ cursor: 'pointer' }} />
                                      </>
                                      :
                                      null
                                    }
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        </>
                      )
                    }
                    )}
                  </div>
                </div>
                <div className="commentinput flex py-4 px-1 gap-1">
                  <textarea className='input_comment' draggable="false" placeholder="Add a comment..." value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
                  <button className='py-3 post_button hover:font-bold' onClick={() => {
                    makeComment(comment, post_id)
                    setShowComments(false)
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

export default Post