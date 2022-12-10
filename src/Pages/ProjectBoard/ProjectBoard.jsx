import React, { useState } from 'react';
import { useLocation, Navigate } from "react-router-dom";
import {getToken} from '../../utils/useToken';
import './ProjectBoard.scss'
import UserBoard from '../../components/UserBoard/UserBoard';
import ProjectGroup from '../../components/ProjectGroups/ProjectGroup';

export default function ProjectBoard() {
    if(!getToken()) {
        return <Navigate replace to="/login"/>
    }

    return(
        <div className='projectboard_page'>
            <ProjectGroup />
            <UserBoard />
        </div>
    );
}