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
    const [received, setReceived] = useState(false)
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
                _id: getToken(),
            };

            const res = await axios.get("http://localhost:4000/api/users", {params: {
                where : JSON.stringify(params)
            }});

            if (res.status === 404) {
                return
            }

            const user_data = res.data.data[0]
            console.log("User data: ", user_data)
            var request_ids = user_data.recevied_request_ids
            request_ids.forEach( async (element) =>{
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
                if (data.user_get_request === getToken() && data.user_send_request === target_user.user_id && data.assignment_id === project._id) {
                    setReceived(true)
                }
            });
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

            console.log(params)
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
                assignment_id: project._id,
                user_get_request: target_user.user_id,
                user_send_request: getToken()
            }
            console.log("approve request")
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
            received ? <span onClick={handleApprove}>Approve Request</span> : <span onClick={handleOnclick}>Send Request</span>
        }
        </div> : <></>
        }
        </div>
    )
}