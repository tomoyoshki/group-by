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
            const url = "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1200"
            const res = await axios.get(url);
            // get all course information
            const data = res.data.results
            setAllProjects(allProjects)
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
                            return <Route key={element.id} path={"/projects/" + element.id.toString()} element={<ProjectBoard project_title={element.title} />} />
                        })
                    }
                    <Route path='*' element={<NotFound />} />
                </Routes>
            </Router>
        </>
    );
}

export default Entry;
