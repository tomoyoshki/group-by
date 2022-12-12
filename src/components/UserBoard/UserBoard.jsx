import "./UserBoard.scss"
import { getToken, removeToken } from "../../utils/useToken"
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
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

            const request_ids = res.data.data[0].recevied_request_ids
            var local_in_messages = [{
                from_user: "me",
                assignment_id: 'some_id'
            }]
            request_ids.forEach(async (element) => {
                var p = {
                    _id: element
                }
                var res = await axios.get("http://localhost:4000/api/requests", {
                    params: {
                        where: JSON.stringify(p)
                    }
                })
                if (res.status === 404) return
                var data = res.data.data
                local_in_messages.push({
                    from_user: data.user_send_request,
                    assignment_id: data.assignment_id
                })
            })
            setInMessage(local_in_messages)
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
        console.log(in_message)
    }, [in_message])
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
                <div className="message_title">Incomming Requests</div>
                {
                    in_message.map(element=> {
                        console.log(element)
                        return (
                            <Link className="message">
                                Assignment: {element.assignment_id}
                            </Link>
                        )
                    })
                }
            </div>
        </div>
    )
}