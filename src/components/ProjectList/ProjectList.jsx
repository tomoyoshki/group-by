import "./ProjectList.scss"
import Project from "../Project/Project"
import { Link, Routes, Route, useNavigate } from "react-router-dom"
import { getRole, removeToken } from "../../utils/useToken"
export default function ProjectList({user}) {
    const nav = useNavigate()
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
    return (
        <div className="project_list" style={instructor_style}>
            <div className="add_project">
            <Link to="/addproject" className="add_project_button">+ Add</Link>
            { getRole() === "instructor" ? <span to="/addproject" className="add_project_button" onClick={handleClick}>Sign out</span> : <></>}
            </div>
            <div className="project_section">
                {user.role === "student" ? <h2>Unmatched Projects</h2> : <h2>Projects</h2>}
                <div className="project_table">
                    <Project name={"CS 409 Final Project"} matched={false} />
                    <Project name={"CS 425 MP Partners"} matched={false} />
                    <Project name={"CS 225 Final Projeect"} matched={false} />
                </div>
            </div>
            <div className="project_section">
                {user.role === "student" ? <h2>Matched Projects</h2> : <></>}
                <div className="project_table">
                    <Project name={"CS 498 Final Project"} matched={true} />
                </div>
            </div>
        </div>
    )
}