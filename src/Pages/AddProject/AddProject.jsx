import './AddProject.scss'

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {setToken} from '../../utils/useToken'

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async e => {
        e.preventDefault();
        console.log(username)
        console.log(password)
        navigate('/');
    }
    return(
        <div className="addproject_page">
            <div className='addproject_wrapper'>
                <div className='addproject_form'>
                    <h1>Add project</h1>
                    <form onSubmit={handleSubmit}>
                        <label>
                            <p>Project join code</p>
                            <div className='button_wrapper'>
                                <input className="input_box" type="text" onChange={e => setUsername(e.target.value)}/>
                            </div>
                        </label>
                        <label>
                            <p>Skills</p>
                            <div className='button_wrapper'>
                                <input className="input_box" type="text" onChange={e => setUsername(e.target.value)}/>
                            </div>
                        </label>
                        <label>
                            <p>Description</p>
                            <div className='button_wrapper'>
                                <input className="input_box" type="password" onChange={e=> setPassword(e.target.value)}/>
                            </div>
                        </label>
                        <label>
                            <p>Others</p>
                            <div className='button_wrapper'>
                                <input className="input_box" type="password" onChange={e=> setPassword(e.target.value)}/>
                            </div>
                        </label>
                        <div className='sign-in'>
                            <button type="submit">Submit</button>
                        </div>
                    </form>

                    <div className='signup_form'>
                        Don't have an account? Click<Link className='signup_link' to="/signup">&nbsp;here&nbsp;</Link>to sign up
                    </div>
                </div>
            </div>
        </div>
    )
}