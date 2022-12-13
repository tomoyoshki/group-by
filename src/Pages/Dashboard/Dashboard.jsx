import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import {getRole, getToken} from '../../utils/useToken';
import './Dashboard.scss'
import UserBoard from '../../components/UserBoard/UserBoard';
import ProjectList from '../../components/ProjectList/ProjectList';

export default function Dashboard() {
    const [userToken, setUserToken] = useState(getToken())
    var nav = useNavigate()


    useEffect(()=>{
        if(!userToken) {
            nav("/login")
        }
    }, [userToken, nav])

    return(
        <div className='dashboard_page'>
            <ProjectList/>
            { getRole() === "instructor" ? <></> : <UserBoard set={setUserToken}/>}
        </div>
    );
}