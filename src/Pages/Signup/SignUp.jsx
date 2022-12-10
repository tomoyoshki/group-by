import React, { useState } from 'react';
import './SignUp.scss';
import { Link } from 'react-router-dom';

async function signupUser(credentials) {
    return "some_token"
}

export default function SignUp({setToken}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async e => {
        e.preventDefault();
        const token = await signupUser({
            username,
            password
        });
        setToken(token)
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
                        {/*<div className='text'>Forgot password</div>*/}
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