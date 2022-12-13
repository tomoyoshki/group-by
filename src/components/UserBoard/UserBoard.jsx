import "./UserBoard.scss"
import { getToken, removeToken } from "../../utils/useToken"
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function UserBoard() {
    const [in_message, setInMessage] = useState([])

    const navigate = useNavigate();
    const getUser = async() => {
        try {
            const params = {
                user_get_request: getToken(),
            };

            const res = await axios.get("http://localhost:4000/api/requests", {params: {
                where : JSON.stringify(params)
            }});

            if (res.status === 404) {
                return
            }

            var data = res.data.data
            setInMessage(data)
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

    useEffect(()=>{
        console.log("Eff: ", in_message)
    }, [in_message])
    return (
        <div className="user_board">
            <div className="user_section">
                <div className="user_image"></div>
                <div className="title">{getToken() ? getToken().substr(0, 5) + getToken().substr(getToken().length - 5) : ""}</div>
                <div className="user_action">
                    <span>setting</span>
                    <span onClick={()=>{handleSignout()}}>sign out</span>
            </div>
            </div>
            <div className="message_section">
                <div className="message_title">Incomming Requests</div>
                {
                    console.log("div", in_message)
                }{
                    in_message.map(element=> {
                        console.log("map: ", element)
                        return (
                            <Link key={element.user_send_request + element.assignment_id} className="message" to={`/projects/${element.assignment_id}`}>
                                Assignment: {element.assignment_name}
                            </Link>
                        )
                    })
                }
            </div>
        </div>
    )
}