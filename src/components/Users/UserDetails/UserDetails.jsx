import { getToken, getRole } from "../../../utils/useToken";
import "./UserDetails.scss"
import axios from "axios";
import { useEffect, useState } from "react";

function hashString(str) {
    var hash = 0, i, chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

export default function UserDetails({target_user, project}) {
    const [received, setReceived] = useState("")
    const colormap = [
        "red",
        "green",
        "blue",
        "yellow",
        "purple"
    ]


    const getUser = async() => {
        try {
            const params = {
                user_get_request: getToken(),
            };

            const res = await axios.get("http://localhost:4000/api/requests", {params: {
                where : JSON.stringify(params)
            }});
            if (res.status === 404) {
                setReceived("")
                console.log("ASDasdjioqwe")
                return
            }

            var data = res.data.data
            for (let i = 0; i < data.length; i++) {
                if (data[i].assignment_id === project._id && data[i].user_get_request === getToken() && data[i].user_send_request === target_user.user_id) {
                    setReceived(data[i]._id)
                    break
                } else {
                    setReceived("")
                }
            }
        } catch(e) {
            console.log(e)
        }
    }

    const handleOnclick = async () => {
        try {
            const params = {
                assignment_id: project._id,
                user_get_request: target_user.user_id,
                user_send_request: getToken()
            }

            const url = "http://localhost:4000/api/requests"
            const res = await axios.post(url, params);
            console.log("Send request: ", res)
        } catch(e) {
            console.log(e)
        }
    }

    const handleApprove = async () => {
        try {
            const params = {
                _id: received
            }
            console.log(params)
            var res = await axios.delete(`http://localhost:4000/api/requests/${received}`)
            console.log(res)
            setReceived("")
        } catch(e) {
            console.log(e)
        }
    }

    useEffect(()=> {
        getUser()
    })
    return (
        <div className="user_details">
            <div className="user_section">
            <div className="user_image"></div>
            <div className="title">{target_user.user_id}</div>
            <div className="description"></div>
        </div>
        <div className="user_description">
            <div className="wrapper">{target_user.description}</div>
        </div>
        <div className="user_skills">
            {
                target_user.skills_list.map((element, i) => {
                    var hashed_idx = hashString(element)%5
                    hashed_idx = hashed_idx < 0 ? hashed_idx + 5 : hashed_idx
                    return <span className="skill" key={`skill_${i}`} style={{backgroundColor: colormap[hashed_idx]}}>{element}</span>
                })
            }
        </div>
        { getRole() === "student" ? <div className="user_action">
        {
            received !== "" ? <span onClick={handleApprove}>Approve Request</span> : <span onClick={handleOnclick}>Send Request</span>
        }
        </div> : <></>
        }
        </div>
    )
}