import React, { useState } from 'react';
import { Navigate } from "react-router-dom";
import {getToken} from '../../utils/useToken';
import './ProjectBoard.scss'
import ProjectGroup from '../../components/ProjectGroups/ProjectGroup';
import UserDetails from '../../components/Users/UserDetails/UserDetails';

export default function ProjectBoard({project}) {

    const [user, setUser] = useState({
        assignment_id: "",
        description: "",
        matched: false,
        skills_list: [],
        user_id: "",
        __v: -1,
        _id: ""
    })

    if(!getToken()) {
        return <Navigate replace to="/login"/>
    }
    return(
        <div className='projectboard_page'>
            <ProjectGroup project={project} setUser={setUser}/>
            {user.__v !== -1 ? <UserDetails target_user={user} project={project} /> : <></>}
        </div>
    );
}