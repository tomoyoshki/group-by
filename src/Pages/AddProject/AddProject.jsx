import './AddProject.scss'

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getRole, getToken } from '../../utils/useToken';
import axios from 'axios';
const nonexiststyle = {"color": "red", "fontSize": "10px"}

export default function AddProjectPage() {
    const navigate = useNavigate();
    const [projectCode, setProjectCode] = useState("");
    const [skills, setSkills] = useState("");
    const [description, setDescription] = useState("")
    const [validInput, setValid] = useState(true)
    const [projectName, setProjectName] = useState("")
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const addProject = async (projectCode, skillset, description) => {
        try {

            const params = {
                join_code: projectCode
            }
            const url = `http://localhost:4000/api/assignments`
            const res = await axios.get(url, {params: {
                where: JSON.stringify(params)
            }});

            if (res.status === 404) {
                return null
            }

            console.log(res.data.data[0])
            const post_params = {
                assignment_id: res.data.data[0]._id,
                user_id: getToken(),
                description: description,
                skills_list: skillset
            
            }
            const post_url = "http://localhost:4000/api/infos"
            const post_res = await axios.post(post_url, post_params)
            console.log(post_res)
            return post_res
        } catch(e) {
            console.log(e)
        }
    }
    const handleSubmit = async e => {
        e.preventDefault();
        if (description.length < 10) {
            setValid(false)
            return
        }
        var skillset = skills.split(',')
        for(let i = 0; i < skillset.length; i++) {
            skillset[i] = skillset[i].trim()
        }

        const project_ret = await addProject(projectCode, skillset, description)
        if (project_ret) {
            navigate('/');
        } else {
            setValid(false)
            return
        }
    }

    const handleNewProject = async e => {
        e.preventDefault();
        if (projectName.length < 1 || endDate < startDate) {
            setValid(false)
            return
        }
        setValid(true)

        const params = {
            assignment_name: projectName,
            instructor_id: getToken(),
            start_date: startDate,
            end_date: endDate

        };

        try {
            console.log(JSON.stringify(params))
            const res = await axios.post("http://localhost:4000/api/assignments", params);

            console.log(res)
        } catch(e) {

        }
        navigate("/")
    }

    const studentForm = () => {
        return (
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Project code</p>
                    <div className='button_wrapper'>
                        <input className="input_box" type="text" onChange={e => setProjectCode(e.target.value)}/>
                    </div>
                </label>
                <label>
                    <p>Skills <span>separted by ,</span></p>
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
        )
    }

    const instructorForm = () => {
        return (
            <form onSubmit={handleNewProject}>
                <label>
                    <p>Project name <span style={{color: "red"}}>*</span></p>
                    <div className='button_wrapper'>
                        <input className="input_box" type="text" onChange={e => setProjectName(e.target.value)}/>
                    </div>
                </label>
                <div className="date_wrapper">
                    <label>
                        <p>Start date</p>
                        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                    </label>
                    <label>
                        <p>End date</p>
                        <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
                    </label>
                </div>
                {validInput ? <></> : <div style={nonexiststyle}>sorry, invalid name or date</div>}
                <div className='sign-in'>
                    <button type="submit">Submit</button>
                </div>
            </form>
        )
    }
    return(
        <div className="addproject_page">
            <div className='addproject_wrapper'>
                <div className='addproject_form'>
                <div className='back' onClick={()=>navigate(-1)}>&#8592;</div>
                    <h1>Add project</h1>
                    {getRole() === "instructor" ? instructorForm() : studentForm()}
                </div>
            </div>
        </div>
    )
}