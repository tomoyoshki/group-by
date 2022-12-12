import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import {getRole, getToken} from '../../utils/useToken';
import './Dashboard.scss'
import UserBoard from '../../components/UserBoard/UserBoard';
import ProjectList from '../../components/ProjectList/ProjectList';
import axios from 'axios';

export default function Dashboard() {
    const [userToken, setUserToken] = useState(getToken())
    const [user, setUser] = useState()
    var nav = useNavigate()
    const getUser = async (user_id) => {
        // try {
        //     const url = "https://localhost:4000"
        //     const res = await axios.get(url);
        //     var fetched_user = res.data
        //     setUser(fetched_user)
        // } catch(e) {
        //     console.log(e)
        // }
    }


    useEffect(()=>{
        if(!userToken) {
            nav("/login")
        }
        getUser()
    }, [userToken])

    return(
        <div className='dashboard_page'>
            <ProjectList user={{title: "user number 1", role: "instructor"}}/>
            { getRole() === "instructor" ? <></> : <UserBoard user={user}/>}
        </div>
    );
}