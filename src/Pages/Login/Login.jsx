import React, { useState } from 'react';
import { Link, redirect } from 'react-router-dom';
import './Login.scss';
import { useNavigate } from 'react-router-dom'
import {setToken} from '../../utils/useToken'

async function loginUser(credentials) {
    return "some_token"
}

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async e => {
        e.preventDefault();
        const token = await loginUser({
            username,
            password
        });
        setToken(token)
        navigate('/');
    }
    return(
        <div className="login_page">
            <div className='login_wrapper'>
                <div className='login_form'>
                    <h1>Welcome Back</h1>
                    <form onSubmit={handleSubmit}>
                        <label>
                            <p>Email</p>
                            <div className='button_wrapper'>
                                <input className="input_box" type="text" onChange={e => setUsername(e.target.value)}/>
                            </div>
                        </label>
                        <label>
                            <p>Password</p>
                            <div className='button_wrapper'>
                                <input className="input_box" type="password" onChange={e=> setPassword(e.target.value)}/>
                            </div>
                        </label>
                        <div className='text'>Forgot password</div>
                        <div className='sign-in'>
                            <button type="submit">Sign in</button>
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