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


    useEffect(()=>{
        if(!userToken) {
            nav("/login")
        }
    }, [userToken])

    return(
        <div className='dashboard_page'>
            <ProjectList/>
            { getRole() === "instructor" ? <></> : <UserBoard user={user}/>}
        </div>
    );
}