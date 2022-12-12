import "./UserBoard.scss"
import { getToken, removeToken } from "../../utils/useToken"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function UserBoard() {
    const [in_message, setInMessage] = useState([])
    const [out_message, setOutMessage] = useState([])

    const navigate = useNavigate();
    const getUser = async() => {
        try {
            const params = {
                _id: getToken(),
            };

            const res = await axios.get("http://localhost:4000/api/users", {params: {
                where : JSON.stringify(params)
            }});

            if (res.status === 404) {
                navigate("/login")
            }

            const user_data = res.data.data[0]
        } catch(e) {
            console.log(e)
        }
    }
    const handleSignout = ()=> {
        removeToken();
        navigate('/login')
    }

    useEffect(()=>{
        getUser()
    }, [])
    return (
        <div className="user_board">
            <div className="user_section">
                <div className="user_image"></div>
                <div className="title">Test user</div>
                <div className="user_action">
                    <span>setting</span>
                    <span onClick={()=>{handleSignout()}}>sign out</span>
            </div>
            </div>
            <div className="message_section">
                <div className="message_title">Incomming Messages</div>
            </div>
            <div className="message_section">
                <div className="message_title">Response Messages</div>
            </div>
        </div>
    )
}