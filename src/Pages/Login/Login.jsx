import React, { useState } from 'react';
import { Link, NavLink, useNavigate} from 'react-router-dom';
import './Login.scss';
import {getToken, setRole, setToken} from '../../utils/useToken'
import axios from 'axios';

const nonexiststyle = {"color": "red", "fontSize": "10px"}

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [userExist, setUserExist] = useState(true)
    const authenticateUser = async (user_email, user_password) => {
        try {
            const params = {
                email: user_email,
            };

            const res = await axios.get("http://localhost:4000/api/users", {params: {
                where : JSON.stringify(params)
            }});

            if (res.status === 404 || res.data.data[0].password !== user_password) {
                return null
            }

            return {
                user_email: res.data.data[0].email,
                user_id: res.data.data[0]._id,
                user_role: res.data.data[0].role
            }
        } catch(e) {
            console.log(e)
        }
    }

    const handleSubmit = async e => {
        e.preventDefault();
        if (/^([a-zA-Z0-9_.-]+@[a-zA-Z0-9]+.[a-zA-Z]+)$/.test(username) === false || password.length < 6 ) {
            alert("Please enter valid email or password with length greater than 6")
            return
        }
        const user = await authenticateUser(username, password)
        if (!user) {
            setUserExist(false)
            return
        }
        setRole(user.user_role)
        setToken(user.user_id)
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
                        {userExist ? <></> : <div style={nonexiststyle}>sorry, credential does not match</div>}
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