import React, { useEffect, useState } from 'react'
import { RiCloseLine } from "react-icons/ri";
import { NavLink } from 'react-router-dom';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import usericon from "../../../../assets/usericon.png"
import { toast } from "react-toastify";

const RequestList = ({ witid, setShowRequestList }) => {
    const [request_array, setRequest_array] = useState([])
    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URI}/api/joinrequestlist`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify({
                witid: witid
            })
        }).then(res => res.json())
            .then(result => {
                setRequest_array(result)
            })
    }, [request_array])

    const acceptRequest = (requestid) => {
        fetch(`${import.meta.env.VITE_BACKEND_URI}/api/acceptjoinrequest`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify({
                requestid: requestid,
                witid: witid
            })
        }).then(res => res.json())
            .then(result => {
                if (result) {
                    toast.success(`Accepted the join request!`)
                }
            })
    }

    const declineRequest = (requestid) => {
        fetch(`${import.meta.env.VITE_BACKEND_URI}/api/declinejoinrequest`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify({
                requestid: requestid,
                witid: witid
            })
        }).then(res => res.json())
            .then(result => {
                if (result) {
                    toast.success(`Declined the join request!`)
                }
            })
    }

    return (
        <>
            <div className="darkBg" onClick={() => setShowRequestList(false)}></div>
            <div className="centered">
                <div className="modal">
                    <div className="modalHeader">
                        <h1 className="heading font-bold">Requests: {request_array.length}</h1>
                    </div>
                    <div className="closeBtn">
                        <button onClick={() => setShowRequestList(false)}>
                            <RiCloseLine></RiCloseLine>
                        </button>
                    </div>
                    <div className="modalContent">
                        {request_array.map((item) => {
                            return (
                                <div className="likedBy flex flex-col" key={item._id}>
                                    <p className="font-bold text-left flex items-center justify-between mb-2">
                                        {item._id == JSON.parse(localStorage.getItem("user"))._id ?
                                            <NavLink draggable="false" to={`/profile`}>
                                                {(item.profile_photo && item.profile_photo != "") ?
                                                    <img src={item.profile_photo} alt='' className='h-10 rounded-full w-10' />
                                                    :
                                                    <img src={usericon} alt='' className='h-10 rounded-full w-10 border border-gray-400' />
                                                }
                                            </NavLink>
                                            :
                                            <NavLink draggable="false" to={`/profile/${item._id}`}>
                                                {(item.profile_photo && item.profile_photo != "") ?
                                                    <img src={item.profile_photo} alt='' className='h-10 rounded-full w-10' />
                                                    :
                                                    <img src={usericon} alt='' className='h-10 rounded-full w-10 border border-gray-400' />
                                                }
                                            </NavLink>}
                                        {item._id == JSON.parse(localStorage.getItem("user"))._id ?
                                            <NavLink draggable="false" to={`/profile`}>
                                                {`@${item.userName}`}
                                            </NavLink>
                                            :
                                            <NavLink draggable="false" to={`/profile/${item._id}`}>
                                                {`@${item.userName}`}
                                            </NavLink>}
                                        <div>
                                            <CloseIcon color='red' style={{ cursor: "pointer" }} onClick={() => declineRequest(item._id)} />
                                            <DoneIcon color='green' style={{ cursor: "pointer" }} onClick={() => acceptRequest(item._id)} />
                                        </div>
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}

export default RequestList