import React from "react";
import { RiCloseLine } from "react-icons/ri";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function DeleteWitPost({ setShowWitDeleteBox, post_id }) {
    const notifydelete = () => toast.success('Post deleted Successfully!')
    const notifysignin = () => toast.info('Please sign in first!')
    const notifyerror = () => toast.error('Error Occured!')

    const navigate = useNavigate();

    const DeletePost = (post_id) => {
        fetch(`${import.meta.env.VITE_BACKEND_URI}/api/deletewitpost/${post_id}`, {
            method: "delete",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            }
        }).then(res => res.json())
            .then(result => {
                if (result.error == "You must be logged in") {
                    notifysignin()
                    navigate('/signin')
                    return
                }
                if (result.error) {
                    notifyerror()
                    return
                }
                else {
                    notifydelete();
                    setShowWitDeleteBox(false);
                }
            })
    }

    return (
        <>
            <div className="darkBg" onClick={() => setShowWitDeleteBox(false)}></div>
            <div className="centered">
                <div className="modal1">
                    <div className="modalHeader">
                        <h1 className="heading font-bold">Confirm</h1>
                    </div>
                    <div className="closeBtn">
                        <button onClick={() => setShowWitDeleteBox(false)}>
                            <RiCloseLine></RiCloseLine>
                        </button>
                    </div>
                    <div className="modalContent">Do you really want to Delete this Post?</div>
                    <div className="modalActions">
                        <div className="actionsContainer px-2 gap-2">
                            <button
                                className="logOutBtn"
                                onClick={() => {
                                    DeletePost(post_id);
                                }}
                            >
                                Delete
                            </button>

                            <button className="cancelBtn" onClick={() => setShowWitDeleteBox(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}