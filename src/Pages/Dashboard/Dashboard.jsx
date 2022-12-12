import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import {getRole, getToken} from '../../utils/useToken';
import './Dashboard.scss'
import UserBoard from '../../components/UserBoard/UserBoard';
import ProjectList from '../../components/ProjectList/ProjectList';
import axios from 'axios';

export default function Dashboard() {
    const [userToken, setUserToken] = useState(getToken())
    const [user, setUser] = useState({
        id: "",
        role: "",
        matched_assignment_ids: [],
        unmatched_assignment_ids: [],
        joined_team_ids: [],
        received_request_ids: [],
        sent_request_ids: []
    })
    var nav = useNavigate()
    const getUser = async () => {
        try {
            const params = {
                _id: userToken,
            };

            const res = await axios.get("http://localhost:4000/api/users", {params: {
                where : JSON.stringify(params)
            }});

            if (res.status === 404) {
                console.log("No user found")
                return null
            }

            const user_data = res.data.data[0]
            setUser({
                id: user_data._id,
                role: user_data.role,
                matched_assignment_ids: user_data.matched_assignment_ids,
                unmatched_assignment_ids: user_data.unmatched_assignment_ids,
                joined_team_ids: user_data.joined_team_ids,
                received_request_ids: user_data.received_request_ids,
                sent_request_ids: user_data.sent_request_ids
            })

            console.log(user)

        } catch(e) {
            console.log(e)
        }
    }


    useEffect(()=>{
        if(!userToken) {
            nav("/login")
        }
        getUser()
    }, [userToken])

    return(
        <div className='dashboard_page'>
            <ProjectList matched_teams={user.matched_assignment_ids} unmatched_teams={user.unmatched_assignment_ids}/>
            { getRole() === "instructor" ? <></> : <UserBoard user={user}/>}
        </div>
    );
}