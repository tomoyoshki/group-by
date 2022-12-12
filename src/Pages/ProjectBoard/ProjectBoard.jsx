import React, { useState } from 'react';
import { useLocation, Navigate } from "react-router-dom";
import {getToken} from '../../utils/useToken';
import './ProjectBoard.scss'
import UserBoard from '../../components/UserBoard/UserBoard';
import ProjectGroup from '../../components/ProjectGroups/ProjectGroup';
import UserDetails from '../../components/Users/UserDetails/UserDetails';

export default function ProjectBoard({project_title}) {

    const [user, setUser] = useState()

    if(!getToken()) {
        return <Navigate replace to="/login"/>
    }
    return(
        <div className='projectboard_page'>
            <ProjectGroup project_title={project_title} setUser={setUser}/>
            {user ? <UserDetails user={user} skills={["react", "ml", "system", "skill 1", "skill2", "machien learning"]} /> : <></>}
        </div>
    );
}