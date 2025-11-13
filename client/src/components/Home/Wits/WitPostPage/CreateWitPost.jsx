import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import imageicon from '../../../../assets/pic_icon.webp'
import usericon from '../../../../assets/usericon.png'
const CreateWitPost = () => {
    const witid = useParams().witid
    const [caption, setCaption] = useState("")
    const [image, setImage] = useState("")
    const [profilephotocreatebar, setProfilephotocreatebar] = useState("")
    const [loadStatus, setLoadStatus] = useState(false)

    const navigate = useNavigate()

    const notifyError = () => toast.error('Something went wrong while posting!')
    const notifyFields = () => toast.error('Either post image or caption!')
    const notifySuccess = () => toast.success('Posted Successfully!')
    const notifysignin = () => toast.info('Please sign in first!')

    function postDetails() {
        setLoadStatus(true)
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "wittyweb")
        data.append("cloud_name", "wittywebcloud")
        fetch("https://api.cloudinary.com/v1_1/wittywebcloud/image/upload", {
            method: "POST",
            body: data
        }).then((res) => res.json())
            .then((data) => {
                fetch(`${import.meta.env.VITE_BACKEND_URI}/api/createwitpost`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("jwt")}`
                    },
                    body: JSON.stringify({
                        caption: caption,
                        content_pic: data.url,
                        witid: witid
                    })
                }).then(res => res.json())
                    .then(data => {
                        if (data.error == "Please add all the fields") {
                            notifyFields()
                            setLoadStatus(false)
                            return
                        }
                        if (data.error == "You must be logged in") {
                            notifysignin()
                            navigate("/signin")
                            setLoadStatus(false)
                            return
                        }
                        if (data.error == "Your post contains banned words") {
                            toast.warn("Your post contains banned words")
                            setCaption("");
                            setLoadStatus(false)
                            return
                        }
                        else {
                            notifySuccess()
                            navigate(`/wits/${witid}`)
                            setLoadStatus(false)
                            return
                        }
                    })
                    .catch(err => {
                        notifyError()
                        setLoadStatus(false)
                        return
                    })
            })
            .catch(err => {
                notifyError()
                setLoadStatus(false)
                return
            })
    }
    const loadFile = (event) => {
        var output = document.getElementById('output');
        output.src = URL.createObjectURL(event.target.files[0]);

        output.onload = function () {
            URL.revokeObjectURL(output.src)
        }
    }

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URI}/api/getuserdata`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify({
                userid: JSON.parse(localStorage.getItem("user"))._id
            })
        }).then(res => res.json())
            .then(data => {
                setProfilephotocreatebar(data[0].profile_photo)
            })
    }, [])
    return (
        <>
            <div className="createpost text-center flex flex-col gap-8">
                <h1 className='temp text-3xl font-bold'>Create Wit Post</h1>
                <div className='main-div flex flex-col '>
                    <div className="card-pic flex gap-2 items-center justify-center">
                        {(profilephotocreatebar && profilephotocreatebar != "") ?
                            <img src={profilephotocreatebar} alt="" width={80} height={80} className='min-w-5 min-h-5 rounded-full' draggable="false" />
                            :
                            <img src={usericon} alt="" width={80} height={80} className='min-w-5 min-h-5 rounded-full' draggable="false" />
                        }
                        <h5>@{JSON.parse(localStorage.getItem("user")).userName}</h5>
                        <textarea className='text' value={caption} onChange={(e) => setCaption(e.target.value)} placeholder='Write your caption here...'></textarea>
                    </div>
                    <img src={imageicon} alt="" id='output' className='preview' draggable="false" />
                    <input type="file" accept='image/*' onChange={(e) => {
                        loadFile(e)
                        setImage(e.target.files[0])
                    }} className='fileinput' />
                </div>
                {
                    (loadStatus) ?
                        <div className='postbutton flex justify-center items-center bg-[var(--body_background)]'>
                            <div className="newtons-cradle bg-[var(--body_background)] cursor-not-allowed">
                                <div className="newtons-cradle__dot threat"></div>
                                <div className="newtons-cradle__dot threat"></div>
                                <div className="newtons-cradle__dot threat"></div>
                                <div className="newtons-cradle__dot threat"></div>
                            </div>
                        </div>
                        :
                        <button className='postbutton' onClick={() => {
                            postDetails()
                        }}>Post</button>
                }
            </div>
        </>
    )
}

export default CreateWitPost