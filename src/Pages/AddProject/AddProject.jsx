import './AddProject.scss'

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const nonexiststyle = {"color": "red", "fontSize": "10px"}

export default function AddProjectPage() {
    const navigate = useNavigate();
    const [projectCode, setProjectCode] = useState("");
    const [skills, setSkills] = useState("");
    const [description, setDescription] = useState("")
    const [validInput, setValid] = useState(true)

    const addProject = async (projectCode, skillset, description) => {

    }
    const handleSubmit = async e => {
        e.preventDefault();
        if (projectCode.length < 5 || description.length < 10) {
            setValid(false)
            return
        }
        var skillset = skills.split(',')
        for(let i = 0; i < skillset.length; i++) {
            skillset[i] = skillset[i].trim()
        }

        const project_ret = addProject(projectCode, skillset, description)
        if (project_ret) {
            navigate('/');
        } else {
            setValid(false)
            return
        }


    }
    return(
        <div className="addproject_page">
            <div className='addproject_wrapper'>
                <div className='addproject_form'>
                <div className='back' onClick={()=>navigate(-1)}>&#8592;</div>
                    <h1>Add project</h1>
                    <form onSubmit={handleSubmit}>
                        <label>
                            <p>Project join code</p>
                            <div className='button_wrapper'>
                                <input className="input_box" type="text" onChange={e => setProjectCode(e.target.value)}/>
                            </div>
                        </label>
                        <label>
                            <p>Skills <span>(separated by ,)</span></p>
                            <div className='button_wrapper'>
                                <input className="input_box" type="text" onChange={e => setSkills(e.target.value)}/>
                            </div>
                        </label>
                        <label>
                            <p>Description</p>
                            <div className='button_wrapper'>
                                <input className="input_box" type="text" onChange={e=> setDescription(e.target.value)}/>
                            </div>
                        </label>
                        {validInput ? <></> : <div style={nonexiststyle}>sorry, invalid join code</div>}
                        <div className='sign-in'>
                            <button type="submit">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}