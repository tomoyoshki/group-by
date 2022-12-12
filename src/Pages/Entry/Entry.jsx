import './Entry.scss';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from '../Dashboard/Dashboard';
import Application from '../Application/Application';
import NotFound from '../NotFound/NotFound';
import SignUp from '../Signup/SignUp';
import Login from '../Login/Login';
import ProjectBoard from '../ProjectBoard/ProjectBoard';
import AddProject from '../AddProject/AddProject'
import axios, { all } from 'axios';

function Entry() {
    const [allProjects, setAllProjects] = useState([])
    const getData = async () => {
        try {
            const url = "http://localhost:4000/api/assignments"
            const res = await axios.get(url);
            // get all course information
            const data = res.data.data
            setAllProjects(data)
        } catch(e) {
            console.log(e)
        }
    }

    useEffect(()=>{
        getData()
    }, [])
    return (
        <>
            <Router>
                <Routes>
                    <Route index element={<Dashboard projects={allProjects} setProject={setAllProjects}/>} />
                    <Route path='/project1' element={<ProjectBoard project_title={"CS 409 Final Project"}/>}/>
                    <Route path='/application' element={<Application />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/signup' element={<SignUp />} />
                    <Route path='/addproject' element={<AddProject />} />
                    {
                        allProjects.map((element) => {
                            return <Route key={element._id} path={"/projects/" + element._id} element={<ProjectBoard project={element} />} />
                        })
                    }
                    <Route path='*' element={<NotFound />} />
                </Routes>
            </Router>
        </>
    );
}

export default Entry;
