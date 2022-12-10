import './Entry.scss';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from '../Dashboard/Dashboard';
import Application from '../Application/Application';
import NotFound from '../NotFound/NotFound';
import SignUp from '../Signup/SignUp';
import Login from '../Login/Login';
import ProjectBoard from '../ProjectBoard/ProjectBoard';


function Entry() {
    return (
        <>
            <Router>
                <Routes>
                    <Route index element={<Dashboard />} />
                    <Route path='/project1' element={<ProjectBoard />}/>
                    <Route path='project1/user1' element={<Login></Login>} />
                    <Route path='/application' element={<Application />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/signup' element={<SignUp />} />
                    <Route path='*' element={<NotFound />} />
                </Routes>
            </Router>
        </>
    );
}

export default Entry;
