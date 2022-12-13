import React, { useState } from 'react';
import './SignUp.scss';
import { Link, useNavigate} from 'react-router-dom';
import { setRole, setToken } from '../../utils/useToken';
import axios from 'axios';

const nonexiststyle = {"color": "red", "fontSize": "10px"}

export default function SignUp() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setFormRole] = useState("student")
    const [invalidCredential, setCredential] = useState(true)
    
    const navigate = useNavigate()
    
    const createUser = async (user_email, user_password, user_role) => {
        try {
            const params = {
                email: user_email,
                password: user_password,
                role: user_role
            };

            const res = await axios.post("http://localhost:4000/api/users", params);
            if (res.status === 201) {
                return {
                    user_id: res.data.data._id,
                    user_email: res.data.data.email,
                    user_role: res.data.data.role
                }
            }
        } catch (e) {
            console.log(e)
        }
    }
    const handleSubmit = async e => {
        e.preventDefault();
        if (/^([a-zA-Z0-9_.-]+@[a-zA-Z0-9]+.[a-zA-Z]+)$/.test(username) === false || password.length < 6 ) {
            setCredential(false)
            return
        }
        const user = await createUser(username, password, role)
        if (!user) {
            setCredential(false)
            return
        } else {
            setCredential(true)
        }

        console.log(user)

        setToken(user.user_id)
        setRole(user.user_role)
        navigate('/')
    }
    return(
        <div className="signup_page">
            <div className='signup_wrapper'>
                <div className='signup_form'>
                    <h1>Sign Up</h1>
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
                        <label>
                            <p>Role</p>
                            <div className='button_wrapper' id='role'>
                                <input className="input_box" type="radio" value="student" checked={role === "student"} onChange={e=> setFormRole("student")}/>
                                <span>student</span>
                                <input className="input_box" type="radio" value="instructor" checked={role === "instructor"} onChange={e=> setFormRole("instructor")}/>
                                <span>instructor</span>
                            </div>
                        </label>
                        {invalidCredential ? <></> : <div style={nonexiststyle}>please enter valid credentials</div>}
                        <div className='sign-in'>
                            <button type="submit">Sign up</button>
                        </div>
                    </form>

                    <div className='signup_form'>
                        Already have an account? <Link className='signup_link' to="/login">&nbsp;here&nbsp;</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}