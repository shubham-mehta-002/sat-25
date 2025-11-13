import React from "react";
import { RiCloseLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import "./LogoutBox.css";
import { toast } from "react-toastify";

export default function LogoutBox({ setModalOpen }) {
    const navigate = useNavigate();
    const notifyLogout = () => toast.success('Logged Out Successfully!')

    return (
        <>
            <div className="darkBg" onClick={() => setModalOpen(false)}></div>
            <div className="centered">
                <div className="modal1">
                    <div className="modalHeader">
                        <h1 className="heading font-bold">Confirm</h1>
                    </div>
                    <div className="closeBtn">
                        <button onClick={() => setModalOpen(false)}>
                            <RiCloseLine></RiCloseLine>
                        </button>
                    </div>
                    <div className="modalContent">Are you really want to log Out ?</div>
                    <div className="modalActions">
                        <div className="actionsContainer px-2 gap-2">
                            <button
                                className="logOutBtn"
                                onClick={() => {
                                    setModalOpen(false);
                                    localStorage.removeItem("jwt");
                                    localStorage.removeItem("user");
                                    localStorage.removeItem("userphoto");
                                    notifyLogout();
                                    navigate("./signin");
                                }}
                            >
                                Log Out
                            </button>

                            <button className="cancelBtn" onClick={() => setModalOpen(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}