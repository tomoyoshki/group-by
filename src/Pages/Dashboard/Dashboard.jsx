import React, { useState } from 'react';
import { useLocation, Navigate } from "react-router-dom";
import {getToken} from '../../utils/useToken';
import './Dashboard.scss'
import UserBoard from '../../components/UserBoard/UserBoard';
import ProjectList from '../../components/ProjectList/ProjectList';

export default function Dashboard() {
    if(!getToken()) {
        return <Navigate replace to="/login"/>
    }

    return(
        <div className='dashboard_page'>
            <ProjectList />
            <UserBoard />
        </div>
    );
}