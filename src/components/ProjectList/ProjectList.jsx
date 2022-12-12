import "./ProjectList.scss"
import Project from "../Project/Project"
import { Link, useNavigate } from "react-router-dom"
import { getRole, removeToken } from "../../utils/useToken"
import { useState, useEffect } from "react"
import axios from "axios"

export default function ProjectList({user_matched, user_unmatched}) {
    const nav = useNavigate()
    const [matched_team, setMatchedTeam] = useState([])
    const [unmatched_team, setUnmatchedTeam] = useState([])
    const instructor_style = getRole() === "instructor" ? {
        "width": "90vw",
        "position": "relative"
    } : {

    }

    const handleClick = (e) => {
        removeToken()
        console.log("Going to login")
        nav('/login')
    }

    const getTeams = async () => {
        try {
            const res = await axios.get("http://localhost:4000/api/assignments");

            if (res.status === 404) {
                console.log("Failed to find teams")
                return null
            }

        } catch(e) {
            console.log(e)
        }
    }

    useEffect(()=> {
        getTeams()
    }, [])
    return (
        <div className="project_list" style={instructor_style}>
            <div className="add_project">
            <Link to="/addproject" className="add_project_button">+ Add</Link>
            { getRole() === "instructor" ? <span to="/addproject" className="add_project_button" onClick={handleClick}>Sign out</span> : <></>}
            </div>
            <div className="project_section">
                {getRole().role === "student" ? <h2>Unmatched Projects</h2> : <h2>Projects</h2>}
                <div className="project_table">
                    <Project name={"CS 409 Final Project"} matched={false} />
                    <Project name={"CS 425 MP Partners"} matched={false} />
                    <Project name={"CS 225 Final Projeect"} matched={false} />
                </div>
            </div>
            <div className="project_section">
                {getRole().role === "student" ? <h2>Matched Projects</h2> : <></>}
                <div className="project_table">
                    <Project name={"CS 498 Final Project"} matched={true} />
                </div>
            </div>
        </div>
    )
}