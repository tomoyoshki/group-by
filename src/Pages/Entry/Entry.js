import './Entry.scss';
import React, { useState } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from '../Dashboard/Dashboard';
import Application from '../Application/Application';
import NotFound from '../NotFound/NotFound';
import Login from '../Login/Login';


function Entry() {
    const [token, setToken] = useState();
    if(!token) {
        return <Login setToken={setToken} />
    }

    return (
        <div className="wrapper">
            <h1>Application</h1>
            <Router>
                <Routes>
                    <Route index element={<Dashboard />} />
                    <Route path='/dashboard' element={<Dashboard />} />
                    <Route path='/application' element={<Application />} />
                    <Route path='*' element={<NotFound />} />
                </Routes>
            </Router>
        </div>
    );
}

export default Entry;
