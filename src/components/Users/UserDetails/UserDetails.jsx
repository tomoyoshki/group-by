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
            if (getToken() === target_user.user_id) {
                setReceived("self")
                return;
            }
            const params = {
                user_get_request: getToken(),
            };

            const res = await axios.get("http://localhost:4000/api/requests", {params: {
                where : JSON.stringify(params)
            }}).catch(e => {});
            if (res == null) {
                setReceived("")
                return
            }
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
            var res = await axios.delete(`http://localhost:4000/api/requests/${received}`)
            setReceived("")

            var this_user_param = {
                user_id: getToken(),
                assignment_id: project._id
            }

            var target_user_param = {
                user_id: target_user.user_id,
                assignment_id: project._id
            }

            var this_res = await axios.get("http://localhost:4000/api/infos/", {params: {
                where: JSON.stringify(this_user_param)
            }})

            var target_res = await axios.get("http://localhost:4000/api/infos/", {params: {
                where: JSON.stringify(target_user_param)
            }})

            var this_team_id = this_res.data.data[0].team_id
            var target_team_id = target_res.data.data[0].team_id

            if (this_team_id === "" && target_team_id === "") {
                var p = {
                    assignment_id: project._id,
                    user_ids: [getToken(), target_user.user_id]
                }
                await axios.post("http://localhost:4000/api/teams", p)
            } else if (this_team_id !== "" && target_team_id !== "") {
                alert("We do not approve two team compaction yet")
            }else if (this_team_id !== "") {

                // get the team and append the new user
                var teams = await axios.get(`http://localhost:4000/api/teams/${this_team_id}`)
                var tids = teams.data.data.user_ids
                tids.push(target_user.user_id)

                var p = {
                    assignment_id: project._id,
                    user_ids: tids
                }

                await axios.put(`http://localhost:4000/api/teams/${this_team_id}`, p)

            } else if (target_team_id !== "") {
                var teams2 = await axios.get(`http://localhost:4000/api/teams/${this_team_id}`)
                var tids2 = teams2.data.data.user_ids
                tids2.push(getToken())

                var p2 = {
                    assignment_id: project._id,
                    user_ids: tids2
                }
                await axios.put(`http://localhost:4000/api/teams/${target_team_id}`, p2)
            } 
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
            <div className="description">{target_user.team_id}</div>
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
            received === "self" ? <></> : received !== "" ? <span onClick={handleApprove}>Approve Request</span> :  <span onClick={handleOnclick}>Send Request</span>
        }
        </div> : <></>
        }
        </div>
    )
}